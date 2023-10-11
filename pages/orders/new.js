
import Layout from "@/components/Layout";
import OrderForm from "@/components/OrderForm";
import Back from "@/components/Back";

export default function NewProduct() {
  return (
    <Layout>
      <h1 className="flex items-center gap-4">
        <Back to={"/orders/"}/>
        New Order
      </h1>
      <OrderForm/>
    </Layout>
  )
}