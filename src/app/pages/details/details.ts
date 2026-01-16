import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/services/bookingService/booking-service';
import { RoomService } from '../../core/services/rooms/room-service';
import { IRoom } from '../../shared/interfaces/iroom';
import { ToastrService } from 'ngx-toastr';

interface IBookingRange {
  checkInDate: string;
  checkOutDate: string;
}

@Component({
  selector: 'app-details',
  imports: [FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {

  private readonly roomService = inject(RoomService);
  private readonly bookingService = inject(BookingService);
  private readonly toastrService = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  room!: IRoom;
  selectedImage!: string;

  minDate: string = '';
  bookedRanges: IBookingRange[] = [];

  checkInDate!: string;
  checkOutDate!: string;
  roomId!: number;

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('roomId'));

    if (roomId) {
      this.roomId = roomId;
      this.getRoomDetails(roomId);
      this.getRoomBookings(roomId);
    }

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  getRoomDetails(roomId: number) {
    this.roomService.getRoomById(roomId).subscribe({
      next: (res: IRoom) => {
        this.room = res;
        this.selectedImage = this.room.images[0];
      },
      error: (err: any) => {
        console.error(err);
        this.toastrService.error('Failed to load room details', 'Error');
      }
    });
  }

  getRoomBookings(roomId: number) {
    this.bookingService.getBookingsByRoomId(roomId).subscribe(
      (res: IBookingRange[]) => {
        this.bookedRanges = res.map((b: IBookingRange) => ({
          checkInDate: b.checkInDate.split('T')[0],
          checkOutDate: b.checkOutDate.split('T')[0],
        }));
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  isDateBooked(dateStr: string): boolean {
    const date = new Date(dateStr);

    return this.bookedRanges.some((b: IBookingRange) => {
      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);
      return date >= start && date <= end;
    });
  }

  bookNow(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      this.toastrService.error('Please select check-in and check-out dates', 'Error');
      return;
    }

    if (this.isDateBooked(this.checkInDate) || this.isDateBooked(this.checkOutDate)) {
      this.toastrService.error('Selected date is already booked', 'Error');
      return;
    }

    if (this.checkOutDate <= this.checkInDate) {
      this.toastrService.error('Check-out must be after check-in', 'Error');
      return;
    }

    const data = {
      roomId: this.roomId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
    };

    this.bookingService.CreateBookingForUser(data).subscribe({
      next: (res: any) => {
        this.toastrService.success('Booking successful', 'Success');
        this.router.navigate(['/booking']);
      },
      error: (err: any) => {
        console.error(err);
        this.toastrService.error(err.error || 'Booking failed', 'Error');
      }
    });
  }
}
