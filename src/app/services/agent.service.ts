import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private http = inject(HttpClient);

  sendTrip(trip: Trip): Observable<any> {
    return this.http.post(`${environment.apiUrl}/`, { trip });
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/`, { message });
  }
}
