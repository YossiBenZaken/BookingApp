import { ModalController } from '@ionic/angular';
import { Place } from './../../places/place.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  constructor(private modal: ModalController) { }

  ngOnInit() { }
  onBookPlace() {
    this.modal.dismiss({ message: 'This is a dummy message!' }, 'confirm');
  }
  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }
}
