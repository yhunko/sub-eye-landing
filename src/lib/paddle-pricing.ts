import type { Lang } from "../i18n";

interface PaddleMoney {
  amount: string;
  currency_code: string;
}

interface PaddlePriceOverride {
  country_codes: string[];
  unit_price: PaddleMoney;
}

interface PaddleBillingCycle {
  interval?: string;
  frequency?: number;
}

interface PaddlePrice {
  id: string;
  product_id?: string;
  unit_price: PaddleMoney;
  unit_price_overrides?: PaddlePriceOverride[];
  billing_cycle?: PaddleBillingCycle | null;
}

interface PaddleProduct {
  id: string;
  name?: string | null;
}

interface PaddleApiResponse<T> {
  data: T;
}

interface ProPricingModelInput {
  lang: Lang;
  request: Request;
  fallbackPrice: string;
  fallbackPlanName: string;
}

interface ProPricingModel {
  displayPrice: string;
  planName: string;
}

const PADDLE_API_BASE_URL = "https://api.paddle.com";
const COUNTRY_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "x-country"];
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedPriceResult: {
  key: string;
  fetchedAt: number;
  price: PaddlePrice | null;
  planName: string | null;
} | null = null;

function readRequestCountryCode(request: Request): string | null {
  for (const headerName of COUNTRY_HEADERS) {
    const value = request.headers.get(headerName)?.trim().toUpperCase();
    if (value && value !== "XX" && /^[A-Z]{2}$/.test(value)) {
      return value;
    }
  }
  return null;
}

function getLocale(lang: Lang): string {
  return lang === "ua" ? "uk-UA" : "en-US";
}

function normalizePaddleAmount(amount: string, currencyCode: string): number {
  const parsed = Number(amount);
  if (!Number.isFinite(parsed)) {
    return NaN;
  }

  if (amount.includes(".")) {
    return parsed;
  }

  const digits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).resolvedOptions().maximumFractionDigits;

  return parsed / 10 ** digits;
}

function formatPaddleMoney(
  money: PaddleMoney | null | undefined,
  lang: Lang,
): string | null {
  if (!money) {
    return null;
  }

  const normalized = normalizePaddleAmount(money.amount, money.currency_code);
  if (!Number.isFinite(normalized)) {
    return null;
  }

  return new Intl.NumberFormat(getLocale(lang), {
    style: "currency",
    currency: money.currency_code,
  }).format(normalized);
}

function resolveMoneyForCountry(
  price: PaddlePrice,
  countryCode?: string | null,
): PaddleMoney {
  if (!countryCode) {
    return price.unit_price;
  }

  const upperCode = countryCode.toUpperCase();
  const override = price.unit_price_overrides?.find((item) =>
    item.country_codes.some((code) => code.toUpperCase() === upperCode),
  );

  return override?.unit_price ?? price.unit_price;
}

function findOverrideMoneyByCountry(
  price: PaddlePrice,
  countryCode: string,
): PaddleMoney | null {
  const upperCode = countryCode.toUpperCase();
  const override = price.unit_price_overrides?.find((item) =>
    item.country_codes.some((code) => code.toUpperCase() === upperCode),
  );
  return override?.unit_price ?? null;
}

function findOverrideMoneyByCurrency(
  price: PaddlePrice,
  currencyCode: string,
): PaddleMoney | null {
  const upperCurrencyCode = currencyCode.toUpperCase();
  const override = price.unit_price_overrides?.find(
    (item) => item.unit_price.currency_code.toUpperCase() === upperCurrencyCode,
  );
  return override?.unit_price ?? null;
}

function resolveDisplayMoney(
  price: PaddlePrice,
  lang: Lang,
  requestCountryCode: string | null,
): PaddleMoney {
  if (lang === "ua") {
    const uaOverride = findOverrideMoneyByCountry(price, "UA");
    if (uaOverride) {
      return uaOverride;
    }

    const uahOverride = findOverrideMoneyByCurrency(price, "UAH");
    if (uahOverride) {
      return uahOverride;
    }

    return resolveMoneyForCountry(price, requestCountryCode);
  }

  const usdOverride = findOverrideMoneyByCurrency(price, "USD");
  if (usdOverride) {
    return usdOverride;
  }

  return price.unit_price;
}

