import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public baseUrl = 'https://dev-isf-ticketing-app.azurewebsites.net/api/v1/';
  public organisationID = '7065e94e-ace2-4846-9056-1638a97118e5';
}
