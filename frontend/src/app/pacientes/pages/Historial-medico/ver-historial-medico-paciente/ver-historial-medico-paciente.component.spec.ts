import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHistorialMedicoPacienteComponent } from './ver-historial-medico-paciente.component';

describe('VerHistorialMedicoPacienteComponent', () => {
  let component: VerHistorialMedicoPacienteComponent;
  let fixture: ComponentFixture<VerHistorialMedicoPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerHistorialMedicoPacienteComponent]
    });
    fixture = TestBed.createComponent(VerHistorialMedicoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
