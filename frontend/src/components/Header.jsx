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
                        <div className="relative group">
                            <button className="flex items-center gap-3 text-sm font-semibold text-foreground bg-secondary/30 hover:bg-secondary/60 px-2 py-1.5 pr-4 rounded-full border border-border/50 transition-all duration-200">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="leading-none">{user.name}</span>
                            </button>
                            
                            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl p-2">
                                    <div className="px-3 py-3 mb-1 border-b border-border/40">
                                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                                        <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">{user.email}</p>
                                    </div>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
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
                                    <div className="flex items-center gap-3 py-3 border-b border-border/30 mb-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-foreground truncate">{user.name}</span>
                                            <span className="text-xs font-medium text-muted-foreground truncate">{user.email}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm font-bold text-red-500 transition-all active:scale-[0.98] hover:bg-red-500/20"
                                    >
                                        <LogOut className="h-4 w-4 shrink-0" />
                                        Sign out
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
