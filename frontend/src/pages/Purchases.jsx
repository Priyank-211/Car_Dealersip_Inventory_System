import { PackageX, ArrowRight, Clock, ShieldCheck, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Purchases() {
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

                {/* Empty State */}
                <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-secondary/20 p-8 md:p-16 text-center shadow-lg">
                    {/* Background glow */}
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
