import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { vehicles } from "../data/mockData";

export default function VehicleDetails() {
    const { id } = useParams();
    const vehicle = vehicles.find((v) => v.id === Number(id));
    const { toggleFavorite, isFavorite } = useFavorites();

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Vehicle Not Found</h2>
                <Link to="/vehicles" className="inline-flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to Vehicles
                </Link>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    const inStock = vehicle.quantity > 0;
    const isFav = isFavorite(vehicle.id);


    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <Link to="/vehicles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Vehicles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Image & Features */}
                    <div className="lg:col-span-7">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 bg-[#121212] shadow-sm">
                            <img
                                src={vehicle.image}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="h-full w-full object-cover"
                            />
                        </div>


                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-2">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                {vehicle.make} {vehicle.model}
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground mb-8">{vehicle.year} • {vehicle.category}</p>
                        
                        <div className="mb-10">
                            <p className="text-5xl font-bold text-foreground tracking-tight">
                                {formatPrice(vehicle.price)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">Excludes taxes and fees</p>
                        </div>

                        <div className="border border-border/50 rounded-2xl bg-[#121212] overflow-hidden mb-8 shadow-sm">
                            <div className="px-6 py-4 border-b border-border/50 bg-background/30">
                                <h3 className="font-semibold text-foreground">Vehicle Details</h3>
                            </div>
                            <div className="p-6 flex flex-col gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Make</span>
                                    <span className="font-medium text-foreground">{vehicle.make}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Model</span>
                                    <span className="font-medium text-foreground">{vehicle.model}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category</span>
                                    <span className="font-medium text-foreground">{vehicle.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Stock</span>
                                    {inStock ? (
                                        <span className="font-medium text-primary flex items-center gap-1">
                                            <Check className="h-4 w-4" /> {vehicle.quantity} Available
                                        </span>
                                    ) : (
                                        <span className="font-medium text-red-500">Out of Stock</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!inStock}
                            className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
                                inStock 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]' 
                                : 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
                            }`}
                        >
                            {inStock ? 'Purchase Vehicle' : 'Out of Stock'}
                        </button>

                        <button
                            onClick={() => toggleFavorite(vehicle.id)}
                            className={`w-full mt-4 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 border ${
                                isFav 
                                ? 'bg-secondary/50 text-foreground border-border hover:bg-secondary' 
                                : 'bg-transparent text-foreground border-border hover:bg-secondary/50'
                            }`}
                        >
                            <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
