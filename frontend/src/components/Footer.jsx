import { Gauge, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-[#0a0a0a] pt-16 pb-8 px-6 md:px-12 lg:px-20 mt-auto">
            <div className="mx-auto max-w-[1400px]">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-16">
                    {/* Brand & About */}
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-2 text-foreground">
                            <Gauge className="h-7 w-7 text-primary" />
                            <span className="text-xl font-bold tracking-tight">AutoVault</span>
                        </Link>
                        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-sm">
                            The premier destination for luxury and performance vehicles. We deliver an uncompromising, transparent, and seamless car buying experience tailored for those who demand excellence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-foreground mb-6">Quick Links</h3>
                        <ul className="flex flex-col gap-4 text-[15px] text-muted-foreground">
                            <li><Link to="/vehicles" className="hover:text-primary transition-colors">Browse Inventory</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Financing Options</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Trade-In Value</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-base font-bold text-foreground mb-6">Support</h3>
                        <ul className="flex flex-col gap-4 text-[15px] text-muted-foreground">
                            <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Vehicle Warranty</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Maintenance Services</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Schedule Test Drive</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base font-bold text-foreground mb-6">Visit Our Showroom</h3>
                        <ul className="flex flex-col gap-4 text-[15px] text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>100 Prestige Way<br />Beverly Hills, CA 90210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+1 (800) 555-0198</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>concierge@autovault.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} AutoVault. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}