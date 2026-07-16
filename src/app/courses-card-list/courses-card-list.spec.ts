import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { MOCK_COURSES } from '../testing/testing-data';
import { CoursesCardList } from './courses-card-list';

describe.only('CoursesCardList', () => {
  let fixture: ComponentFixture<CoursesCardList>;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let component: CoursesCardList;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoursesCardList],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCardList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('courses', MOCK_COURSES);
    fixture.detectChanges();

    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });
it('should display the course list', () => {
    const cardTitles = debugElement.queryAll(By.css(".course-card .card-header"));
    expect(cardTitles.length).toBe(2);
    const titleEl = cardTitles[0].nativeElement;
    expect(titleEl.textContent).toBe("Beginner Course");
  });

  it('should display message when no courses', () => {
    fixture.componentRef.setInput('courses', []);
    fixture.detectChanges();
    const msg = debugElement.query(By.css(".no-courses"));
    expect(msg).toBeTruthy();
    expect(msg.nativeElement.textContent).toContain("No courses found");
  });

  it('should open dialog when clicking the edit button', () => {
    const btn = debugElement.query(By.css(".course-card:first-child .edit-btn"));
    btn.nativeElement.click();
    fixture.detectChanges();

    const form = document.querySelectorAll(".course-form");
    // El segundo parámetro es un mensaje personalizado de error que se muestra cuando la afirmación falla.
    expect(form, "The edit course form should be visible.").toBeTruthy();
  });
});
