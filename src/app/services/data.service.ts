import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  infoCards = [
    {
      name: 'Test1',
    },
    {
      name: 'Test2',
    },
    {
      name: 'Test3',
    },
  ];

  constructor() {}
}
