"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleManageBilling}
      disabled={loading}
    >
      {loading ? "Loading..." : "Manage Billing"}
    </Button>
  );
}
