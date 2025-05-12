import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTemplateComponent } from './map-template.component';

describe('MapTemplateComponent', () => {
  let component: MapTemplateComponent;
  let fixture: ComponentFixture<MapTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
