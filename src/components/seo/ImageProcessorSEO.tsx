import { Helmet } from 'react-helmet-async';

export function ImageProcessorSEO() {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Image Background Removal Tool - Fast & Easy</title>
      <meta name="title" content="Image Background Removal Tool - Fast & Easy" />
      <meta name="description" content="Remove image backgrounds instantly with our AI-powered tool. High-quality results, fast processing, and easy to use." />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Image Background Removal Tool - Fast & Easy" />
      <meta property="og:description" content="Remove image backgrounds instantly with our AI-powered tool. High-quality results, fast processing, and easy to use." />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content="Image Background Removal Tool - Fast & Easy" />
      <meta property="twitter:description" content="Remove image backgrounds instantly with our AI-powered tool. High-quality results, fast processing, and easy to use." />
      
      {/* Additional SEO Tags */}
      <meta name="keywords" content="background removal, image editing, AI image tool, remove background, image processing" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Accessibility Tags */}
      <html lang="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
