import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {getMockLessonsPage, MOCK_COURSES} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {CoursePage} from './course-page';
import {ActivatedRoute} from '@angular/router';
import {getTextContent} from "../testing/testing-utils";


const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);

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

    const lessons = getTextContent(de, "tbody tr td.description-cell");
    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe("Lesson 1");
    expect(lessons[1]).toBe("Lesson 2");
    expect(lessons[2]).toBe("Lesson 3");

  });


});






