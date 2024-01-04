import useProductTotal from "@/hooks/useProductTotal";
import { useEffect, useState } from "react";

export default function OrdersSummaryCard({orders, period}) {

  const [ordersCount, setOrdersCount] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {

    setOrdersCount(orders.length);

    let total = 0;
    orders.forEach(order => {
      if (order.paid) {
        total += useProductTotal(order.product_items, order?.coupon?.percent_off);
      }
    });
    
    setTotal(total);
  }, [orders])

  return (
    <div className="order-summary-card">
      <h3>{period}</h3>
      <p>{ordersCount} orders</p>
      <p>{total}$</p>
    </div>
  )
}