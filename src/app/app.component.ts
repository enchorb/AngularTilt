import { Component, HostListener } from '@angular/core';
import { UIService } from './services/ui.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tiltSettings = {
    reverse: false,
    max: 35,
    perspective: 1000,
    scale: 1.1,
    speed: 500,
    transition: true,
    axis: null,
    reset: true,
    easing: 'cubic-bezier(.25,.95,.52,.99)',
    glare: true,
    'max-glare': 1,
    'glare-prerender': false,
    'mouse-event-element': null,
    gyroscope: true,
    gyroscopeMinAngleX: -45,
    gyroscopeMaxAngleX: 45,
    gyroscopeMinAngleY: -45,
    gyroscopeMaxAngleY: 45
  };

  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  onHover(event) {
    if (event[0] != null) {
      if (event[1][0] === 'infoCards') { this.uiService.hoverStatus.cards.info[event[1][1]].card = event[0]; }
    }
  }

  constructor(public uiService: UIService, public dataService: DataService) {}
}
