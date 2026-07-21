import {beforeEach, describe, vi, it, expect} from 'vitest';
import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {CoursePage} from '../course-page/course-page';
import {provideRouter, Router} from '@angular/router';
import {courseResolver} from './course.resolver';
import {RouterTestingHarness} from '@angular/router/testing';
import {MOCK_COURSES, MOCK_LESSONS} from '../testing/testing-data';

describe('CourseResolver', () => {
  let mockCoursesService:any;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    // Simulación del servicio CoursesService para pruebas, con funcionalidad mínima que usa el resolver que vamos a probar.
    mockCoursesService = {
      findCourseById: vi.fn()
    }

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        {provide: CoursesService, useValue: mockCoursesService}, // Inyectamos el servicio simulado en lugar del real
        provideRouter([{                     //Configuramos la ruta para el componente CoursePage y asociamos el resolver courseResolver a la ruta
          path: 'courses/:id',
          component: CoursePage,
          resolve: {
            course: courseResolver
          }
        }])
      ]
    }).compileComponents();

    // Creamos un RouterTestingHarness para simular la navegación y probar el resolver en un entorno de prueba.
    harness = await RouterTestingHarness.create();
  })

  it("should load correct course by Id", async () => {
    // Configuramos el mock, para que devuelva un curso específico cuando se llame a findCourseById
    mockCoursesService.findCourseById.mockResolvedValueOnce(MOCK_COURSES[0]);
    // Usando la instancia de RouterTestingHarness, simulamos la navegación a la ruta /courses/1, lo que debería activar el resolver y cargar el curso correspondiente.
    const component = await harness.navigateByUrl('/courses/1', CoursePage);

    expect(TestBed.inject(Router).url).toBe("/courses/1");

    expect(mockCoursesService.findCourseById).toHaveBeenCalledOnce();
    expect(mockCoursesService.findCourseById).toHaveBeenLastCalledWith("1");

    expect(component.course()).toEqual(MOCK_COURSES[0]);
    // Usando la instancia de RouterTestingHarness, accedemos al dom cargado. Y comprobamos que el contenido contiene el nombre del curso cargado.
    expect(harness.routeNativeElement?.textContent).toContain("Beginner Course");

  })

})