function pickDefaultPrice(prices: PaddlePrice[]): PaddlePrice | null {
  if (!prices.length) {
    return null;
  }

  const monthlyPrice = prices.find((price) => {
    if (!price.billing_cycle) {
      return false;
    }
    return (
      price.billing_cycle.interval === "month" &&
      price.billing_cycle.frequency === 1
    );
  });

  return monthlyPrice ?? prices[0] ?? null;
}

async function fetchPriceById(
  apiKey: string,
  priceId: string,
): Promise<PaddlePrice | null> {
  const response = await fetch(
    `${PADDLE_API_BASE_URL}/prices/${encodeURIComponent(priceId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as PaddleApiResponse<PaddlePrice>;
  return payload.data ?? null;
}

async function fetchPriceByProduct(
  apiKey: string,
  productId: string,
): Promise<PaddlePrice | null> {
  const url = new URL(`${PADDLE_API_BASE_URL}/prices`);
  url.searchParams.set("product_id", productId);
  url.searchParams.set("status", "active");
  url.searchParams.set("per_page", "100");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as PaddleApiResponse<PaddlePrice[]>;
  return pickDefaultPrice(payload.data ?? []);
}

async function fetchProductById(
  apiKey: string,
  productId: string,
): Promise<PaddleProduct | null> {
  const response = await fetch(
    `${PADDLE_API_BASE_URL}/products/${encodeURIComponent(productId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as PaddleApiResponse<PaddleProduct>;
  return payload.data ?? null;
}

async function fetchPaddlePricing(): Promise<{
  price: PaddlePrice | null;
  planName: string | null;
}> {
  const apiKey = import.meta.env.PADDLE_API_KEY;
  const priceId =
    import.meta.env.PADDLE_PLUS_PRICE_ID ?? import.meta.env.PADDLE_PRO_PRICE_ID;
  const productId = import.meta.env.PADDLE_PLUS_PRODUCT_ID;

  if (!apiKey) {
    return {
      price: null,
      planName: null,
    };
  }

  const cacheKey = `${priceId ?? ""}|${productId ?? ""}`;
  if (
    cachedPriceResult &&
    cachedPriceResult.key === cacheKey &&
    Date.now() - cachedPriceResult.fetchedAt < CACHE_TTL_MS
  ) {
    return {
      price: cachedPriceResult.price,
      planName: cachedPriceResult.planName,
    };
  }

  try {
    let price: PaddlePrice | null = null;
    let resolvedProductId = productId ?? null;

    if (priceId) {
      price = await fetchPriceById(apiKey, priceId);
      resolvedProductId = resolvedProductId ?? price?.product_id ?? null;
    } else if (productId) {
      price = await fetchPriceByProduct(apiKey, productId);
    }

    const product = resolvedProductId
      ? await fetchProductById(apiKey, resolvedProductId)
      : null;
    const planName = product?.name?.trim() || null;

    cachedPriceResult = {
      key: cacheKey,
      fetchedAt: Date.now(),
      price,
      planName,
    };

    return {
      price,
      planName,
    };
  } catch {
    cachedPriceResult = {
      key: cacheKey,
      fetchedAt: Date.now(),
      price: null,
      planName: null,
    };
    return {
      price: null,
      planName: null,
    };
  }
}

export async function getProPricingModel(
  input: ProPricingModelInput,
): Promise<ProPricingModel> {
  const { price: paddlePrice, planName } = await fetchPaddlePricing();
  if (!paddlePrice) {
    return {
      displayPrice: input.fallbackPrice,
      planName: planName ?? input.fallbackPlanName,
    };
  }

  const countryCode = readRequestCountryCode(input.request);
  const displayMoney = resolveDisplayMoney(
    paddlePrice,
    input.lang,
    countryCode,
  );
  const displayPrice =
    formatPaddleMoney(displayMoney, input.lang) ?? input.fallbackPrice;

  return {
    displayPrice,
    planName: planName ?? input.fallbackPlanName,
  };
}
