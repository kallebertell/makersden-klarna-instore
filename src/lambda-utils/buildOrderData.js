export const buildOrderData = ({ order_lines }) => ({
  acquiring_channel: "in_store",
  purchase_country: "DE",
  purchase_currency: "EUR",
  // We're in the german market but we want English for our demo
  locale: "en-GB",
  auto_capture: true,
  order_lines,
  order_amount: order_lines.reduce((acc, line) => {
    return acc + line.total_amount;
  }, 0),
  options: {
    disable_confirmation_modals: true
  }
});
