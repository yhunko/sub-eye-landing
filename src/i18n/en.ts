import type { LandingDict } from "./types";

export const en: LandingDict = {
  nav: {
    product: "Product",
    pricing: "Pricing",
    faq: "FAQ",
    signin: "Sign in",
    signup: "Sign up",
    switchTo: "Switch language",
    brandTagline: "Subscriptions simplified",
  },
  hero: {
    versionLive: "is now live",
    title: "See every subscription before it renews.",
    subtitle:
      "SubEye connects to your banks and apps to surface every recurring charge, so you never overpay for forgotten subscriptions again.",
    primaryCta: "Start for free",
    secondaryCta: "View the app",
    primaryNote: "No credit card required.",
    secondaryNote: "Instant sign-in with your existing account.",
    stats: {
      timeLabel: "Time to first overview",
      timeValue: "< 1 minute",
      focusLabel: "Focus",
      focusValue: "Subscriptions only",
      goalLabel: "Goal",
      goalValue: "Fewer surprise renewals",
    },
    preview: {
      ariaLabel: "SubEye dashboard preview",
      thisMonth: "This month",
      spend: "€115 on subscriptions",
      savings: "- €38 after cleanup",
      spotifyMeta: "Monthly • Music",
      spotifyRenews: "Renews in 3 days",
      netflixMeta: "Monthly • Video",
      netflixRenews: "Renews tomorrow",
      duplicateTitle: "Duplicate subscription found",
      duplicateSavings: "Save €14 / mo",
      duplicateBody:
        "Two overlapping cloud storage subscriptions detected. We’ll help you decide which one to cancel.",
      footerLeft: "Focused purely on recurring spend.",
      footerRight: "No ads. No clutter.",
    },
  },
  sections: {
    featuresTitle: "Stay ahead of your recurring costs",
    featuresSubtitle:
      "SubEye gives you a single, trustworthy view of all your subscriptions – across cards, banks, and app stores.",
    pricingTitle: "Simple pricing that starts free",
    pricingSubtitle:
      "Launch with our free plan today. We’ll add flexible paid tiers later as we grow together.",
    faqTitle: "Frequently asked questions",
    faqSubtitle: "Quick answers about how SubEye works and what to expect.",
    ctaTitle: "Ready to see your subscriptions clearly?",
    ctaSubtitle:
      "Create a free SubEye account in under a minute and get an instant overview of your recurring spend.",
    ctaPrimary: "Get started in the app",
    ctaSecondary: "Sign in instead",
    ctaNote:
      "Canceling is always the hard part. The first step is seeing everything clearly in one place.",
  },
  features: [
    {
      title: "Unified subscription radar",
      description:
        "Connect banks and cards to automatically detect subscriptions, trials, and recurring charges in one place.",
    },
    {
      title: "Upcoming renewals, clearly listed",
      description:
        "See which services renew this week, this month, or later – with smart alerts so you have time to react.",
    },
    {
      title: "Spot duplicates and waste",
      description:
        "Identify overlapping tools and forgotten trials so you can cancel what you don’t use and keep what matters.",
    },
    {
      title: "Privacy-first by design",
      description:
        "We only use your data to surface subscriptions for you. No reselling or ads, ever.",
    },
  ],
  pricing: {
    badge: "Launch pricing",
    name: "Free",
    description:
      "Perfect while we’re in early access – powerful tracking with no subscription fee.",
    price: "$0",
    per: "/ mo",
    priceNote:
      "Free during launch. Well-thought and reasonable paid tiers will arrive later.",
    cta: "Create free account",
    includesTitle: "What’s included",
    includes: [
      "Automatic detection of recurring payments (Coming soon...)",
      "Unified view of subscriptions across accounts",
      "Upcoming renewal timeline",
      "Basic alerts for approaching renewals",
      "Secure account with modern authentication",
    ],
    futureTitle: "Built to grow with you",
    futureCopy:
      "We’ll introduce paid plans later with advanced analytics, more connection types, and team features – without breaking what already works.",
    futureExtra:
      "If you start tracking subscriptions now, the free plan will remain a solid base even as we introduce more advanced capabilities.",
  },
  faq: [
    {
      q: "What is SubEye?",
      a: "SubEye is a focused tool for tracking and managing all of your recurring subscriptions in one place, so you never get surprised by renewals.",
    },
    {
      q: "Is SubEye free?",
      a: "Yes. Right now we offer a single free plan while the product is evolving. Later we may add paid tiers for power users and teams.",
    },
    {
      q: "How does SubEye find my subscriptions?",
      a: "[COMING SOON] SubEye connects to your financial data sources and analyzes transactions to detect recurring charges, trials, and subscription-like payments.",
    },
    {
      q: "Can I cancel subscriptions from SubEye?",
      a: "Today SubEye focuses on visibility: surfacing what you pay for and when it renews. Depending on the provider, we help you quickly get to the right place to manage or cancel.",
    },
    {
      q: "How do you handle my data?",
      a: "We take privacy seriously. Your data is only used to provide you with insights about your subscriptions.",
    },
  ],
  footer: {
    rights: "All rights reserved.",
    contact: "Contact: hello@subeye.cc",
    tagline: "Focused on clear, honest recurring spend.",
  },
};
