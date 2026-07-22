import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const vehicles = [
    {
        id: 1,
        make: "Porsche",
        model: "911 GT3 RS",
        price: "$245,000",
        year: 2024,
        image: "https://images.unsplash.com/photo-1503376712351-1c4391b1062b?q=80&w=1000&auto=format&fit=crop",
        tag: "New Arrival"
    },
    {
        id: 2,
        make: "Mercedes-AMG",
        model: "GT Black Series",
        price: "$325,000",
        year: 2023,
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop",
        tag: "Popular"
    },
    {
        id: 3,
        make: "Lamborghini",
        model: "Huracán EVO",
        price: "$289,000",
        year: 2023,
        image: "https://images.unsplash.com/photo-1627454819213-f56f48f5236f?q=80&w=1000&auto=format&fit=crop",
        tag: "Low Mileage"
    }
];

export function FeaturedVehicles() {
    return (
        <section className="bg-secondary/20 px-6 py-20 md:px-12 lg:px-20 border-y border-border/40">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-primary mb-3">
                            <Star className="h-5 w-5 fill-primary" />
                            <span className="text-sm font-bold uppercase tracking-widest">Showcase</span>
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                            Featured Inventory
                        </h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            Discover our hand-picked selection of the most sought-after performance and luxury vehicles currently in our showroom.
                        </p>
                    </div>
                    <Link
                        to="/vehicles"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
                    >
                        View all vehicles
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <div className="absolute top-4 left-4 z-10 rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-foreground border border-border/50">
                                    {vehicle.tag}
                                </div>
                                <img
                                    src={vehicle.image}
                                    alt={`${vehicle.make} ${vehicle.model}`}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
                            </div>
                            
                            <div className="relative p-6 -mt-12">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">{vehicle.year} • {vehicle.make}</p>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {vehicle.model}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-foreground">{vehicle.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
