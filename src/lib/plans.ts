export type PlanFeatureKey =
  | "subscriptions"
  | "analytics"
  | "notifications"
  | "notificationSchedule"
  | "telegramMessageTemplate"
  | "currency"
  | "comparator"
  | "aiInsights";

export interface PlanData {
  id: string;
  limits: {
    maxSubscriptions: number;
    maxCategories: number | null;
  };
  features: Array<{
    key: PlanFeatureKey | string;
    included: boolean;
  }>;
}

export interface PlansResponse {
  plans: PlanData[];
  quotas: {
    free: {
      comparatorAiMonthly: number;
      comparatorMonthly: number | null;
    };
    plus: {
      comparatorAiMonthly: number;
      comparatorMonthly: number | null;
    };
  };
}

const PLANS_API_URL = "https://app.subeye.cc/api/billing/plans";
const CACHE_TTL_MS = 60 * 60 * 1000;

const FALLBACK: PlansResponse = {
  plans: [
    {
      id: "free",
      limits: { maxSubscriptions: 20, maxCategories: 20 },
      features: [
        { key: "subscriptions", included: true },
        { key: "analytics", included: true },
        { key: "notifications", included: true },
        { key: "notificationSchedule", included: false },
        { key: "telegramMessageTemplate", included: false },
        { key: "currency", included: true },
        { key: "comparator", included: true },
        { key: "aiInsights", included: true },
      ],
    },
    {
      id: "plus",
      limits: { maxSubscriptions: 50, maxCategories: null },
      features: [
        { key: "subscriptions", included: true },
        { key: "analytics", included: true },
        { key: "notifications", included: true },
        { key: "notificationSchedule", included: true },
        { key: "telegramMessageTemplate", included: true },
        { key: "currency", included: true },
        { key: "comparator", included: true },
        { key: "aiInsights", included: true },
      ],
    },
  ],
  quotas: {
    free: {
      comparatorAiMonthly: 10,
      comparatorMonthly: 10,
    },
    plus: {
      comparatorAiMonthly: 300,
      comparatorMonthly: null,
    },
  },
};

let cache: {
  fetchedAt: number;
  value: PlansResponse;
} | null = null;

function isPlansResponse(payload: unknown): payload is PlansResponse {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<PlansResponse>;
  if (!Array.isArray(candidate.plans) || !candidate.quotas) {
    return false;
  }

  const hasFree = candidate.plans.some((plan) => plan?.id === "free");
  const hasPlus = candidate.plans.some((plan) => plan?.id === "plus");

  return hasFree && hasPlus;
}

export async function fetchPlans(): Promise<PlansResponse> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    console.info("[plans] serving from cache");
    return cache.value;
  }

  const apiKey = import.meta.env.PLANS_API_KEY;
  if (!apiKey) {
    console.error("[plans] missing PLANS_API_KEY, using fallback");
    return FALLBACK;
  }

  try {
    const response = await fetch(PLANS_API_URL, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      console.error(`[plans] API returned ${response.status}, using fallback`);
      return FALLBACK;
    }

    const payload = (await response.json()) as unknown;
    if (!isPlansResponse(payload)) {
      console.error("[plans] API payload shape is invalid, using fallback");
      return FALLBACK;
    }

    cache = {
      fetchedAt: Date.now(),
      value: payload,
    };

    console.info("[plans] live data fetched from API");
    return payload;
  } catch (error) {
    console.error("[plans] fetch failed, using fallback", error);
    return FALLBACK;
  }
}
