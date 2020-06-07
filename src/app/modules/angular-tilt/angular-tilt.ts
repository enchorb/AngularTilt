import { TiltSettings } from './angular-tilt-settings.model';
import { HostListener } from '@angular/core';

export class Tilt {
  width: any;
  height: any;
  left: any;
  top: any;
  deviceType: any;
  x: any;
  y: any;
  transitionTimeout: any;
  updateCall: any;
  updateBind: any;
  resetBind: any;
  element: any;
  settings: any;
  elementListener: any;
  reverse: any;
  glare: any;
  glarePrerender: any;
  gyroscope: any;
  onMouseEnterBind: any;
  onMouseMoveBind: any;
  onMouseLeaveBind: any;
  onTouchStartBind: any;
  onTouchMoveBind: any;
  onTouchEndBind: any;
  onWindowResizeBind: any;
  onDeviceOrientationBind: any;
  event: any;
  glareElement: any;
  glareElementWrapper: any;

  constructor(element: Node, settings: TiltSettings = {}) {
    if (!(element instanceof Node)) { throw new Error('Can\'t initialize VanillaTilt because ' + element + ' is not a Node.'); }

    this.width = null;
    this.height = null;
    this.left = null;
    this.top = null;
    this.x = null;
    this.y = null;
    this.deviceType = 'mouse';
    this.transitionTimeout = null;
    this.updateCall = null;

    this.updateBind = this.update.bind(this);
    this.resetBind = this.reset.bind(this);

    this.element = element;
    this.settings = this.extendSettings(settings);
    this.elementListener = this.getElementListener();

    this.reverse = this.settings.reverse ? -1 : 1;

    this.glare = this.isSettingTrue(this.settings.glare);
    this.glarePrerender = this.isSettingTrue(this.settings['glare-prerender']);
    this.gyroscope = this.isSettingTrue(this.settings.gyroscope);

    if (this.glare) { this.prepareGlare(); }

    this.addEventListeners();
  }

