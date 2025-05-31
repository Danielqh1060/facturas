import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers(customer: Customer): Observable<any> {
    return this.http.post<any>(`${environment.URL_API}/WS_FAC_08_Controller/WSFAC001`, customer);
  }
}
