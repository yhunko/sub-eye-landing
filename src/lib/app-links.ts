const APP_BASE_URL = "https://app.subeye.cc";
const BILLING_PATH = "/settings/billing?from=%2F";

export const appUrls = {
  home: APP_BASE_URL,
  signIn: `${APP_BASE_URL}/auth/sign-in`,
  signUp: `${APP_BASE_URL}/auth/sign-up`,
  billing: `${APP_BASE_URL}${BILLING_PATH}`,
  billingSignIn: `${APP_BASE_URL}/auth/sign-in?redirect_url=${encodeURIComponent(BILLING_PATH)}`,
} as const;
