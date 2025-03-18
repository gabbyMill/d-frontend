import { useState } from "react";
import { Amenity } from "../types";
import { bookTimeSlot } from "../api";
import TimeSlotTable from "./TimeSlotTable";

type AmenityDetailViewProps = {
    amenity: Amenity;
    userId: string;
    onBackToList: () => void;
    onAmenityUpdate: (amenity: Amenity) => void;
};

export default function AmenityDetailView({
    amenity,
    userId,
    onBackToList,
    onAmenityUpdate,
}: AmenityDetailViewProps) {
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);

    const handleBooking = async (timeSlotId: string) => {
        setBookingStatus("Booking...");
        try {
            const bookedSlot = await bookTimeSlot(
                amenity.id,
                userId,
                timeSlotId
            );
            console.log("handleBooking ~ bookedSlot:", bookedSlot);

            // Update the amenity with the booked slot
            const updatedAmenity = {
                ...amenity,
                timeSlots: amenity.timeSlots.map((slot) =>
                    slot.id === timeSlotId
                        ? { ...slot, bookedBy: userId }
                        : slot
                ),
            };

            onAmenityUpdate(updatedAmenity);
            setBookingStatus("Booked successfully!");
            setTimeout(() => setBookingStatus(null), 3000);
        } catch (err) {
            if (err instanceof Error) {
                setBookingStatus(`Booking failed: ${err.message}`);
            } else {
                setBookingStatus("Booking failed");
            }
            console.error(err);
        }
    };

    return (
        <div className="amenity-detail">
            <button
                className="mt-0 mb-1 border-2 border-dashed px-2 py-2"
                onClick={onBackToList}
            >
                Back to Amenities
            </button>

            <h1>{amenity.name}</h1>
            <p>{amenity.description}</p>

            <h2>Availability</h2>

            {bookingStatus && (
                <div
                    className={`booking-status ${
                        bookingStatus.includes("failed") ? "error" : "success"
                    }`}
                >
                    {bookingStatus}
                </div>
            )}

            <TimeSlotTable
                timeSlots={amenity.timeSlots}
                userId={userId}
                onBook={handleBooking}
            />
        </div>
    );
}
