import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import About from "./pages/About.jsx";
import Purchases from "./pages/Purchases.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import Favorites from "./pages/Favorites.jsx";

export default function App() {
  const location = useLocation();
  const isCustomLayout = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin';

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground">
      {!isCustomLayout && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isCustomLayout && <Footer />}
    </div>
  );
}
