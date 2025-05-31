import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private token: string | null = null;
  private readonly authUrl = 'https://www.easysalespruebas.com.co/API_Proy_Facturacion/api/WS_FAC_01_Controller/WSFAC001';
  private readonly credentials = {
    Login: 'admin.facturacion',
    Password_Web: 'Easynet123'
  };

  constructor(private http: HttpClient) {}

  async getToken(): Promise<string> {
    if (this.token) return this.token;
    const resp: any = await firstValueFrom(this.http.post(this.authUrl, this.credentials));
    this.token = resp.Token;
    if (!this.token) {
      throw new Error('Failed to retrieve token');
    }
    return this.token;
  }
}