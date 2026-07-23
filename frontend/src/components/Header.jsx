import { NavLink, Link, useNavigate } from "react-router-dom";
import { Gauge, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/vehicles", label: "Vehicles" },
    { to: "/about", label: "About" },
];

export function Header() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
        setOpen(false);
    };

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
                    {user && (
                        <>
                            <NavLink to="/purchases" className={linkClass}>
                                Track Purchases
                            </NavLink>
                            <NavLink to="/favorites" className={linkClass}>
                                Favorites
                            </NavLink>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <NavLink to="/admin" className={linkClass}>
                            Dashboard
                        </NavLink>
                    )}
                </nav>

                <div className="hidden items-center gap-6 md:flex">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
                                <User className="h-4 w-4 text-primary" />
                                {user.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-red-500"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
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
                        {user && (
                            <>
                                <NavLink
                                    to="/purchases"
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `py-3 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
                                        }`
                                    }
                                >
                                    Track Purchases
                                </NavLink>
                                <NavLink
                                    to="/favorites"
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `py-3 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
                                        }`
                                    }
                                >
                                    Favorites
                                </NavLink>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <NavLink
                                to="/admin"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `py-3 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                        )}
                        <div className="mt-4 flex flex-col gap-3 border-t border-border/30 pt-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 py-2 text-sm font-semibold text-foreground">
                                        <User className="h-4 w-4 text-primary" />
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
