import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  defaultTitle: "SimpleGrants",
  additionalMetaTags: [
    {
      property: "keywords",
      content:
        "simplegrants, quadratic, funding, quadratic funding, fundraising, raise, grants",
    },
  ],
  canonical: "https://simplegrants.xyz/",
  openGraph: {
    type: "website",
    title: "SimpleGrants",
    description: "Join us in making an impact through quadratic funding.",
    url: "https://simplegrants.xyz/",
    images: [
      {
        url: "https://simplegrants.xyz/og-images/og-image.png",
        width: 1200,
        height: 627,
        alt: "Og Image Alt",
      },
      {
        url: "https://simplegrants.xyz/og-images/og-image-2.png",
        width: 800,
        height: 600,
        alt: "Og Image Alt 2",
      },
      {
        url: "https://simplegrants.xyz/og-images/og-image-3.png",
        width: 640,
        height: 640,
        alt: "Og Image Alt 3",
      },
    ],
  },
  twitter: {
    handle: "@supermodularxyz",
    site: "@supermodularxyz",
    cardType: "summary_large_image",
  },
};

export default config;
