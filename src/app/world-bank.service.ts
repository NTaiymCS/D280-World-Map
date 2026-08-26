import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {

  constructor(private http: HttpClient) { }

  getCountryInfo(countryCode: string): Observable<any> {
    return this.http.get(
      'https://api.worldbank.org/v2/country/' + countryCode + '?format=json'
    );
  }
}
