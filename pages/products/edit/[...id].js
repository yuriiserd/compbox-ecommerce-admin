import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";
import Back from "@/components/Back";
import Link from "next/link";


export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id=' + id).then(response => {
      setProductInfo(response.data);
    })
  }, [id]);

  return (
    <Layout>
      <h1 className="flex items-center gap-4">
        <Back to={"/products/"}/>
        Edit Product
      </h1>
      
      {productInfo && (
        <>
          <Link className="border-2 mb-4 inline-block py-1 px-4 rounded-md" href={process.env.NEXT_PUBLIC_FRONTEND_URL+'product/'+productInfo._id}>View Live</Link>
          <ProductForm {...productInfo}/>
        </>
      )}
    </Layout>
  )
}