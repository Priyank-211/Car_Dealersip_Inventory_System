import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { VehicleCard } from "../components/VehicleCard";

export default function Vehicles() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMake, setSelectedMake] = useState("All");
    const [selectedModel, setSelectedModel] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const data = await api.listVehicles();
                setVehicles(data);
            } catch (err) {
                console.error("Failed to load vehicles", err);
            } finally {
                setLoading(false);
            }
        };
        loadVehicles();
    }, []);

    // Extract unique options dynamically
    const makes = ["All", ...new Set(vehicles.map(v => v.make))];
    const models = ["All", ...new Set(vehicles.filter(v => selectedMake === "All" || v.make === selectedMake).map(v => v.model))];
    const categories = ["All", ...new Set(vehicles.map(v => v.category))];
    const prices = ["All", "Under ₹10,00,000", "₹10,00,000 - ₹20,00,000", "Over ₹20,00,000"];

    // Update selected model if the current model doesn't belong to the new make
    useEffect(() => {
        if (selectedMake !== "All" && selectedModel !== "All") {
            const validModelsForMake = vehicles.filter(v => v.make === selectedMake).map(v => v.model);
            if (!validModelsForMake.includes(selectedModel)) {
                setSelectedModel("All");
            }
        }
    }, [selectedMake, selectedModel, vehicles]);

    const filteredVehicles = vehicles.filter(v => {
        // Search Filter
        const matchesSearch = `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              v.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Dropdown Filters
        const matchesMake = selectedMake === "All" || v.make === selectedMake;
        const matchesModel = selectedModel === "All" || v.model === selectedModel;
        const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
        
        // Price Filter
        let matchesPrice = true;
        if (selectedPrice === "Under ₹10,00,000") matchesPrice = v.price < 1000000;
        if (selectedPrice === "₹10,00,000 - ₹20,00,000") matchesPrice = v.price >= 1000000 && v.price <= 2000000;
        if (selectedPrice === "Over ₹20,00,000") matchesPrice = v.price > 2000000;

        return matchesSearch && matchesMake && matchesModel && matchesCategory && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-20">
            <div className="w-full">
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
                        <select 
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                            className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {makes.map(make => (
                                <option key={make} value={make}>{make === "All" ? "All Makes" : make}</option>
                            ))}
                        </select>
                        
                        <select 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            disabled={selectedMake === "All" && models.length <= 1}
                        >
                            {models.map(model => (
                                <option key={model} value={model}>{model === "All" ? "All Models" : model}</option>
                            ))}
                        </select>

                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                            ))}
                        </select>

                        <select 
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="appearance-none rounded-lg border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {prices.map(price => (
                                <option key={price} value={price}>{price === "All" ? "Any Price" : price}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Header */}
                <div className="mb-6 text-sm font-medium text-muted-foreground">
                    Showing {filteredVehicles.length} of {vehicles.length} vehicles
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="py-20 flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">
                        No vehicles found matching your criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