  static init(elements, settings) {
    if (elements instanceof Node) { elements = [elements]; }
    if (elements instanceof NodeList) { elements = [].slice.call(elements); }
    if (!(elements instanceof Array)) { return; }
    elements.forEach(element => {
      if (!('tilt' in element)) {
        element.tilt = new Tilt(element, settings);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) { this.updateGlareSize(); }

  @HostListener('window:deviceorientation', ['$event'])
  onDeviceOrientation(event) {
    if (event.gamma === null || event.beta === null) { return; }

    this.updateElementPosition();

    const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
    const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;
    const degreesPerPixelX = totalAngleX / this.width;
    const degreesPerPixelY = totalAngleY / this.height;
    const angleX = event.gamma - this.settings.gyroscopeMinAngleX;
    const angleY = event.beta - this.settings.gyroscopeMinAngleY;
    const posX = angleX / degreesPerPixelX;
    const posY = angleY / degreesPerPixelY;

    if (this.updateCall !== null) { cancelAnimationFrame(this.updateCall); }

    this.event = {
      clientX: posX + this.left,
      clientY: posY + this.top
    };

    this.updateCall = requestAnimationFrame(this.updateBind);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event) {
    this.deviceType = 'touch';
    this.updateElementPosition();
    this.element.style.willChange = 'transform';
    this.setTransition();
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event) {
    this.deviceType = 'mouse';
    this.updateElementPosition();
    this.element.style.willChange = 'transform';
    this.setTransition();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event) {
    this.deviceType = 'touch';
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }
    this.event = event;
    this.updateCall = requestAnimationFrame(this.updateBind);
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    this.deviceType = 'mouse';
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }
    this.event = event;
    this.updateCall = requestAnimationFrame(this.updateBind);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event) {
    this.deviceType = 'touch';
    this.setTransition();
    if (this.settings.reset) {
      requestAnimationFrame(this.resetBind);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    this.deviceType = 'mouse';
    this.setTransition();
    if (this.settings.reset) {
      requestAnimationFrame(this.resetBind);
    }
  }

  isSettingTrue(setting) { return setting === '' || setting === true || setting === 1; }

  getElementListener(): Node {
    if (!this.settings || !this.settings['mouse-event-element']) { return this.element; }

    if (typeof this.settings['mouse-event-element'] === 'string') {
      const mouseEventElement = document.querySelector(this.settings['mouse-event-element']);
      if (mouseEventElement) { return mouseEventElement; }
    }

    if (this.settings['mouse-event-element'] instanceof Node) { return this.settings['mouse-event-element']; }
  }

  addEventListeners(): void {
    this.onMouseEnterBind = this.onMouseEnter.bind(this);
    this.onMouseMoveBind = this.onMouseMove.bind(this);
    this.onMouseLeaveBind = this.onMouseLeave.bind(this);
    this.onTouchStartBind = this.onTouchStart.bind(this);
    this.onTouchMoveBind = this.onTouchMove.bind(this);
    this.onTouchEndBind = this.onTouchEnd.bind(this);
    this.onWindowResizeBind = this.onWindowResize.bind(this);
    this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);

    this.elementListener.addEventListener('mouseenter', this.onMouseEnterBind);
    this.elementListener.addEventListener('mousemove', this.onMouseMoveBind);
    this.elementListener.addEventListener('mouseleave', this.onMouseLeaveBind);
    this.elementListener.addEventListener('touchstart', this.onTouchStartBind);
    this.elementListener.addEventListener('touchmove', this.onTouchMoveBind);
    this.elementListener.addEventListener('touchend', this.onTouchEndBind);

    if (this.glare) { window.addEventListener('resize', this.onWindowResizeBind); }

    if (this.gyroscope) {
      window.addEventListener(
        'deviceorientation',
        this.onDeviceOrientationBind
      );
    }
  }

  removeEventListeners(): void {
    this.elementListener.removeEventListener('mouseenter', this.onMouseEnterBind);
    this.elementListener.removeEventListener('mousemove', this.onMouseMoveBind);
    this.elementListener.removeEventListener('mouseleave', this.onMouseLeaveBind);
    this.elementListener.removeEventListener('touchstart', this.onTouchStartBind);
    this.elementListener.removeEventListener('touchmove', this.onTouchMoveBind);
    this.elementListener.removeEventListener('touchend', this.onTouchEndBind);

    if (this.glare) { window.removeEventListener('resize', this.onWindowResizeBind); }

    if (this.gyroscope) {
      window.removeEventListener(
        'deviceorientation',
        this.onDeviceOrientationBind
      );
    }
  }

  destroy() {
    clearTimeout(this.transitionTimeout);
    if (this.updateCall !== null) { cancelAnimationFrame(this.updateCall); }
    this.reset();
    this.removeEventListeners();
    this.element.vanillaTilt = null;
    delete this.element.vanillaTilt;
    this.element = null;
  }

  reset() {
    this.event = {
      pageX: this.left + this.width / 2,
      pageY: this.top + this.height / 2
    };

    if (this.element && this.element.style) {
      this.element.style.transform =
        `perspective(${this.settings.perspective}px) ` +
        `rotateX(0deg) ` +
        `rotateY(0deg) ` +
        `scale3d(1, 1, 1)`;
    }

    if (this.glare) {
      this.glareElement.style.transform =
        'rotate(180deg) translate(-50%, -50%)';
      this.glareElement.style.opacity = '0';
    }
  }

  getValues() {
    if(this.deviceType === 'mouse') {
      this.x = (this.event.clientX - this.left) / this.width;
      this.y = (this.event.clientY - this.top) / this.height;
    }

    if(this.deviceType === 'touch') {
      this.x = (this.event.changedTouches[0].clientX - this.left) / this.width;
      this.y = (this.event.changedTouches[0].clientY - this.top) / this.height;
    }

    this.x = Math.min(Math.max(this.x, 0), 1);
    this.y = Math.min(Math.max(this.y, 0), 1);

    const tiltX = (
      this.reverse *
      (this.settings.max / 2 - this.x * this.settings.max)
    ).toFixed(2);
    const tiltY = (
      this.reverse *
      (this.y * this.settings.max - this.settings.max / 2)
    ).toFixed(2);
    const angle =
      Math.atan2(
        this.event.clientX - (this.left + this.width / 2),
        -(this.event.clientY - (this.top + this.height / 2))
      ) *
      (180 / Math.PI);

    return {
      tiltX,
      tiltY,
      percentageX: this.x * 100,
      percentageY: this.y * 100,
      angle
    };
  }

  updateElementPosition() {
    const rect = this.element.getBoundingClientRect();
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.left = rect.left;
    this.top = rect.top;
  }

  update() { // Code For Tilt Calculation Taken From: https://www.npmjs.com/package/angular-tilt
    const values = this.getValues();

    this.element.style.transform =
      'perspective(' +
      this.settings.perspective +
      'px) ' +
      'rotateX(' +
      (this.settings.axis === 'x' ? 0 : values.tiltY) +
      'deg) ' +
      'rotateY(' +
      (this.settings.axis === 'y' ? 0 : values.tiltX) +
      'deg) ' +
      'scale3d(' +
      this.settings.scale +
      ', ' +
      this.settings.scale +
      ', ' +
      this.settings.scale +
      ')';

    if (this.glare) {
      this.glareElement.style.transform = `rotate(${
        values.angle
      }deg) translate(-50%, -50%)`;
      this.glareElement.style.opacity = `${(values.percentageY *
        this.settings['max-glare']) /
      100}`;
    }

    this.element.dispatchEvent(
      new CustomEvent('tiltChange', {
        detail: values
      })
    );

    this.updateCall = null;
  }

  prepareGlare() {
    if (!this.glarePrerender) {
      const jsTiltGlare = document.createElement('div');
      jsTiltGlare.classList.add('js-tilt-glare');
      const jsTiltGlareInner = document.createElement('div');
      jsTiltGlareInner.classList.add('js-tilt-glare-inner');
      jsTiltGlare.appendChild(jsTiltGlareInner);
      this.element.appendChild(jsTiltGlare);
    }

    this.glareElementWrapper = this.element.querySelector('.js-tilt-glare');
    this.glareElement = this.element.querySelector('.js-tilt-glare-inner');

    if (this.glarePrerender) { return; }

    Object.assign(this.glareElementWrapper.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      'pointer-events': 'none'
    });

    Object.assign(this.glareElement.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      'pointer-events': 'none',
      'background-image': `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
      width: `${this.element.offsetWidth * 2}px`,
      height: `${this.element.offsetWidth * 2}px`,
      transform: 'rotate(180deg) translate(-50%, -50%)',
      'transform-origin': '0% 0%',
      opacity: '0'
    });
  }

  updateGlareSize() {
    Object.assign(this.glareElement.style, {
      width: `${this.element.offsetWidth * 2}`,
      height: `${this.element.offsetWidth * 2}`
    });
  }

  setTransition() {
    clearTimeout(this.transitionTimeout);
    this.element.style.transition =
      this.settings.speed + 'ms ' + this.settings.easing;
    if (this.glare)
      this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${
        this.settings.easing
      }`;

    this.transitionTimeout = setTimeout(() => {
      this.element.style.transition = '';
      if (this.glare) {
        this.glareElement.style.transition = '';
      }
    }, this.settings.speed);
  }

  extendSettings(settings: TiltSettings) {
    const defaultSettings = {
      reverse: false,
      max: 35,
      perspective: 1000,
      easing: 'cubic-bezier(.25,.95,.52,.99)',
      scale: 1,
      speed: 300,
      transition: true,
      axis: null,
      glare: true,
      'max-glare': 1,
      'glare-prerender': false,
      'mouse-event-element': null,
      reset: true,
      gyroscope: true,
      gyroscopeMinAngleX: -45,
      gyroscopeMaxAngleX: 45,
      gyroscopeMinAngleY: -45,
      gyroscopeMaxAngleY: 45
    };

    const newSettings = {};
    for (const property in defaultSettings) {
      if (property in settings) {
        newSettings[property] = settings[property];
      } else if (this.element.hasAttribute('data-tilt-' + property)) {
        const attribute = this.element.getAttribute('data-tilt-' + property);
        try {
          newSettings[property] = JSON.parse(attribute);
        } catch (e) {
          newSettings[property] = attribute;
        }
      } else {
        newSettings[property] = defaultSettings[property];
      }
    }

    return newSettings;
  }
}
