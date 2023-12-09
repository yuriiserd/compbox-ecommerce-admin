import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { statusColor } from "@/lib/statusColor";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

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
                    </li>
                    <li className="max-w-[450px]">
                      {customer.orders.length > 0 ? (
                        <>
                          {customer.orders.slice(0).reverse().map(order => {
                            let orderTotalPrice = 0;
                            order.product_items.forEach(item => {
                              orderTotalPrice += item.price_data.unit_amount * item.quantity / 100;
                            })
                            let discountTotal = 0;
                            if (order?.coupon) {
                              discountTotal = orderTotalPrice * (1 - order.coupon.percent_off / 100)
                            }
                            return (
                              <div className="mb-2 flex gap-2 flex-wrap" key={order._id}>
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
                        </>
                      ) : (
                        <span className="text-gray-400">No orders</span>
                      )}
                    </li>
                    {console.log(customer.orders[0])}
                    <li className="max-w-[120px]">
                      {customer.orders.reduce((sum, order) => {
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
                      }, 0)}$
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