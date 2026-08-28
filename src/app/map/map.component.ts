import { Component, AfterViewInit } from '@angular/core';
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

  constructor(private worldBankService: WorldBankService) {}

  ngAfterViewInit(): void {
    this.loadMapData();
  }

  // Load GDP data for the map
  loadMapData(): void {

    this.worldBankService.getAllGdpPerCapita().subscribe(data => {

      if (!data || !data[1]) {
        return;
      }

      const countries = data[1];

      countries.forEach((country: any) => {

        if (
          country.countryiso3code &&
          country.value !== null
        ) {

          const countryPath =
            document.getElementById(
              country.countryiso3code.toLowerCase()
            );

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
          }
        }
      });
    });
  }


  // Get a color based on GDP per capita
  getCountryColor(value: number): string {

    if (value >= 50000) {
      return '#2e8b57';
    }

    if (value >= 25000) {
      return '#72a66f';
    }

    if (value >= 10000) {
      return '#d6b65c';
    }

    if (value >= 5000) {
      return '#d98b4f';
    }

    return '#c85c5c';
  }


  // Get country information
  selectCountry(event: MouseEvent): void {

    const country =
      event.target as SVGPathElement;

    if (
      country.tagName.toLowerCase() === 'path'
    ) {

      const countryCode =
        country.id;

      this.worldBankService
        .getCountryInfo(countryCode)
        .subscribe(data => {

          console.log(data);

          if (data && data[1] && data[1][0]) {
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
}
