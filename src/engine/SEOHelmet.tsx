import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string; // optional, will auto-fallback
}

const SEOHelmet: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/src/assets/logo-icon.png",
  url,
}) => {
  // fallback to current window location on client
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : url || "https://cloud.defcomm.ng"; // server fallback domain

  return (
    <Helmet>
      {/* Page Title */}
      <title>DefComm | {title}</title>

      {/* Standard Meta */}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph (Social) */}
      <meta property="og:title" content={`DefComm | ${title}`} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`DefComm | ${title}`} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEOHelmet;
