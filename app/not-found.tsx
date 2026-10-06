import Link from 'next/link';
import { Shield, Home } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <Shield className="text-muted/30 mb-8" size={64} />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">404 - Page Not Found</h1>
      <p className="text-muted text-lg max-w-md mb-8 leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
      </p>
      <Link href="/" className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-md hover:bg-foreground/90 transition-colors font-medium">
        <Home size={18} />
        Return to Homepage
      </Link>
    </div>
  );
}
