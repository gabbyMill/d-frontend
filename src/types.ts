export type TimeSlot = {
    id: string;
    startTime: string;
    endTime: string;
    bookedBy: string | null;
};

export type Amenity = {
    id: number;
    name: string;
    description: string;
    timeSlots: TimeSlot[];
};
