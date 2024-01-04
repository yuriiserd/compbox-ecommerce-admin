export default function useProductTotal(product_items, coupon_percent_off) {
  
  let total = 0;

  if (coupon_percent_off) {
    product_items.forEach(item => {
      total += item.quantity * item.price_data.unit_amount / 100;
    });
    total = total - total * coupon_percent_off / 100;
    return total;
  }
  product_items.forEach(item => {
    total += item.quantity * item.price_data.unit_amount / 100;
  });

  return total;
}