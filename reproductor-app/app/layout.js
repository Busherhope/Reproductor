import './globals.css';

export const metadata = {
  title: 'Reproductor',
  description: 'Reproductor de música con letras sincronizadas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
