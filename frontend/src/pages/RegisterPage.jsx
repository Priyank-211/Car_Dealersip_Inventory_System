import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Gauge, AlertCircle } from "lucide-react";
import heroImage from "../assets/hero-car.png";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        
        try {
            await register(name, email, password);
            navigate("/login"); // Redirect to login page on success
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-blue-100">
            {/* Left Side - Form */}
            <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
                <div className="w-full max-w-[440px]">
                    {/* Logo */}
                    <div className="mb-10 flex items-center gap-2">
                        <Gauge className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold tracking-tight text-slate-900">AutoVault</span>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Join Velocity Motors to browse and purchase vehicles.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-[slideUp_0.2s_ease-out]">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full name
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className="block w-full rounded-xl border border-transparent bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="block w-full rounded-xl border border-transparent bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="block w-full rounded-xl border border-transparent bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-blue-500/30"
                            >
                                {isSubmitting ? "Creating account..." : "Create account"}
                                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image & Copy */}
            <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-slate-950 lg:flex">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Premium car"
                        className="h-full w-full object-cover opacity-50 transition-transform duration-1000 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/80" />
                </div>
                
                <div className="relative z-10 p-12 lg:p-20">
                    <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                        Your next car, one click away.
                    </h1>
                    <p className="animate-fade-in-up-delay max-w-md text-lg text-slate-300 leading-relaxed">
                        Create an account to track purchases, save favorites, and access exclusive inventory.
                    </p>
                </div>
            </div>
        </div>
    );
}
