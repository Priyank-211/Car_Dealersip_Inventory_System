import { Link } from "react-router-dom";
import { ArrowRight, CarFront } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function CTASection() {
    const { user } = useAuth();
    return (
        <section className="relative overflow-hidden py-24 px-6 md:px-12 lg:px-20 border-t border-border/50">
            {/* Background elements */}
            <div className="absolute inset-0 bg-background z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
            
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <CarFront className="h-8 w-8 text-primary" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                    Ready to elevate your driving experience?
                </h2>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of satisfied clients who have found their dream car through AutoVault. Create an account to save favorites and receive exclusive offers.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {!user && (
                        <Link
                            to="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                        >
                            Create your account
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    )}
                    
                    <Link
                        to="/contact"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-transparent px-8 py-4 text-base font-bold text-foreground transition-all hover:border-primary/50 hover:bg-secondary/50 active:scale-95"
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>
        </section>
    );
}
