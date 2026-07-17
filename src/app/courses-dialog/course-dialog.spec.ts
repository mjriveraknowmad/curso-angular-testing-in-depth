
import {describe, it, beforeEach, expect, vi} from "vitest";
import { CoursesDialog } from "./courses-dialog";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MOCK_COURSES} from '../testing/testing-data';
import { CoursesService } from "../services/courses.service";
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {clickButton} from '../testing/testing-utils';
import {FieldState} from '@angular/forms/signals';

describe('CoursesDialog', () => {
  let component: CoursesDialog;
  let fixture: ComponentFixture<CoursesDialog>;
  let de: DebugElement;
  let mockCoursesService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    // Simular el servicio, con función saveCourse  para que devuelva una promesa resuelta con un objeto vacío, ya que no nos interesa el valor de retorno en esta prueba.
    mockCoursesService = {
      saveCourse: vi.fn().mockResolvedValue({})
    }
    // Simular el DialogRef, con función close para que podamos verificar si se llama al cerrar el diálogo.
    mockDialogRef = {
      close: vi.fn()
    }

    await TestBed.configureTestingModule({
      imports: [CoursesDialog],
      providers: [
        {provide:CoursesService, useValue: mockCoursesService}, // Usamos el servicio simulado en lugar del real para que no haga llamadas HTTP reales durante las pruebas.
        {provide: DialogRef, useValue: mockDialogRef},
        {provide: DIALOG_DATA, useValue: {course: MOCK_COURSES[0]}} // Proporcionar datos simulados para el diálogo, en este caso, un curso de prueba.
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDialog);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should initialize the form with course data', () => {
    // Verificar que los campos del formulario se inicialicen correctamente con los datos del curso proporcionados en DIALOG_DATA.
    expect(component.courseForm.description().value()).toBe("Beginner Course");
    expect(component.courseForm.category().value()).toBe("BEGINNER");
    expect(component.courseForm.releasedAt().value())
      .toBe(new Date().toLocaleDateString("en-CA"));
    expect(component.courseForm.longDescription().value()).toBe("Theory");
    expect(component.courseForm().valid()).toBe(true);
  })

  it('should call saveCourse and close dialog', async () => {
    // Simular cambios en el formulario, en este caso, cambiar la descripción del curso.
    component.courseForm.description().value.set("New Course Title");
    fixture.detectChanges();

    clickButton(de, ".btn-primary");
    await fixture.whenStable();

    // Verifica que el objeto contenga AL MENOS esas propiedades
    // No requiere que el objeto tenga SOLO esas propiedades
    // E ignora propiedades adicionales
    expect(mockCoursesService.saveCourse).toHaveBeenLastCalledWith(
      1,
      expect.objectContaining({
        titles: expect.objectContaining({description: "New Course Title"})
      })
    )
    // Verificar que se haya llamado al método close del DialogRef para cerrar el diálogo después de guardar los cambios.
    expect(mockDialogRef.close).toHaveBeenCalled();

  })

  it('should handle all form field errors', async () => {
    // Verificar que los errores de validación se muestren correctamente para cada campo del formulario cuando se dejan vacíos y que el botón de guardar esté deshabilitado.
    testFieldError(component.courseForm.description(), ".description", "Description is required");
    testFieldError(component.courseForm.category(), ".category", 'Category is required');
    testFieldError(component.courseForm.releasedAt(), ".released-at", 'Release Date is required');
    testFieldError(component.courseForm.longDescription(), ".long-description", 'Long Description is required');
  })

  // Función auxiliar para verificar los errores de validación de un campo del formulario y el estado del botón de guardar.
  function testFieldError(fieldState:FieldState<any>, selector:string, message:string) {
    fieldState.value.set('');
    fieldState.markAsTouched();
    fixture.detectChanges();

    const errorList = de.query(By.css(`${selector} .error-list`));
    expect(errorList).toBeTruthy();
    expect(errorList.nativeElement.textContent).toContain(message);

    const saveBtn = de.query(By.css(".btn-primary"))?.nativeElement
    expect(saveBtn?.disabled).toBe(true);
  }

});
