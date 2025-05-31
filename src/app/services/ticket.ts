import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  list(body: { Cliente_Id: string }): Observable<any> {
    return this.http.post<any>(`${environment.URL_API}/WS_FAC_09_Controller/WSFAC001`, body);
  }
  create(body: any): Observable<any> {
    return this.http.post<any>(`${environment.URL_API}/WS_FAC_09_Controller/WSFAC002`, body);
  }
  update(ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${environment.URL_API}/WS_FAC_09_Controller/WSFAC002`, ticket);
  }
  delete(id: number): Observable<Ticket> {
    return this.http.delete<Ticket>(`${environment.URL_API}/WS_FAC_09_Controller/WSFAC002`);
  }
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL_API}/WS_FAC_09_Controller/WSFAC001?id=${id}`);
  }
}
