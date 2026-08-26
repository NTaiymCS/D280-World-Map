import { Component } from '@angular/core';
import { WorldBankService } from '../world-bank.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  countryInfo: any = {
    name: '',
    capitalCity: '',
    region: { value: '' },
    incomeLevel: { value: '' },
    longitude: '',
    latitude: ''
  };

  constructor(private worldBankService: WorldBankService) {}

  selectCountry(event: MouseEvent) {
    const country = event.target as SVGPathElement;

    if (country.tagName.toLowerCase() === 'path') {
      const countryCode = country.id;

      this.worldBankService.getCountryInfo(countryCode).subscribe(data => {
        console.log(data);
        this.countryInfo = data[1][0];
      });
    }
  }
}
