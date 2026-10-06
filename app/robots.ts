import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://proofline.example.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/onboarding/',
        '/passports/',
        '/projects/',
        '/settings/',
        '/api/',
        '/github-check/'
      ],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
