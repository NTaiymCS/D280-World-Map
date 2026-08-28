import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {

  constructor(private http: HttpClient) {}

  // Get information for one country
  getCountryInfo(countryCode: string): Observable<any> {
    return this.http.get(
      'https://api.worldbank.org/v2/country/' +
      countryCode +
      '?format=json'
    );
  }

  // Get GDP per capita for one country
  getGdpPerCapita(countryCode: string): Observable<any> {
    return this.http.get(
      'https://api.worldbank.org/v2/country/' +
      countryCode +
      '/indicator/NY.GDP.PCAP.CD?format=json&mrv=1'
    );
  }

  // Get GDP per capita for all countries
  getAllGdpPerCapita(): Observable<any> {
    return this.http.get(
      'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&mrv=1&per_page=400'
    );
  }

  // Get the country list so we can match
  // World Bank 3-letter codes to 2-letter codes
  getAllCountries(): Observable<any> {
    return this.http.get(
      'https://api.worldbank.org/v2/country?format=json&per_page=400'
    );
  }
}
