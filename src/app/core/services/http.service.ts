import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { CustomHttpParams } from '../types/custom-http-params.type';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private httpClient = inject(HttpClient);

  get<Req extends CustomHttpParams, Res>(url: string, params?: Req) {
    return this.httpClient.get<Res>(`${environment.apiUrl}${url}`, { params });
  }

  post<Req, Res>(url: string, body: Req | null) {
    return this.httpClient.post<Res>(`${environment.apiUrl}${url}`, body);
  }

  patch<Req, Res>(url: string, body: Req | null) {
    return this.httpClient.patch<Res>(`${environment.apiUrl}${url}`, body);
  }

  delete<Res>(url: string) {
    return this.httpClient.delete<Res>(`${environment.apiUrl}${url}`);
  }
}
