import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.scss'],
})
export class TripFormComponent {
  trip = {
    destination: '',
    days: 1,
    preferences: 'cultura',
  };
  constructor(private router: Router) {}
  tripResult: any = null;

  generateTrip() {
    if (!this.trip.destination || this.trip.destination.trim().length === 0) {
      alert('Por favor, informe um destino válido ✈️');
      return;
    }

    if (this.trip.days < 1) {
      this.trip.days = 1;
    }
    this.tripResult = {
      destination: this.trip.destination,
      days: this.trip.days,
      preferences: this.trip.preferences,
      itinerary: Array.from(
        { length: this.trip.days },
        (_, i) => `Atividade do dia ${i + 1}`
      ),
    };
    this.router.navigate(['/resultado'], { queryParams: this.trip });
  }
}
