import { Hero } from "../components/Hero.jsx";
import { FeaturesSection } from "../components/FeaturesSection.jsx";
import { CTASection } from "../components/CTASection.jsx";

export default function Home() {
    return (
        <div className="flex flex-col gap-0">
            <Hero />
            <FeaturesSection />
            <CTASection />
        </div>
    );
}
