export {};

declare global {
  interface RazorpayOptions {
    key: string;
    amount: number; // Amount in the smallest currency unit (e.g., paise)
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: {
      [key: string]: string;
    };
    theme?: {
      color: string;
    };
  }

  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayInstance {
    open: () => void;
    on: (
      event: "payment.failed" | "payment.success",
      callback: (response: RazorpayPaymentResponse) => void
    ) => void;
    // Add other methods if needed
  }

  interface Razorpay {
    new (options: RazorpayOptions): RazorpayInstance;
  }

  interface Window {
    Razorpay: Razorpay;
  }
}
