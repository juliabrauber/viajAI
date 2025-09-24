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
    user: '',
    destination: '',
    days: 1,
    preferencesList: [] as string[],
    otherPreference: '',
  };

  allPreferences = [
    'Passeios e pontos turísticos',
    'Restaurantes e gastronomia',
    'Atividades culturais e eventos',
    'Emergências e dicas de segurança',
    'Outros',
  ];

  constructor(private router: Router) {}

  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.trip.preferencesList.includes(value)) {
        this.trip.preferencesList.push(value);
      }
    } else {
      this.trip.preferencesList = this.trip.preferencesList.filter(
        (pref) => pref !== value
      );
    }
  }

  generateTrip() {
    if (!this.trip.destination || !this.trip.destination.trim()) {
      alert('Por favor, informe um destino válido ✈️');
      return;
    }

    if (this.trip.preferencesList.length === 0) {
      alert('Selecione pelo menos uma preferência ✨');
      return;
    }

    if (this.trip.days < 1) {
      this.trip.days = 1;
    }

    let preferences = [...this.trip.preferencesList];
    if (
      preferences.includes('Outros') &&
      this.trip.otherPreference &&
      this.trip.otherPreference.trim()
    ) {
      preferences = preferences.map((p) =>
        p === 'Outros' ? this.trip.otherPreference.trim() : p
      );
    }

    this.router.navigate(['/resultado'], {
      queryParams: {
        user: this.trip.user,
        destination: this.trip.destination,
        days: this.trip.days,
        preferences: preferences,
      },
    });
  }
}
