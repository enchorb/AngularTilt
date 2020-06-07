import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class UIService {
  hoverStatus = {
    cards: {
      info: Array.apply(null, Array(this.dataService.infoCards.length)).map((el, i) => {
        return {
          card: false
        };
      })
    },
  };

  constructor(public dataService: DataService) {}
}
