import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    // tslint:disable-next-line: max-line-length
    new Place('p1', 'Manhattan Mansion', 'In the heart of NYC.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg', 149.99),
    // tslint:disable-next-line: max-line-length
    new Place('p2', 'L\'Amour Toujours', 'A romantic place in Paris!', 'https://cdn-images-1.medium.com/max/1600/1*t-nXIcaD3oP6CS4ydXV1xw.jpeg', 189.99),
    // tslint:disable-next-line: max-line-length
    new Place('p3', 'The Foggy Palace', 'Not your average city trip!', 'https://i1.trekearth.com/photos/138102/dsc_0681.jpg', 99.99),
  ];
  get places() {
    return [...this._places];
  }
  constructor() { }
  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
