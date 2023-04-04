import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProductListComponent } from './shared-product-list-component';

describe('SharedProductListComponentComponent', () => {
  let component: SharedProductListComponent;
  let fixture: ComponentFixture<SharedProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
