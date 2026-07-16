import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TabsComponent } from './tabs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe.only('TabsComponent', () => {
  let fixture: ComponentFixture<TabsComponent>;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let component: TabsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabs', [
      { label: 'Begginer', value: 'Begginer' },
      { label: 'Advanced', value: 'Advanced' },
    ]);
    fixture.detectChanges();

    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should render the number of tabs based on the input', () => {
    // Con querySelectorAll
    // const tabElements = el.querySelectorAll('.tab-link');
    // console.log(tabElements); // NodeList [ <a>, <a> ]
    // console.log(tabElements[0].textContent); // Acceso a propiedades DOM

    // Con debugElement.queryAll
    const tabElements = debugElement.queryAll(By.css('.tab-link'));
    // console.log(tabElements); // Array [ DebugElement, DebugElement ]
    // console.log(tabElements[0].nativeElement); // Acceso al elemento nativo
    // console.log(tabElements[0].componentInstance); // Acceso al componente
    expect(tabElements.length).toBe(2);
    expect(tabElements[0].nativeElement.textContent.trim()).toContain('Begginer');
    expect(tabElements[1].nativeElement.textContent.trim()).toContain('Advanced');
  });

  it('should apply the active class to the selected tab', () => {
    fixture.componentRef.setInput('activeTab', 'Advanced');
    fixture.detectChanges();

    const tab = debugElement.query(By.css('.tab-link:last-child'));
    expect(tab.nativeElement.classList).toContain('active');
  });

  it('should emit the selected tab value when a tab is clicked', () => {
    const lastTabEl = debugElement.query(By.css('.tab-link:last-child'));
    lastTabEl.nativeElement.click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('Advanced');
  });

  it('should emit the tabChanged when a tab is clicked', () => {
    const tabChangedSpy = vi.spyOn(component.tabChanged, 'emit');
    const lastTabEl = debugElement.query(By.css('.tab-link:last-child'));
    lastTabEl.nativeElement.click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('Advanced');
    expect(tabChangedSpy).toHaveBeenCalledWith('Advanced');
    expect(tabChangedSpy).toHaveBeenCalledOnce();

  });


});
