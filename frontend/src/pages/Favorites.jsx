import { Link } from "react-router-dom";
import { HeartCrack } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { vehicles } from "../data/mockData";
import { VehicleCard } from "../components/VehicleCard";

export default function Favorites() {
    const { favorites } = useFavorites();

    const favoriteVehicles = vehicles.filter(v => favorites.includes(v.id));

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-20">
            <div className="w-full">
                {/* Header Area */}
                <div className="mb-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Your Favorites
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Keep track of the vehicles you love. 
                    </p>
                </div>

                {favoriteVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-border/50 rounded-2xl bg-[#121212]">
                        <HeartCrack className="h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-2">No favorites yet</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            You haven't added any vehicles to your favorites. Explore our collection and save the ones you like!
                        </p>
                        <Link 
                            to="/vehicles" 
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Explore Vehicles
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="mb-6 text-sm font-medium text-muted-foreground">
                            Showing {favoriteVehicles.length} saved vehicle{favoriteVehicles.length !== 1 ? 's' : ''}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favoriteVehicles.map((vehicle) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
