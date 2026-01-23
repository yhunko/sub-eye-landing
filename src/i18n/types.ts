export type Lang = "en" | "ua";

export interface LandingDict {
  nav: {
    product: string;
    pricing: string;
    faq: string;
    signin: string;
    signup: string;
    switchTo: string;
    skipToContent: string;
    brandTagline: string;
  };
  hero: {
    versionLive: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    primaryNote: string;
    secondaryNote: string;
    stats: {
      timeLabel: string;
      timeValue: string;
      focusLabel: string;
      focusValue: string;
      goalLabel: string;
      goalValue: string;
    };
    preview: {
      ariaLabel: string;
      thisMonth: string;
      spend: string;
      savings: string;
      spotifyMeta: string;
      spotifyRenews: string;
      netflixMeta: string;
      netflixRenews: string;
      duplicateTitle: string;
      duplicateSavings: string;
      duplicateBody: string;
      footerLeft: string;
      footerRight: string;
    };
  };
  sections: {
    featuresTitle: string;
    featuresSubtitle: string;
    pricingTitle: string;
    pricingSubtitle: string;
    faqTitle: string;
    faqSubtitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaNote: string;
  };
  features: Array<{ title: string; description: string }>;
  pricing: {
    badge: string;
    name: string;
    description: string;
    price: string;
    per: string;
    priceNote: string;
    cta: string;
    includesTitle: string;
    includes: string[];
    futureTitle: string;
    futureCopy: string;
    futureExtra: string;
  };
  faq: Array<{ q: string; a: string }>;
  footer: {
    rights: string;
    contact: string;
    tagline: string;
  };
}
