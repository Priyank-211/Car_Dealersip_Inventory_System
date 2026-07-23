import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Heart, Loader2 } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VehicleDetails() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const { toggleFavorite, isFavorite } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const data = await api.getVehicleById(id);
                setVehicle(data);
            } catch (err) {
                console.error("Failed to load vehicle details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const inStock = vehicle.quantity > 0;
    const isFav = isFavorite(vehicle._id || vehicle.id);

    const handlePurchase = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        
        try {
            setPurchasing(true);
            await api.purchaseVehicle(vehicle._id || vehicle.id);
            alert(`Successfully purchased ${vehicle.make} ${vehicle.model}!`);
            
            // Refetch to get updated stock
            const data = await api.getVehicleById(id);
            setVehicle(data);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to purchase vehicle");
        } finally {
            setPurchasing(false);
        }
    };


    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <Link to="/vehicles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Vehicles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Image & Features */}
                    <div className="lg:col-span-7">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 bg-[#121212] shadow-sm mb-4">
                            <img
                                src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[selectedImageIdx] : vehicle.image}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="h-full w-full object-cover transition-opacity duration-300"
                            />
                        </div>

                        {/* Thumbnails */}
                        {vehicle.images && vehicle.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {vehicle.images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setSelectedImageIdx(idx)}
                                        className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${selectedImageIdx === idx ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-transparent hover:border-border/50 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
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
                            onClick={handlePurchase}
                            disabled={!inStock || purchasing}
                            className={`w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 ${
                                inStock 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]' 
                                : 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
                            }`}
                        >
                            {purchasing ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                            ) : inStock ? 'Purchase Vehicle' : 'Out of Stock'}
                        </button>

                        <button
                            onClick={() => toggleFavorite(vehicle._id || vehicle.id)}
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
