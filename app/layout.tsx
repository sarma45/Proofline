import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://proofline.example.com'),
  title: {
    template: '%s | Proofline',
    default: 'Proofline | The Evidence OS for AI-built software',
  },
  description: "The trust layer between AI-generated code and production software. Prove your code is safe to deploy.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Proofline',
    title: 'Proofline',
    description: 'The trust layer between AI-generated code and production software.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proofline',
    description: 'The trust layer between AI-generated code and production software.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Proofline',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              description: 'The Evidence OS for AI-built software. Verifies AI-generated code changes automatically.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              publisher: {
                '@type': 'Organization',
                name: 'Proofline',
                url: 'https://proofline.dev'
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
