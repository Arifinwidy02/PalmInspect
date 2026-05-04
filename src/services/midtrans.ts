export interface MidtransTransaction {
  orderId: string;
  amount: number;
  projectId: string;
}

export async function createTransaction(
  projectId: string,
  amount: number = 5000
): Promise<{ token: string; redirectUrl: string }> {
  // Mock Midtrans Snap API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  return {
    token: `snap-token-mock-${orderId}`,
    redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${orderId}`,
  };
}

export async function verifyPayment(orderId: string): Promise<boolean> {
  // Mock webhook verification
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}
