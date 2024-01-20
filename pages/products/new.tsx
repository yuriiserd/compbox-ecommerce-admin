
import Layout from "/components/Layout";
import ProductForm from "/components/ProductForm";
import Back from "/components/Back";

export default function NewProduct() {
  return (
    <Layout>
      <h1 className="flex items-center gap-4">
        <Back to={"/products/"}/>
        New Product
      </h1>
      <ProductForm/>
    </Layout>
  )
}