import { NavLink, Link } from "react-router-dom";
import { Gauge, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/vehicles", label: "Vehicles" },
    { to: "/about", label: "About" },
];

export function Header() {
    const [open, setOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `text-base font-semibold transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
        }`;

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 text-foreground">
                    <Gauge className="h-8 w-8 text-primary" />
                    <span className="text-xl md:text-2xl font-bold tracking-tight">AutoVault</span>
                </Link>

                <nav className="hidden items-center gap-10 md:flex">
                    {navLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-6 md:flex">
                    <Link
                        to="/login"
                        className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-xl bg-primary px-6 py-2.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Register
                    </Link>
                </div>

                <button
                    onClick={() => setOpen((s) => !s)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div className="border-t border-border/30 bg-background/95 backdrop-blur-md md:hidden">
                    <nav className="flex flex-col px-6 py-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `py-3 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <div className="mt-4 flex flex-col gap-3 border-t border-border/30 pt-4">
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setOpen(false)}
                                className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Register
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
