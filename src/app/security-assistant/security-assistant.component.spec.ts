import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityAssistantComponent } from './security-assistant.component';

describe('SecurityAssistantComponent', () => {

  let component: SecurityAssistantComponent;
  let fixture: ComponentFixture<SecurityAssistantComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [SecurityAssistantComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityAssistantComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});