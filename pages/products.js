import Layout from "@/components/Layout";
import Link from "next/link";


export default function Products() {
 return (
   <Layout>
      <Link className="bg-stone-300 text-stone-900 py-1 px-4 rounded-md" href={'/products/new'}>Add new product</Link>
   </Layout>
 )
}
