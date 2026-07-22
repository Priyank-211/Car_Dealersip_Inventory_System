import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { vehicles } from "../data/mockData";
import { VehicleCard } from "../components/VehicleCard";

export default function Vehicles() {
    const [searchQuery, setSearchQuery] = useState("");

    // Simple mock filter state (UI only as requested)
    const filteredVehicles = vehicles.filter(v => 
        `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">
                {/* Header Area */}
                <div className="mb-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Explore Our Vehicles
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Browse the full inventory and filter by make, model, category, and price to find the drive that fits you.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="rounded-xl border border-border/50 bg-[#121212] p-6 mb-12 shadow-sm">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by make, model, or category..."
                            className="block w-full rounded-lg border border-border/40 bg-background/50 py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>

                    {/* Filters Label */}
                    <div className="flex items-center gap-2 mb-4 text-foreground text-sm font-medium">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <select className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>All Makes</option>
                            <option>Aurora</option>
                            <option>Meridian</option>
                        </select>
                        
                        <select className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>All Models</option>
                        </select>

                        <select className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>All Categories</option>
                            <option>Sports</option>
                            <option>Sedan</option>
                            <option>SUV</option>
                        </select>

                        <select className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>Any Price</option>
                            <option>Under $50k</option>
                            <option>$50k - $100k</option>
                            <option>Over $100k</option>
                        </select>
                    </div>
                </div>

                {/* Results Header */}
                <div className="mb-6 text-sm font-medium text-muted-foreground">
                    Showing {filteredVehicles.length} of {vehicles.length} vehicles
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </div>
    );
}
