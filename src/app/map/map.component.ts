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


  // Load the World Bank data
  // and use it to color the map
  loadMapData(): void {

    this.worldBankService
      .getAllCountries()
      .subscribe(countryData => {

        if (!countryData || !countryData[1]) {
          return;
        }

        const countries = countryData[1];

        const countryMap: {
          [key: string]: string
        } = {};

        countries.forEach((country: any) => {

          if (
            country.id &&
            country.iso2Code
          ) {

            countryMap[
              country.id.toUpperCase()
            ] = country.iso2Code.toLowerCase();
          }
        });


        this.worldBankService
          .getAllGdpPerCapita()
          .subscribe(gdpData => {

            if (!gdpData || !gdpData[1]) {
              return;
            }

            const gdpCountries = gdpData[1];

            gdpCountries.forEach(
              (country: any) => {

                if (
                  country.countryiso3code &&
                  country.value !== null
                ) {

                  const iso3 =
                    country.countryiso3code.toUpperCase();

                  const iso2 =
                    countryMap[iso3];

                  if (!iso2) {
                    return;
                  }

                  const countryPath =
                    document.getElementById(iso2);

                  if (!countryPath) {
                    return;
                  }

                  const color =
                    this.getCountryColor(
                      country.value
                    );

                  countryPath.style.fill =
                    color;

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
            );
          });
      });
  }


  // Assign a color based on GDP per capita
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


  // Format numbers for the map
  formatNumber(value: number): string {

    return new Intl.NumberFormat(
      'en-US',
      {
        maximumFractionDigits: 0
      }
    ).format(value);
  }


  // Select a country on the map
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


    // Get country information
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
