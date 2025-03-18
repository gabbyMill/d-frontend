import { Amenity } from "../types";
import AmenityCard from "./AmenityCard";

type AmenityListViewProps = {
    amenities: Amenity[];
    onSelectAmenity: (amenity: Amenity) => void;
};

export default function AmenityListView({
    amenities,
    onSelectAmenity,
}: AmenityListViewProps) {
    return (
        <div className="amenities-list">
            <h1>Amenities</h1>
            {amenities.length === 0 ? (
                <p>No amenities available.</p>
            ) : (
                <div className="amenities-grid">
                    {amenities.map((amenity) => (
                        <AmenityCard
                            key={amenity.id}
                            amenity={amenity}
                            onView={() => onSelectAmenity(amenity)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
