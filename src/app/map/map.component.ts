import {
  AfterViewInit,
  Component
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


  // Load World Bank GDP data
  // and apply colors to the SVG map
  loadMapData(): void {

    this.worldBankService
      .getAllGdpPerCapita()
      .subscribe(data => {

        if (!data || !data[1]) {
          console.log('No GDP data returned');
          return;
        }

        const gdpData = data[1];

        console.log(
          'GDP records loaded:',
          gdpData.length
        );


        gdpData.forEach((country: any) => {

          if (
            !country.countryiso3code ||
            country.value === null
          ) {
            return;
          }


          /*
           * The World Bank gives us a 3-letter
           * country code.
           *
           * Your SVG uses 2-letter country IDs.
           *
           * We convert the common ISO codes here.
           */

          const countryCode =
            this.getIso2Code(
              country.countryiso3code
            );


          if (!countryCode) {
            return;
          }


          const countryPath =
            document.getElementById(
              countryCode
            );


          if (!countryPath) {
            return;
          }


          const color =
            this.getCountryColor(
              Number(country.value)
            );


          countryPath.style.setProperty(
            'fill',
            color,
            'important'
          );


          countryPath.setAttribute(
            'data-gdp',
            country.value.toString()
          );


          countryPath.setAttribute(
            'title',
            `${country.country.value}: $${this.formatNumber(country.value)} GDP per capita`
          );

        });

      });
  }


  // Convert World Bank ISO-3 codes
  // to the 2-letter IDs used by the SVG
  getIso2Code(code: string): string {

    const codes: {
      [key: string]: string
    } = {

      AFG: 'af',
      ALB: 'al',
      DZA: 'dz',
      AND: 'ad',
      AGO: 'ao',
      ARG: 'ar',
      ARM: 'am',
      AUS: 'au',
      AUT: 'at',
      AZE: 'az',

      BHS: 'bs',
      BHR: 'bh',
      BGD: 'bd',
      BRB: 'bb',
      BLR: 'by',
      BEL: 'be',
      BLZ: 'bz',
      BEN: 'bj',
      BTN: 'bt',
      BOL: 'bo',
      BIH: 'ba',
      BWA: 'bw',
      BRA: 'br',
      BRN: 'bn',
      BGR: 'bg',
      BFA: 'bf',
      BDI: 'bi',

      CPV: 'cv',
      KHM: 'kh',
      CMR: 'cm',
      CAN: 'ca',
      CAF: 'cf',
      TCD: 'td',
      CHL: 'cl',
      CHN: 'cn',
      COL: 'co',
      COM: 'km',
      COD: 'cd',
      COG: 'cg',
      CRI: 'cr',
      CIV: 'ci',
      HRV: 'hr',
      CUB: 'cu',
      CYP: 'cy',
      CZE: 'cz',

      DNK: 'dk',
      DJI: 'dj',
      DMA: 'dm',
      DOM: 'do',
      ECU: 'ec',
      EGY: 'eg',
      SLV: 'sv',
      GNQ: 'gq',
      ERI: 'er',
      EST: 'ee',
      SWZ: 'sz',
      ETH: 'et',

      FJI: 'fj',
      FIN: 'fi',
      FRA: 'fr',
      GAB: 'ga',
      GMB: 'gm',
      GEO: 'ge',
      DEU: 'de',
      GHA: 'gh',
      GRC: 'gr',
      GRD: 'gd',
      GTM: 'gt',
      GIN: 'gn',
      GNB: 'gw',
      GUY: 'gy',
      HTI: 'ht',
      HND: 'hn',
      HUN: 'hu',

      ISL: 'is',
      IND: 'in',
      IDN: 'id',
      IRN: 'ir',
      IRQ: 'iq',
      IRL: 'ie',
      ISR: 'il',
      ITA: 'it',
      JAM: 'jm',
      JPN: 'jp',
      JOR: 'jo',
      KAZ: 'kz',
      KEN: 'ke',
      KIR: 'ki',
      PRK: 'kp',
      KOR: 'kr',
      KWT: 'kw',
      KGZ: 'kg',
      LAO: 'la',
      LVA: 'lv',
      LBN: 'lb',
      LSO: 'ls',
      LBR: 'lr',
      LBY: 'ly',
      LIE: 'li',
      LTU: 'lt',
      LUX: 'lu',

      MDG: 'mg',
      MWI: 'mw',
      MYS: 'my',
      MDV: 'mv',
      MLI: 'ml',
      MLT: 'mt',
      MHL: 'mh',
      MRT: 'mr',
      MUS: 'mu',
      MEX: 'mx',
      FSM: 'fm',
      MDA: 'md',
      MCO: 'mc',
      MNG: 'mn',
      MNE: 'me',
      MAR: 'ma',
      MOZ: 'mz',
      MMR: 'mm',

      NAM: 'na',
      NRU: 'nr',
      NPL: 'np',
      NLD: 'nl',
      NZL: 'nz',
      NIC: 'ni',
      NER: 'ne',
      NGA: 'ng',
      MKD: 'mk',
      NOR: 'no',
      OMN: 'om',
      PAK: 'pk',
      PLW: 'pw',
      PAN: 'pa',
      PNG: 'pg',
      PRY: 'py',
      PER: 'pe',
      PHL: 'ph',
      POL: 'pl',
      PRT: 'pt',
      QAT: 'qa',
      ROU: 'ro',
      RUS: 'ru',
      RWA: 'rw',

      WSM: 'ws',
      SMR: 'sm',
      STP: 'st',
      SAU: 'sa',
      SEN: 'sn',
      SRB: 'rs',
      SYC: 'sc',
      SLE: 'sl',
      SGP: 'sg',
      SVK: 'sk',
      SVN: 'si',
      SLB: 'sb',
      SOM: 'so',
      ZAF: 'za',
      SSD: 'ss',
      ESP: 'es',
      LKA: 'lk',
      KNA: 'kn',
      LCA: 'lc',
      VCT: 'vc',
      SDN: 'sd',
      SUR: 'sr',
      SWE: 'se',
      CHE: 'ch',
      SYR: 'sy',

      TWN: 'tw',
      TJK: 'tj',
      TZA: 'tz',
      THA: 'th',
      TLS: 'tl',
      TGO: 'tg',
      TON: 'to',
      TTO: 'tt',
      TUN: 'tn',
      TUR: 'tr',
      TKM: 'tm',
      TUV: 'tv',
      UGA: 'ug',
      UKR: 'ua',
      ARE: 'ae',
      GBR: 'gb',
      USA: 'us',
      URY: 'uy',
      UZB: 'uz',
      VUT: 'vu',
      VAT: 'va',
      VEN: 've',
      VNM: 'vn',
      YEM: 'ye',
      ZMB: 'zm',
      ZWE: 'zw'
    };

    return codes[code.toUpperCase()] || '';
  }


  // Choose a color based on GDP per capita
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


  // Format GDP numbers
  formatNumber(value: number): string {

    return new Intl.NumberFormat(
      'en-US',
      {
        maximumFractionDigits: 0
      }
    ).format(value);
  }


  // Handle country clicks
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


    // Get GDP for the selected country
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
