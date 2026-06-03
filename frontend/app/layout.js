import "./globals.css";

export const metadata = {
  title: "CALOCA GYM",
  description: "Tienda fitness con Next.js, Express y MySQL"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
