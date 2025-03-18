import { Amenity, TimeSlot } from "./types";

const API_URL = "http://localhost:3000"; // Change this to your API URL

export const fetchAmenities = async (): Promise<Amenity[]> => {
    const response = await fetch(`${API_URL}/amenities`);
    if (!response.ok) throw new Error("Failed to fetch amenities");
    return response.json();
};

export const fetchAmenity = async (id: number): Promise<Amenity> => {
    const response = await fetch(`${API_URL}/amenities/${id}`);
    if (!response.ok) throw new Error("Failed to fetch amenity");
    return response.json();
};

export const bookTimeSlot = async (
    amenityId: number,
    userId: string,
    timeSlotId: string
): Promise<TimeSlot> => {
    const response = await fetch(`${API_URL}/amenities/${amenityId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, timeSlotId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book time slot");
    }

    return response.json();
};
