import { apiGet, apiPost } from "@/lib/api";

/**
 * Payment & subscription API layer.
 * Endpoints follow PAYMENT_API_HANDOFF.md. The axios base URL already
 * contains `/api/v1`, so paths here are relative to it.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

export interface PlanFeature {
  id: number;
  key: string;
  description: string | null;
  value: string | number | boolean | null;
}

export type BillingPeriod = "monthly" | "yearly";
export type PaymentMethod = "credit_card" | "apple_pay";

export interface Plan {
  id: number;
  name: string;
  /** Price for one billing cycle (e.g. "5.00" monthly, "50.00" yearly). */
  price: number | string;
  billing_type: BillingPeriod;
  trial_days: number | null;
  is_popular: boolean;
  features: PlanFeature[];
}

export interface CheckoutPayload {
  plan_id: number;
  /** The method is picked on the hosted payment page; default kept for the API. */
  payment_method?: PaymentMethod;
  billing_period: BillingPeriod;
  coupon_code?: string;
}

export interface CheckoutResult {
  order_id: string;
  order_number: string;
  payment_url: string;
  transaction_id: string;
  status: string;
  total_price: number;
  currency: string;
}

export type OrderStatusValue = "pending" | "processing" | "completed" | "failed";

export interface OrderStatus {
  order_id: string;
  order_number: string;
  plan_title: string;
  status: OrderStatusValue;
  payment_method: string;
  total_price: number;
  amount_paid: number | null;
  paid_at: string | null;
  payment_failed_reason: string | null;
  has_active_subscription: boolean;
}

// ─── API calls ────────────────────────────────────────────────────────────────

const langHeaders = (locale: string) => ({ "Accept-Language": locale });

export async function fetchPlans(locale: string): Promise<Plan[]> {
  const res = await apiGet<ApiEnvelope<Plan[]>>("/support/plans", {
    locale,
    headers: langHeaders(locale),
  });
  return res.data.data ?? [];
}

export async function startCheckout(
  payload: CheckoutPayload,
  locale: string,
): Promise<CheckoutResult> {
  const res = await apiPost<ApiEnvelope<CheckoutResult>>(
    "/users/payment/checkout",
    payload,
    { locale, headers: langHeaders(locale) },
  );
  return res.data.data;
}

export async function fetchOrderStatus(
  order: string,
  locale: string,
): Promise<OrderStatus> {
  const res = await apiGet<ApiEnvelope<OrderStatus>>(
    `/users/payment/orders/${encodeURIComponent(order)}/status`,
    { locale, headers: langHeaders(locale) },
  );
  return res.data.data;
}

/** Extracts the backend message (or a fallback) from an axios-style error. */
export function getErrorMessage(error: unknown, fallback: string): string {
  const e = error as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message || fallback;
}

// ─── Pricing helpers ──────────────────────────────────────────────────────────

/** Each plan now carries its own price and billing cycle. */
export function getPlanPrice(plan: Plan) {
  return {
    total: Number(plan.price) || 0,
    billing: (plan.billing_type === "yearly" ? "yearly" : "monthly") as BillingPeriod,
  };
}

export function formatSar(amount: number, locale: string): string {
  const tag = locale === "ar" ? "ar-SA-u-nu-latn" : "en-US";
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Pending plan (survives the login round-trip) ─────────────────────────────

const PENDING_PLAN_KEY = "pending_plan";
export const PENDING_ORDER_KEY = "pending_order_id";

export interface PendingPlan {
  planId: number;
}

export function savePendingPlan(value: PendingPlan) {
  try {
    sessionStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(value));
  } catch {}
}

export function readPendingPlan(): PendingPlan | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PLAN_KEY);
    return raw ? (JSON.parse(raw) as PendingPlan) : null;
  } catch {
    return null;
  }
}

export function clearPendingPlan() {
  try {
    sessionStorage.removeItem(PENDING_PLAN_KEY);
  } catch {}
}
