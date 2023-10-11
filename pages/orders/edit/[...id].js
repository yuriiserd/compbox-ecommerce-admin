import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import OrderForm from "@/components/OrderForm";
import Back from "@/components/Back";

export default function EditOrderPage() {
  const [orderInfo, setOrderInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/orders?id=' + id).then(response => {
      setOrderInfo(response.data);
    })
  }, [id]); 
  return (
    <Layout>
      <h1 className="flex items-center gap-4">
        <Back to={"/orders/"}/>
        Edit Order
      </h1>
      {orderInfo && (
        <OrderForm {...orderInfo}/>
      )}
    </Layout>
  )
}