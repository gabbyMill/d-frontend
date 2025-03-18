import { Amenity } from "../types";

type AmenityCardProps = {
    amenity: Amenity;
    onView: () => void;
};

export default function AmenityCard({ amenity, onView }: AmenityCardProps) {
    return (
        <div className="amenity-card">
            <h2>{amenity.name}</h2>
            <p>{amenity.description}</p>
            <button onClick={onView}>View Availability</button>
        </div>
    );
}
