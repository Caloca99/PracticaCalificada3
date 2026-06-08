import "./globals.css";
import { AuthProvider } from "./components/AuthProvider.jsx";
import { CartProvider } from "./components/CartProvider.jsx";
import Navbar from "./components/Navbar.jsx";
import { ToastProvider } from "./components/Toast.jsx";

export const metadata = {
  title: "CALOCA GYM",
  description: "Tienda fitness con Next.js, Express y MySQL"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
