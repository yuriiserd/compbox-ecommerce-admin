import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  console.log(customers)
  return (
      <Layout>
        <h1>Customers</h1>
        <div className="table default mt-6 max-w-[1100px]">
          <div className="table__head">
            <ul className="table-row">
              <li className="max-w-[200px]">Name</li>
              <li>Info</li>
              <li className="max-w-[250px]">Orders</li>
              <li className="max-w-[120px]">Total spent</li>
            </ul>
          </div>
          <div className="table__body">
            {!loading ? (
              <>
                {customers.map(customer => (
                  <ul key={customer._id} className="table-row">
                    <li className="max-w-[200px]">{customer.name}</li>
                    <li>
                      {customer.email}
                      {customer.phone && (<><br/>{customer.phone}</>)}
                      {customer.country && (<><br/>{customer.country}</>)}
                      {customer.city && (<>,{customer.city}</>)}
                    </li>
                    <li className="max-w-[250px]">
                      {customer.orders.length > 0 ? (
                        <>
                          {customer.orders.map(order => (
                            <div className="mb-2" key={order}>
                              <Link href={"/orders/edit/" + order}>{order}</Link>
                            </div>
                          ))}
                        </>
                      ) : (
                        <span className="text-gray-400">No orders</span>
                      )}
                    </li>
                    <li className="max-w-[120px]">total $</li>
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