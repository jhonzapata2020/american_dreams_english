import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://americandreamenglish.com';
  const lastModified = new Date();

  const routes: { path: string; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/becas', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/tienda', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/clases-en-vivo', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/sede-uraba', changeFrequency: 'monthly', priority: 0.8 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
