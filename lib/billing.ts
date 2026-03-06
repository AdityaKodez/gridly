import "server-only";

import { plansConfig } from "@/config";
import prisma from "@/lib/db";
import type { WebhookOrderPaidPayload } from "@polar-sh/sdk/models/components/webhookorderpaidpayload";
import { z } from "zod";

const orderPaidDataSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  productId: z.string().nullable(),
  subscriptionId: z.string().nullable(),
  customer: z.object({
    email: z.email(),
    externalId: z.string().nullable(),
  }),
});

const planByProductId = new Map(
  plansConfig.map((plan) => [plan.productId, plan.slug]),
);

export async function applyOrderPaidEntitlement(
  payload: WebhookOrderPaidPayload,
) {
  const parsed = orderPaidDataSchema.safeParse(payload.data);
  if (!parsed.success) {
    console.error("[Polar] Invalid order.paid payload", {
      issues: parsed.error.issues,
    });
    return;
  }

  const order = parsed.data;
  const normalizedEmail = order.customer.email.toLowerCase();
  const planSlug = order.productId ? planByProductId.get(order.productId) : null;

  if (!planSlug) {
    console.warn("[Polar] Unmapped product in order.paid", {
      orderId: order.id,
      productId: order.productId,
    });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  if (!user) {
    console.error("[Polar] No matching user for paid order", {
      orderId: order.id,
      email: normalizedEmail,
      externalId: order.customer.externalId,
    });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      planSlug,
      planStatus: "active",
      polarCustomerId: order.customerId,
      polarSubscriptionId: order.subscriptionId,
      polarProductId: order.productId,
      polarLastOrderId: order.id,
      entitlementUpdatedAt: new Date(),
    },
  });
}
