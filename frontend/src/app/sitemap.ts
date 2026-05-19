import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://batteryswap.ph';
  return [
    { url: base,                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/stations`,           lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/booking`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/pricing`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/diagnostics`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/legit-check`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/partners`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
