import { Diamond, ShieldCheck, Headphones } from "lucide-react";

const features = [
    {
        icon: Diamond,
        title: "Curated Selection",
        description:
            "Every vehicle in our inventory is hand-picked and inspected to meet a premium standard.",
    },
    {
        icon: ShieldCheck,
        title: "Transparent Pricing",
        description:
            "No hidden fees. See real-time availability and clear pricing on every listing.",
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description:
            "Our specialists are available around the clock to guide you through your purchase.",
    },
];

export function FeaturesSection() {
    return (
        <section className="bg-background px-6 py-24 md:px-12 lg:px-20">
            <div className="w-full">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Built for a Better Buying Experience
                    </h2>
                    <p className="text-[17px] leading-relaxed text-muted-foreground">
                        AutoVault brings premium vehicles and modern inventory management together in one refined platform.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-border/40 bg-[#121212] p-8 transition-colors hover:border-border/80"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
                                <feature.icon className="h-6 w-6 text-foreground/80" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-[15px] leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
