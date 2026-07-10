import { orderFinancialRules } from "@/lib/data/site";

export function calculateOrderTotals(subtotal: number) {
  const gstTotal = roundCurrency(subtotal * orderFinancialRules.gstRate);
  const shippingTotal = orderFinancialRules.flatShipping;

  return {
    subtotal: roundCurrency(subtotal),
    gstTotal,
    shippingTotal,
    grandTotal: roundCurrency(subtotal + gstTotal + shippingTotal)
  };
}

export function formatInvoiceNumber(year: number, sequence: number) {
  return `INV-${year}-${String(sequence).padStart(6, "0")}`;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}
