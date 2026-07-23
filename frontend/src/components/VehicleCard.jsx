import { ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function VehicleCard({ vehicle }) {
    const navigate = useNavigate();
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div 
            onClick={() => navigate(`/vehicles/${vehicle._id || vehicle.id}`)}
            className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-[#121212] transition-colors hover:border-border cursor-pointer group"
        >
            <div className="relative aspect-[4/3] bg-black/50 overflow-hidden">
                <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                <div className="absolute left-3 top-3 rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm border border-border/50">
                    In Stock
                </div>
                
                <div className="absolute right-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm border border-border/50">
                    {vehicle.category}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-foreground text-lg tracking-tight">
                            {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {vehicle.year}
                        </p>
                    </div>
                    <div className="text-right font-bold text-foreground text-lg">
                        {formatPrice(vehicle.price)}
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{vehicle.quantity} available</span>
                </div>

                <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/vehicles/${vehicle._id || vehicle.id}`); }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-transform active:scale-[0.98] hover:bg-foreground/90"
                >
                    <ShoppingCart className="h-4 w-4" />
                    Purchase
                </button>
            </div>
        </div>
    );
}
