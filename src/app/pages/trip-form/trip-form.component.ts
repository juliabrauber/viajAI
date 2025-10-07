import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.scss'],
})
export class TripFormComponent {
  chatOpen = false;
  whatsAppLink = 'link';
  trip: Trip = {
    user: '',
    destination: '',
    days: 1,
    preferences: [],
  };

  otherPreference = '';

  allPreferences = [
    'Passeios e pontos turísticos',
    'Restaurantes e gastronomia',
    'Atividades culturais e eventos',
    'Emergências e dicas de segurança',
    'Outros',
  ];

  private router = inject(Router);

  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.trip.preferences.includes(value)) {
        this.trip.preferences.push(value);
      }
    } else {
      this.trip.preferences = this.trip.preferences.filter(
        (pref) => pref !== value
      );
    }
  }

  generateTrip() {
    if (!this.trip.destination || !this.trip.destination.trim()) {
      alert('Por favor, informe um destino válido ✈️');
      return;
    }

    if (this.trip.preferences.length === 0) {
      alert('Selecione pelo menos uma preferência ✨');
      return;
    }

    if (this.trip.days < 1) {
      this.trip.days = 1;
    }

    let preferences = [...this.trip.preferences];
    if (
      preferences.includes('Outros') &&
      this.otherPreference &&
      this.otherPreference.trim()
    ) {
      preferences = preferences.map((p) =>
        p === 'Outros' ? this.otherPreference.trim() : p
      );
    }

    this.router.navigate(['/result'], {
      queryParams: {
        user: this.trip.user,
        destination: this.trip.destination,
        days: this.trip.days,
        preferences: preferences,
      },
    });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }
  openWhatsApp() {
    window.open(this.whatsAppLink, '_blank');
  }
}
