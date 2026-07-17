import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {CoursesService} from './courses.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Course} from '../model/course';
import {createCourse, MOCK_COURSES} from '../testing/testing-data';
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })

    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que no haya solicitudes HTTP pendientes después de cada prueba para asegurarse de que todas las solicitudes esperadas se hayan manejado correctamente.
    httpTestingController.verify();
  });

  it('should load all courses', async () => {

    const coursesPromise = service.reloadAllCourses();

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toBe("GET");
    // Simular la respuesta del servidor con los datos de prueba (MOCK_COURSES) para que la promesa se resuelva correctamente.
    req.flush({payload: MOCK_COURSES});

    const result = await coursesPromise;

    expect(result).toBe(MOCK_COURSES);
    expect(service.allCourses()).toBe(MOCK_COURSES);

  });

  it('should get course by Id', async () => {
    const coursePromise = service.findCourseById(1);

    const req = httpTestingController.expectOne('/api/courses/1');
    expect(req.request.method).toBe('GET')
    req.flush(MOCK_COURSES[0]);

    const course = await coursePromise;
    expect(course.id).toBe(1);
    expect(course.titles.description).toBe('Beginner Course');
  });


  it('should find lessons by query', async () => {

    const promise = service.findLessons(12, 'filter-text', 'desc', 2, 10);
    // En este caso, no sabemos la URL exacta que se generará, ya que depende de los parámetros, por ej. /api/lessons?courseId=12&filter=filter-text&sortOrder=desc&pageNumber=2&pageSize=10
    // por lo que usamos una función para verificar la URL en lugar de una cadena exacta.
    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

    // Verificar que la solicitud HTTP tenga los parámetros correctos
    const params = req.request.params;
    expect(params.get('courseId')).toBe('12');
    expect(params.get('filter')).toBe('filter-text');
    expect(params.get('sortOrder')).toBe('desc');
    expect(params.get('pageNumber')).toBe('2');
    expect(params.get('pageSize')).toBe('10');

    const mockLessons = {payload: [{id: 12, description: "Lesson 1"}]};
    // Simular la respuesta del servidor con los datos de prueba (mockLessons) para que la promesa se resuelva correctamente.
    req.flush(mockLessons);

    const result = await promise;

    expect(result).toBe(mockLessons.payload);

  })

  it('should save course', async () => {
    const course1 = createCourse({id: 1, titles: {description: 'Initial Title'}});
    const course2 = createCourse({id: 2, titles: {description: 'Stay Same'}});

    const loadPromise = service.reloadAllCourses();
    const loadReq = httpTestingController.expectOne("/api/courses");
    loadReq.flush({payload: [course1, course2]});
    await loadPromise;

    const changes: Partial<Course> = {
      titles: {description: "New Title"}
    }

    const savePromise = service.saveCourse(1, changes);
    const saveReq = httpTestingController.expectOne("/api/courses/1");
    expect(saveReq.request.method).toBe('PUT');
    expect(saveReq.request.body).toBe(changes);
    // Simular la respuesta del servidor con los datos que había y le añadimos el nuevo curso
    saveReq.flush({...course1, ...changes});
    await savePromise;

    const allCourses = service.allCourses();
    expect(allCourses[0].titles.description).toBe("New Title");
    expect(allCourses[1].id).toBe(2);
    expect(allCourses[1].titles.description).toBe('Stay Same');
  })

  it('should handle 404 error', async () => {
    const coursePromise = service.findCourseById(999);

    const req = httpTestingController.expectOne('/api/courses/999');
    req.flush('Course not found', {
      status: 404,
      statusText: 'Not Found'
    });
    // Verificar que la promesa se rechace con un error, ya que el servidor hicimos que respondiera con un error 404.
    expect(coursePromise).rejects.toThrow();
  });

  it('should handle network error ', async () => {
    const coursePromise = service.findCourseById(1);

    const req = httpTestingController.expectOne('/api/courses/1');
    // Simular un error de red en la solicitud HTTP para que la promesa se rechace con un error.
    req.error(new ProgressEvent('network error'));

    // Verificar que la promesa se rechace con un error, ya que simulamos un error de red en la solicitud HTTP.
    expect(coursePromise).rejects.toThrow();
  });



});



