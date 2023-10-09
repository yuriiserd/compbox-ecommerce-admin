import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import Spinner from "@/components/Spinner";
import DeletePopup from "@/components/DeletePopup"
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "@/slices/deleteSlice";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@/components/icons/EditIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import Image from "next/image";
import classNames from "classnames";
import CopyIcon from "@/components/icons/CopyIcon";


export default function Products() {

  const [timeoutSearch, setTimeoutSearch] = useState(null);
  const [products, setProducts] = useState([]);
  const [noItemsFound, setNoItemsFound] = useState(false);
  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();

  useEffect(() => {
    getProducts()
  }, [openPopup])

  async function getProducts() {
    await axios.get('/api/products').then(response => {
      setProducts(response.data);
      if (response.data.length === 0) {
        setNoItemsFound(true)
      } else {
        setNoItemsFound(false)
      }
    });
  }

  async function createCopy(id) {

    await axios.get('/api/products?id='+id).then(response => {
      const {title, category, description, content, price, salePrice, images, properties} = response.data;
      const responceData = {title: title + ' (copy)', category, description, content, price, salePrice, images, properties};
      
      axios.post('/api/products', responceData).then(() => {
        getProducts()
      })
    })
  }
  // timeout for search optimization
  // reduce server requests
  function searchProducts(name) {

    clearTimeout(timeoutSearch);
    setTimeoutSearch(setTimeout(() => {
      axios.get('/api/products?name='+name).then(response => {
        setProducts(response.data);
        if (response.data.length === 0) {
          setNoItemsFound(true)
        } else {
          setNoItemsFound(false)
        }
      });
    }, 500))
    
  }
 


  
  return (
    <Layout>
      <div className="flex justify-between items-center gap-4">
        <Link className="btn min-w-fit" href={'/products/new'}>Add new product</Link>
        {/* TODO create search and filter */}
        <input 
          onChange={(event) => {
            searchProducts(event.target.value);
          }}
          className="w-96 mb-0 max-w-fit mr-0" 
          type="text" 
          placeholder="search"/>
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
          {!products.length && !noItemsFound && (
            <ul>
              <li><Spinner/></li>
            </ul>
          )}
          {noItemsFound && (
            <ul>
              <li className="text-center p-4 w-full">No products found</li>
            </ul>
          )}
          {products.map(product => (
            <ul className="table-row" key={product._id}>
              <li className="flex gap-2 items-top">
                <div className="image"><Image src={product.images[0]} width={96} height={96} alt={`image`}/></div>
                <div>{product.title}</div>
              </li>
              <li className="hidden md:table-cell">{product.category.name}</li>
              <li className="w-10">
                <span className={classNames({
                  crossed: product.salePrice
                })}>{product.price}$</span> 
                <span className={classNames("block", {
                  hidden: !product.salePrice
                })}>{product.salePrice}$</span>
              </li>
              <li className="flex items-top gap-4 max-sm:gap-2 max-sm:flex-col w-20 border-stone-200  ">
                <Link className="text-stone-700" href={`/products/edit/${product._id}`}>
                  <EditIcon/>
                </Link>
                <button onClick={() => createCopy(product._id)} className="text-stone-700 flex">
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
