import {
  Component,
  AfterViewInit
} from '@angular/core';

import { WorldBankService } from '../world-bank.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {

  countryInfo: any = {
    name: '',
    capitalCity: '',
    region: { value: '' },
    incomeLevel: { value: '' },
    longitude: '',
    latitude: ''
  };

  selectedGdp: number | null = null;

  constructor(
    private worldBankService: WorldBankService
  ) {}

  ngAfterViewInit(): void {
    this.loadMapData();
  }

  // Load GDP data and color the map
  loadMapData(): void {

    this.worldBankService
      .getAllGdpPerCapita()
      .subscribe(data => {

        if (!data || !data[1]) {
          return;
        }

        const countries = data[1];

        countries.forEach((country: any) => {

          if (
            country.countryiso2code &&
            country.value !== null
          ) {

            const countryId =
              country.countryiso2code.toLowerCase();

            const countryPath =
              document.getElementById(countryId);

            if (countryPath) {

              const color =
                this.getCountryColor(country.value);

              countryPath.setAttribute(
                'style',
                `fill: ${color};`
              );

              countryPath.setAttribute(
                'data-gdp',
                country.value.toString()
              );

              countryPath.setAttribute(
                'title',
                `${country.country.value}: $${this.formatNumber(country.value)} GDP per capita`
              );
            }
          }
        });
      });
  }


  // Decide the country color based on GDP
  getCountryColor(value: number): string {

    if (value >= 50000) {
      return '#176b4d';
    }

    if (value >= 25000) {
      return '#4d956c';
    }

    if (value >= 10000) {
      return '#d4b24c';
    }

    if (value >= 5000) {
      return '#dc8744';
    }

    return '#c94f52';
  }


  // Format numbers for the country tooltip
  formatNumber(value: number): string {

    return new Intl.NumberFormat(
      'en-US',
      {
        maximumFractionDigits: 0
      }
    ).format(value);
  }


  // Select a country
  selectCountry(event: MouseEvent): void {

    const country =
      event.target as SVGPathElement;

    if (
      country.tagName.toLowerCase() !== 'path'
    ) {
      return;
    }

    const countryCode =
      country.id.toLowerCase();

    // Get basic country information
    this.worldBankService
      .getCountryInfo(countryCode)
      .subscribe(data => {

        console.log(data);

        if (
          data &&
          data[1] &&
          data[1][0]
        ) {

          this.countryInfo =
            data[1][0];
        }
      });


    // Get GDP for selected country
    this.worldBankService
      .getGdpPerCapita(countryCode)
      .subscribe(data => {

        if (
          data &&
          data[1] &&
          data[1][0]
        ) {

          this.selectedGdp =
            data[1][0].value;
        }
      });
  }
}
