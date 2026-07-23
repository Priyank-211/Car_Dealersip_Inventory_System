import { Shield, Target, Trophy, Users, CheckCircle2 } from "lucide-react";
import heroImage from "../assets/hero-car.png";

export default function About() {
    return (
        <div className="flex flex-col min-h-screen bg-background pt-24 pb-16">
            {/* Header Section */}
            <section className="relative overflow-hidden py-20 px-6 md:px-12 lg:px-20 border-b border-border/50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
                
                <div className="relative z-10 mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                        Redefining the <span className="text-primary">Automotive</span> Experience
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        At AutoVault, we believe that purchasing a premium vehicle should be as refined and thrilling as driving one. We curate the finest automobiles for the most discerning drivers.
                    </p>
                </div>
            </section>

            {/* Mission & Story Section */}
            <section className="py-20 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Founded with a passion for engineering excellence and automotive beauty, AutoVault started as a boutique showroom for enthusiasts. Today, we are the premier destination for luxury, performance, and everyday premium vehicles.
                            </p>
                            <p>
                                We don't just sell cars; we match drivers with their mechanical soulmates. Every vehicle in our inventory undergoes a rigorous 150-point inspection to ensure it meets our uncompromising standards of quality and reliability.
                            </p>
                        </div>
                        
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                <span className="text-foreground font-medium">Curated Premium Inventory</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                <span className="text-foreground font-medium">Transparent Pricing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                <span className="text-foreground font-medium">Concierge-Level Support</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />
                        <img 
                            src={heroImage} 
                            alt="Luxury Car Showcase" 
                            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </div>
            </section>

            {/* Stats/Values Section */}
            <section className="py-20 px-6 md:px-12 lg:px-20 bg-secondary/30 border-y border-border/50">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-lg">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Trophy className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-2">10+</h3>
                            <p className="text-muted-foreground font-medium">Years of Excellence</p>
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-lg">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Users className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-2">5,000+</h3>
                            <p className="text-muted-foreground font-medium">Happy Clients</p>
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-lg">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Shield className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-2">100%</h3>
                            <p className="text-muted-foreground font-medium">Quality Guaranteed</p>
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-lg">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Target className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-2">24/7</h3>
                            <p className="text-muted-foreground font-medium">Client Support</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
