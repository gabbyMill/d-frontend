import { useEffect, useState } from "react";
import { Amenity } from "./types";
import { fetchAmenities } from "./api";
import "./index.css";
import "./app.css";
import AmenityDetailView from "./components/AmenityDetailView";
import AmenityListView from "./components/AmenityListView";

export default function App() {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="app">
            <header>
                <h1>Amenity Booking System</h1>
            </header>
            <main>
                {selectedAmenity ? (
                    <AmenityDetailView
                        amenity={selectedAmenity}
                        userId={userId}
                        onBackToList={() => setSelectedAmenity(null)}
                        onAmenityUpdate={(updatedAmenity) =>
                            setSelectedAmenity(updatedAmenity)
                        }
                    />
                ) : (
                    <AmenityListView
                        amenities={amenities}
                        onSelectAmenity={setSelectedAmenity}
                    />
                )}
            </main>
        </div>
    );
}
