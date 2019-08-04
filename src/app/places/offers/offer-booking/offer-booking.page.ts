import { PlacesService } from './../../places.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Place } from './../../place.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offer-booking',
  templateUrl: './offer-booking.page.html',
  styleUrls: ['./offer-booking.page.scss'],
})
export class OfferBookingPage implements OnInit {
  place: Place;
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(params.get('placeId'));
    });
  }

}
