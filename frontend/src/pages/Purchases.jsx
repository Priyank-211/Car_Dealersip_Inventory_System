import { PackageX, ArrowRight, Clock, ShieldCheck, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../lib/api";

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const data = await api.getPurchases();
                setPurchases(data);
            } catch (err) {
                console.error("Failed to fetch purchases", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pt-24 pb-16">
            <div className="max-w-[1200px] mx-auto w-full px-6 md:px-12">
                
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Your Garage
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Track your vehicle purchases and view order history.
                    </p>
                </div>

                {purchases.length === 0 ? (
                    <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-secondary/20 p-8 md:p-16 text-center shadow-lg">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />
                        
                        <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary border-2 border-border/50 mb-6 shadow-inner">
                                <PackageX className="h-10 w-10 text-muted-foreground" />
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                No purchases yet
                            </h2>
                            
                            <p className="text-muted-foreground mb-8 text-lg">
                                Your garage is currently empty. Explore our premium inventory to find your next dream vehicle.
                            </p>
                            
                            <Link
                                to="/vehicles"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                            >
                                Browse Inventory
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {purchases.map((purchase) => (
                            <div key={purchase._id} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-secondary/30 border border-border/50 shadow-sm transition-all hover:border-primary/50">
                                {/* Vehicle Image */}
                                <div className="w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden bg-background shrink-0 border border-border/50">
                                    {purchase.vehicle ? (
                                        <img 
                                            src={purchase.vehicle.images && purchase.vehicle.images.length > 0 ? purchase.vehicle.images[0] : purchase.vehicle.image} 
                                            alt={`${purchase.vehicle.make} ${purchase.vehicle.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            Vehicle Data Unavailable
                                        </div>
                                    )}
                                </div>
                                
                                {/* Purchase Details */}
                                <div className="flex flex-col justify-between flex-grow">
                                    <div>
                                        <div className="flex flex-wrap justify-between items-start mb-2 gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-foreground">
                                                    {purchase.vehicle ? `${purchase.vehicle.make} ${purchase.vehicle.model}` : "Unknown Vehicle"}
                                                </h3>
                                                <p className="text-muted-foreground mt-1">
                                                    Order ID: <span className="font-mono text-xs opacity-70">{purchase._id}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold capitalize">
                                                <CheckCircle2 className="h-4 w-4" />
                                                {purchase.status}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 grid grid-cols-2 gap-4 max-w-sm">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
                                                <p className="font-medium text-foreground">{formatDate(purchase.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Price Paid</p>
                                                <p className="font-medium text-foreground">{formatPrice(purchase.priceAtPurchase)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex gap-3">
                                        {purchase.vehicle && (
                                            <Link 
                                                to={`/vehicles/${purchase.vehicle._id || purchase.vehicle.id}`}
                                                className="px-5 py-2.5 rounded-lg border border-border/50 bg-background text-sm font-medium hover:bg-secondary transition-colors"
                                            >
                                                View Vehicle Details
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="flex flex-col p-6 rounded-2xl bg-secondary/30 border border-border/50">
                        <Clock className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Real-time Tracking</h3>
                        <p className="text-sm text-muted-foreground">
                            Once you make a purchase, you can track the delivery status of your vehicle right here in real-time.
                        </p>
                    </div>
                    
                    <div className="flex flex-col p-6 rounded-2xl bg-secondary/30 border border-border/50">
                        <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Secure Transactions</h3>
                        <p className="text-sm text-muted-foreground">
                            All your purchase history and documentation are securely stored in your personal AutoVault.
                        </p>
                    </div>
                    
                    <div className="flex flex-col p-6 rounded-2xl bg-secondary/30 border border-border/50">
                        <CreditCard className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Easy Financing</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your payment plans and view financial documents for your active vehicle purchases.
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
