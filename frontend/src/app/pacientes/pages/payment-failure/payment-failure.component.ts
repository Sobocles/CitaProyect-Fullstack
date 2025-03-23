import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.scss']
})
export class PaymentFailureComponent {

  constructor(private router: Router) {}

  volverAAgendarCita(): void {
    this.router.navigate(['/Agendar-cita']);
  }

}
