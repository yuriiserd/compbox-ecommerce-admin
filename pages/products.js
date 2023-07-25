import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DeletePopup from "@/components/DeletePopup"
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "@/slices/deleteSlice";
import { useDispatch, useSelector } from "react-redux";
import Back from "@/components/Back";
import EditIcon from "@/components/icons/EditIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";


export default function Products() {

  const [products, setProducts] = useState([]);
  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
  }, [openPopup])
  
  return (
    <Layout>
      <Link className="btn" href={'/products/new'}>Add new product</Link>
      <div className="table default mt-6">
        <div className="table__head">
          <ul className="table-row">
            <li>Product name</li>
            <li className="hidden md:table-cell">Categories</li>
            <li>Price</li>
            <li>Actions</li>
          </ul>
        </div>
        <div className="table__body">
          {!products.length && (
            <ul className="table-row">
              <li><Spinner/></li>
            </ul>
          )}
          {products.map(product => (
            <ul className="table-row" key={product._id}>
              <li>{product.title}</li>
              <li className="hidden md:table-cell">{product.category.name}</li>
              <li>{product.price}$</li>
              <li className="flex items-top ml-2 gap-4 border-stone-200">
                <Link className="text-stone-700" href={`/products/edit/${product._id}`}>
                  <EditIcon/>
                </Link>
                {/* TODO add copy function */}
                <button onClick={() => {
                  dispatch(openDelete());
                  dispatch(setDeleteItem(product._id))
                }} className="text-stone-700 flex">
                  <DeleteIcon/>
                </button>
              </li>
            </ul>
          ))}
        </div>
      </div>
      <DeletePopup collection={'products'}/>
    </Layout>
  )
}
