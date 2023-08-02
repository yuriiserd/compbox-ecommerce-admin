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
import Image from "next/image";
import classNames from "classnames";
import CopyIcon from "@/components/icons/CopyIcon";


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
      <div className="flex justify-between items-center gap-4">
        <Link className="btn min-w-fit" href={'/products/new'}>Add new product</Link>
        {/* TODO create search and filter */}
        <input className="w-96 mb-0" type="text" placeholder="search"/>
      </div>

      <div className="table default mt-6">
        <div className="table__head">
          <ul className="table-row">
            <li>Product name</li>
            <li className="hidden md:table-cell">Category</li>
            <li>Price</li>
            <li>Actions</li>
          </ul>
        </div>
        <div className="table__body">
          {!products.length && (
            <ul>
              <li><Spinner/></li>
            </ul>
          )}
          {products.map(product => (
            <ul className="table-row" key={product._id}>
              <li className="flex gap-2 items-top">
                <div className="image"><Image src={product.images[0]} width={96} height={96} alt={`image`}/></div>
                <div>{product.title}</div>
              </li>
              <li className="hidden md:table-cell">{product.category.name}</li>
              <li>
                <span className={classNames({
                  crossed: product.salePrice
                })}>{product.price}$</span> 
                <span className={classNames("block", {
                  hidden: !product.salePrice
                })}>{product.salePrice}$</span>
              </li>
              <li className="flex items-top gap-4 border-stone-200 ">
                <Link className="text-stone-700" href={`/products/edit/${product._id}`}>
                  <EditIcon/>
                </Link>
                {/* TODO add copy function */}
                <button className="text-stone-700 flex">
                  <CopyIcon/>
                </button>
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
