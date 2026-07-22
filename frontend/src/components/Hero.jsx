import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "../assets/hero-car.png";

const stats = [
    { value: "200+", label: "Vehicles" },
    { value: "30+", label: "Premium Brands" },
    { value: "24/7", label: "Support" },
];

export function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-20">
            <img
                src={heroImage}
                alt="Premium silver sports car in a dark studio"
                className="absolute inset-0 h-full w-full object-cover object-[75%_50%]"
                width={1920}
                height={1088}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 via-55% to-transparent" />

            <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-center px-6 py-12 md:px-12 lg:px-20">
                <div className="max-w-2xl">
                    <span className="inline-block rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground backdrop-blur-sm">
                        Premium Vehicle Marketplace
                    </span>

                    <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                        Find Your <span className="text-primary">Perfect Drive</span>
                    </h1>

                    <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                        Explore our collection of premium vehicles and find the one built
                        for your journey. Curated inventory, transparent pricing, and a
                        seamless buying experience.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            to="/vehicles"
                            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Explore Vehicles
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary/60 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border/40 pt-8 md:mt-16 md:max-w-lg md:pt-10">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <div className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {stat.value}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
