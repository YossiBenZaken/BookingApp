import { IonItemSliding } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBooking: Booking[];
  constructor(private bookingS: BookingService) { }

  ngOnInit() {
    this.loadedBooking = this.bookingS.booking;
  }
  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
  }

}
