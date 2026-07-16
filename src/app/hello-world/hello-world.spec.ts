import { beforeEach, describe, expect, it } from 'vitest';
import { HelloWorld } from './hello-world';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

describe.only('HelloWorld', () => {
  let fixture: ComponentFixture<HelloWorld>;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let component: HelloWorld;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelloWorld],
    }).compileComponents();
    fixture = TestBed.createComponent(HelloWorld);
    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display the message', () => {
    const h1 = el.querySelector('h1');
    expect(h1).toBeDefined();
    expect(h1?.textContent).toEqual(component.message);
  });
});
