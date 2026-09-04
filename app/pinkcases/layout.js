export const metadata = {
  title: 'PinkCases - Carcasas Premium para iPhone',
  description: 'Carcasas premium para iPhone | Diseños únicos y protección total | Envíos a toda Colombia 📱✨',
  openGraph: {
    title: 'PinkCases - Carcasas Premium para iPhone',
    description: 'Carcasas premium para iPhone | Diseños únicos y protección total | Envíos a toda Colombia',
    url: 'https://www.linksweb.lat/pinkcases',
    siteName: 'PinkCases',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function PinkCasesLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}