import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";


export default function Products() {
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
  }, [popup])

  async function deletePopup(id) {
    await axios.get('/api/products?id='+id).then(res => {
      setCurrentProduct(res.data);
    })
    setPopup(true);
  }
  async function deleteProduct(id) {
    await axios.delete('/api/products?id='+id).then(() => {
      setPopup(false);
    });
  }
  return (
    <Layout>
      <Link className="btn" href={'/products/new'}>Add new product</Link>
      <table className="default mt-6">
        <thead>
          <tr>
            <td>Product name</td>
            <td>Price</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} className="product-preview">
              <td>{product.title}</td>
              <td><strong>{product.price}</strong></td>
              <td className="flex border-none justify-center gap-8 border-stone-200 border-r">
                <Link className="text-stone-700" href={`/products/edit/${product._id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </Link>
                <button onClick={() => deletePopup(product._id)} className="text-stone-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={classNames('popup',{
        open: popup
      })}>
        <div className="popup__content"> 
          <p>Do you whant to delete<br/> "{currentProduct?.title}"?</p>
          <div className="flex gap-4 justify-center mt-4">
            <button className="btn btn_red" onClick={() => deleteProduct(currentProduct?._id)}>Yes</button>
            <button className="btn" onClick={() => setPopup(false)}>No</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
