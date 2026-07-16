import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {getMockLessonsPage, MOCK_COURSES, MOCK_LESSONS} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {CoursePage} from './course-page';
import {ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {clickButton, getTableContent} from "../testing/testing-utils";


const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1, 3);
const SEARCH_RESULTS = getMockLessonsPage(1, 'Lesson 20', 'asc',0, 3);

describe('CoursePage', () => {
  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let de: DebugElement;
  let mockCoursesService:any;

  beforeEach(async () => {
    mockCoursesService = {
      findLessons: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        {provide: CoursesService, useValue: mockCoursesService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                course: MOCK_COURSES[0]
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    de = fixture.debugElement;
    component = fixture.componentInstance;

  });

  it('should load lessons on init', async () => {

    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE); // llamará a la función del servicio, pero como es un mock, no hace nada y devuelve lo que le digamos.

    await fixture.whenStable(); // Esperar a que todas las tareas asíncronas se completen antes de continuar con las afirmaciones

    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "asc", 0, 3); // Verificar que se haya llamado al servicio con los parámetros correctos

    const lessons = getTableContent(de, "tbody tr td.description-cell");
    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe("Lesson 1");
    expect(lessons[1]).toBe("Lesson 2");
    expect(lessons[2]).toBe("Lesson 3");

  });

  it('should show the loading spinner only while fetching', async () => {
    fixture.detectChanges();
    const spinner = de.query(By.css(".loading-spinner"));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);

     mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE); // llamará a la función del servicio, pero como es un mock, no hace nada y devuelve lo que le digamos.
    await fixture.whenStable();
    fixture.detectChanges();
    const spinnerAfter = de.query(By.css(".loading-spinner"));
    expect(spinnerAfter).toBeFalsy();
    expect(component.loading()).toBe(false);
  });

  it('should navigate to next page', async () => {

    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE); // hacemos que el mock devuelva la primera página de lecciones cuando se llame por primera vez.

    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenCalledOnce();
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE);// hacemos que el mock devuelva la segunda página de lecciones cuando se llame por segunda vez.

    // Simular el clic en el botón "Next"
    clickButton(de,".page-controls button:last-child");

    await fixture.whenStable();

    // Verificar que se haya llamado al servicio con los parámetros correctos para la segunda página
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3);

    const lessons = getTableContent(de, "tbody tr td.description-cell");
    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe("Lesson 4");
    expect(lessons[1]).toBe("Lesson 5");
    expect(lessons[2]).toBe("Lesson 6");

  });

  it('should navigate to previous page', async () => {

    mockCoursesService.findLessons
      .mockReturnValueOnce(SECOND_PAGE)  // ← Para la 1ª llamada
      .mockReturnValueOnce(FIRST_PAGE);  // ← Para la 2ª llamada , así porque vamos a probar la navegación a la página anterior.

    component.pageIndex.set(1);  // pageIndex = 1 es la segunda página (0-indexed)

    await fixture.whenStable(); // → Aquí se dispara findLessons(1, '', 'asc', 1, 3) → devuelve SECOND_PAGE

    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3);

    clickButton(de,".page-controls button:first-child"); // Simular el clic en el botón "Previous"

    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    const lessons = getTableContent(de, "tbody tr td.description-cell");
    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe("Lesson 1");
    expect(lessons[1]).toBe("Lesson 2");
    expect(lessons[2]).toBe("Lesson 3");
  });
  it('should toggle sort direction', async () => {

    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

    await fixture.whenStable();

    expect(component.sortDirection()).toBe("asc");

    mockCoursesService.findLessons.mockReturnValueOnce(
      MOCK_LESSONS.reverse().slice(0, 3)
    );

    clickButton(de, ".sortable");

    await fixture.whenStable();

    expect(component.sortDirection()).toBe("desc");

    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'desc', 0, 3);

    const lessons = getTableContent(de, "tbody tr td.description-cell");
    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe("Lesson 20");
    expect(lessons[1]).toBe("Lesson 19");
    expect(lessons[2]).toBe("Lesson 18");

  });

});






