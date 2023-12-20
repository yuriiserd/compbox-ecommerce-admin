import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { statusColor } from "@/lib/statusColor";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoreOrders, setShowMoreOrders] = useState(false);

  const orderRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/customers').then(res => {
      setCustomers(res.data);
      setLoading(false);
    })
  }, [])
  

  return (
      <Layout>
        <h1>Customers</h1>
        <div className="table default mt-6 max-w-[1100px]">
          <div className="table__head">
            <ul className="table-row">
              <li className="max-w-[200px]">Name</li>
              <li className="max-w-[200px]">Info</li>
              <li className="max-w-[450px]">Orders</li>
              <li className="max-w-[120px]">Total spent</li>
            </ul>
          </div>
          <div className="table__body">
            {!loading ? (
              <>
                {customers.map(customer => (
                  <ul key={customer._id} className="table-row">
                    <li className="max-w-[200px]">{customer.name}</li>
                    <li className="max-w-[200px]">
                      {customer.email}
                      {customer.phone && (<><br/>{customer.phone}</>)}
                      {customer.country && (<><br/>{customer.country}</>)}
                      {customer.city && (<>,{customer.city}</>)}
                      {customer.address && (<><br/>{customer.address}</>)}
                      {customer.zip && (<><br/>{customer.zip}</>)}
                    </li>
                    <li className="max-w-[450px]" >
                      <div>
                        {customer.orders.length > 0 ? (
                          <>
                            {customer.orders.slice(-5).reverse().map(order => {
                              let orderTotalPrice = 0;
                              order.product_items.forEach(item => {
                                orderTotalPrice += item.price_data.unit_amount * item.quantity / 100;
                              })
                              let discountTotal = 0;
                              if (order?.coupon) {
                                discountTotal = orderTotalPrice * (1 - order.coupon.percent_off / 100)
                              }
                              return (
                                <div ref={orderRef} className={`pb-2 flex gap-2 flex-wrap ${order.status === "Cancelled" && "opacity-50"}`} key={order._id}>
                                  <span className={`${order.paid ? 'bg-green-500': 'bg-red-500'} px-2 mb-1 inline-block rounded-md text-white`}>
                                    {order.paid ? 'Paid' : 'Not Paid'} 
                                  </span>
                                  <span 
                                    className={` px-2 mb-1 inline-block rounded-md`} 
                                    style={{backgroundColor: statusColor[order.status]?.bg, color: statusColor[order.status]?.text}}
                                  >
                                    {order.status} 
                                  </span>
                                  <Link href={"/orders/edit/" + order._id}>
                                    {new Date(order.updatedAt).toLocaleDateString()}
                                    &nbsp;
                                    {discountTotal ? (
                                      <>
                                        <span className="text-gray-500 line-through"> {orderTotalPrice}$ </span>
                                        &nbsp;
                                        <span className="text-red-600"> {discountTotal}$</span>
                                      </>
                                    ) : (
                                      <span> ${orderTotalPrice} &nbsp;</span>
                                    )}
                                  </Link>
                                  
                                </div>
                              )
                            })}
                            {showMoreOrders && customer.orders.slice(0, customer.orders.length - 6).reverse().map(order => {
                              let orderTotalPrice = 0;
                              order.product_items.forEach(item => {
                                orderTotalPrice += item.price_data.unit_amount * item.quantity / 100;
                              })
                              let discountTotal = 0;
                              if (order?.coupon) {
                                discountTotal = orderTotalPrice * (1 - order.coupon.percent_off / 100)
                              }
                              return (
                                <div ref={orderRef} className={`pb-2 flex gap-2 flex-wrap ${order.status === "Cancelled" && "opacity-50"}`} key={order._id}>
                                  <span className={`${order.paid ? 'bg-green-500': 'bg-red-500'} px-2 mb-1 inline-block rounded-md text-white`}>
                                    {order.paid ? 'Paid' : 'Not Paid'} 
                                  </span>
                                  <span 
                                    className={` px-2 mb-1 inline-block rounded-md`} 
                                    style={{backgroundColor: statusColor[order.status]?.bg, color: statusColor[order.status]?.text}}
                                  >
                                    {order.status} 
                                  </span>
                                  <Link href={"/orders/edit/" + order._id}>
                                    {new Date(order.updatedAt).toLocaleDateString()}
                                    &nbsp;
                                    {discountTotal ? (
                                      <>
                                        <span className="text-gray-500 line-through"> {orderTotalPrice}$ </span>
                                        &nbsp;
                                        <span className="text-red-600"> {discountTotal}$</span>
                                      </>
                                    ) : (
                                      <span> ${orderTotalPrice} &nbsp;</span>
                                    )}
                                  </Link>
                                  
                                </div>
                              )
                            })}
                            {customer.orders.length > 5 && (
                              <button onClick={() => setShowMoreOrders(!showMoreOrders)} className="text-gray-500">
                                Show {showMoreOrders ? "less" : "more"}
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">No orders</span>
                        )}
                      </div>

                    </li>
                    {/* Total spend */}
                    <li className="max-w-[120px]">
                      {parseFloat(
                        customer.orders.reduce((sum, order) => {
                          let orderTotalPrice = 0;
                          if (order?.paid) {
                            order.product_items.forEach(item => {
                              orderTotalPrice += item.price_data.unit_amount * item.quantity / 100;
                            })
                            if (order?.coupon) {
                              orderTotalPrice = orderTotalPrice * (1 - order.coupon.percent_off / 100)
                            }
                          }
                          return sum + orderTotalPrice;
                        }, 0)
                      ).toFixed(2)}$
                      </li>
                  </ul>
                ))}
              </>
            ) : (
              <Spinner/> 
            )}
          </div>
        </div>
      </Layout>
  )
}