import { TimeSlot } from "../types";

type TimeSlotTableProps = {
    timeSlots: TimeSlot[];
    userId: string;
    onBook: (timeSlotId: string) => void;
};

export default function TimeSlotTable({
    timeSlots,
    userId,
    onBook,
}: TimeSlotTableProps) {
    if (timeSlots.length === 0) {
        return <p>No time slots available for this amenity.</p>;
    }

    return (
        <div className="time-slots">
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
                    {timeSlots.map((slot) => (
                        <tr key={slot.id}>
                            <td>{new Date(slot.startTime).toLocaleString()}</td>
                            <td>{new Date(slot.endTime).toLocaleString()}</td>
                            <td>
                                {slot.bookedBy
                                    ? slot.bookedBy === userId
                                        ? "Booked by you"
                                        : "Booked"
                                    : "Available"}
                            </td>
                            <td>
                                {!slot.bookedBy && (
                                    <button
                                        onClick={() => onBook(slot.id)}
                                        className="book-button"
                                    >
                                        Book
                                    </button>
                                )}
                                {slot.bookedBy === userId && (
                                    <span>✓ Booked</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
