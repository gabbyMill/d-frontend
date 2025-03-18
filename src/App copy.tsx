import { useEffect, useState } from "react";
import { Amenity } from "./types";
import { fetchAmenities, fetchAmenity, bookTimeSlot } from "./api";
import "./index.css";
import "./app.css";

export default function App() {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);
    const userId = "1"; // For demo purposes - in a real app, you would get this from auth or context

    useEffect(() => {
        const getAmenities = async () => {
            try {
                const data = await fetchAmenities();
                setAmenities(data);
            } catch (err) {
                setError("Failed to load amenities");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getAmenities();
    }, []);

    const handleViewAmenity = async (id: number) => {
        setLoading(true);
        try {
            const data = await fetchAmenity(id);
            setSelectedAmenity(data);
        } catch (err) {
            setError("Failed to load amenity details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedAmenity(null);
        setBookingStatus(null);
    };

    const handleBooking = async (amenityId: number, timeSlotId: string) => {
        setBookingStatus("Booking...");
        try {
            const bookedSlot = await bookTimeSlot(
                amenityId,
                userId,
                timeSlotId
            );
            console.log("handleBooking ~ bookedSlot:", bookedSlot);
            setSelectedAmenity((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    timeSlots: prev.timeSlots.map((slot) =>
                        slot.id === timeSlotId
                            ? { ...slot, bookedBy: userId }
                            : slot
                    ),
                };
            });
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
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (selectedAmenity) {
        return (
            <div className="app">
                <header>
                    <h1>Amenity Booking System</h1>
                </header>
                <main>
                    <div className="amenity-detail">
                        <button
                            className="mt-0 mb-1 border-2 border-dashed px-2 py-2"
                            onClick={handleBackToList}
                        >
                            Back to Amenities
                        </button>

                        <h1>{selectedAmenity.name}</h1>
                        <p>{selectedAmenity.description}</p>

                        <h2>Availability</h2>

                        {bookingStatus && (
                            <div
                                className={`booking-status ${
                                    bookingStatus.includes("failed")
                                        ? "error"
                                        : "success"
                                }`}
                            >
                                {bookingStatus}
                            </div>
                        )}

                        <div className="time-slots">
                            {selectedAmenity.timeSlots.length === 0 ? (
                                <p>No time slots available for this amenity.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAmenity.timeSlots.map(
                                            (slot) => (
                                                <tr key={slot.id}>
                                                    <td>
                                                        {new Date(
                                                            slot.startTime
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        {new Date(
                                                            slot.endTime
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        {slot.bookedBy
                                                            ? slot.bookedBy ===
                                                              userId
                                                                ? "Booked by you"
                                                                : "Booked"
                                                            : "Available"}
                                                    </td>
                                                    <td>
                                                        {!slot.bookedBy && (
                                                            <button
                                                                onClick={() =>
                                                                    handleBooking(
                                                                        selectedAmenity.id,
                                                                        slot.id
                                                                    )
                                                                }
                                                                className="book-button"
                                                            >
                                                                Book
                                                            </button>
                                                        )}
                                                        {slot.bookedBy ===
                                                            userId && (
                                                            <span>
                                                                ✓ Booked
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Amenity list view
    return (
        <div className="app">
            <header>
                <h1>Amenity Booking System</h1>
            </header>
            <main>
                <div className="amenities-list">
                    <h1>Amenities</h1>
                    {amenities.length === 0 ? (
                        <p>No amenities available.</p>
                    ) : (
                        <div className="amenities-grid">
                            {amenities.map((amenity) => (
                                <div key={amenity.id} className="amenity-card">
                                    <h2>{amenity.name}</h2>
                                    <p>{amenity.description}</p>
                                    <button
                                        onClick={() =>
                                            handleViewAmenity(amenity.id)
                                        }
                                    >
                                        View Availability
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
