import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trip-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-result.component.html',
  styleUrls: ['./trip-result.component.scss'],
})
export class TripResultComponent {
  trip: any;
  routeMap = {
    tripForm: '',
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (params['destination'] && params['days'] && params['preferences']) {
        this.trip = {
          destination: params['destination'],
          days: Number(params['days']),
          preferences: params['preferences'],
          itinerary: Array.from(
            { length: Number(params['days']) },
            (_, i) => `Atividade do dia ${i + 1}`
          ),
        };
      }
    });
  }

  goBack() {
    this.router.navigate(['/tripForm']);
  }
}
