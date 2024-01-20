import Layout from "../components/Layout";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import DeletePopup from "../components/DeletePopup"
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "../slices/deleteSlice";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../components/icons/EditIcon";
import DeleteIcon from "../components/icons/DeleteIcon";
import Image from "next/image";
import classNames from "classnames";
import CopyIcon from "../components/icons/CopyIcon";
import ProductIcon from "../components/icons/ProductIcon";
import Search from "../components/Search";
import Dropdown from "../components/Dropdown";
import useAdminRole from "../hooks/useAdminRole";
import { useSession } from "next-auth/react";
import { ErrorContext } from "../components/ErrorContext";

type SelectedCategory = {
  _id?: string,
  name: string
}

export default function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({name: 'All Categories'});
  const [noItemsFound, setNoItemsFound] = useState(false);
  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();

  const {data: session} = useSession();

  const {setErrorMessage, setShowError} = useContext(ErrorContext);
  

  useEffect(() => {
    getProducts()
    getCategories()
  }, [openPopup, selectedCategory])

  async function getProducts() {
    let url = '/api/products';
    if (selectedCategory && selectedCategory._id) {
      url += `?category=${selectedCategory._id}`;
    }
    const res = await axios.get(url);
    setProducts(res.data);
    if (res.data.length === 0) {
      setNoItemsFound(true)
    } else {
      setNoItemsFound(false)
    }
  }
  async function getCategories() {
    await axios.get('/api/categories').then(response => {
      setCategories(response.data);
    });
  }

  async function createCopy(id) {

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to create copies of products. Please contact an admin');
      setShowError(true);
      return;
    }

    await axios.get('/api/products?id='+id).then(response => {
      const {title, category, description, content, price, salePrice, images, properties} = response.data;
      const responceData = {title: title + ' (copy)', category, description, content, price, salePrice, images, properties};
      
      axios.post('/api/products', responceData).then(() => {
        getProducts()
      })
    })
  }

  return (
    <Layout>
      <div className="flex justify-between items-center gap-4 max-w-[1100px]">
        <Link className="btn min-w-fit mr-auto" href={'/products/new'}>Add new product</Link>
        {/* TODO create filter */}
        
        <div className="relative">
          <Dropdown
            items={categories} 
            initialItem={selectedCategory}
            selectedItem={setSelectedCategory}
          />
        </div>
        <div>
          <Search setProducts={setProducts} setNoItemsFound={setNoItemsFound}/>
        </div>
        
      </div>

      <div className="table default mt-6 max-w-[1100px]">
        <div className="table__head">
          <ul className="table-row">
            {/* TODO sort up and down colums - name, category?, price*/}
            <li>Product name</li>
            <li className="hidden md:table-cell max-w-[200px]">Category</li>
            <li className="max-w-[100px]">Price</li>
            <li className="max-w-[120px]">Actions</li>
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
              <li>
                <Link className="flex gap-2 items-top hover:underline" href={`/products/edit/${product._id}`}>
                  <div className="image w-20">
                      {product.images[0] ? (
                        <Image src={product.images[0]} width={96} height={96} alt={product.title}/>
                      ) : (
                        <ProductIcon/>
                      )}
                  </div>
                  <div>{product.properties["Brand"]} {product.title}</div>
                </Link>
              </li>
              <li className="hidden md:table-cell max-w-[200px]">{product.category.name}</li>
              <li className="max-w-[100px]">
                <span className={classNames({
                  crossed: product.salePrice
                })}>{product.price}$</span> 
                <span className={classNames("block", {
                  hidden: !product.salePrice
                })}>{product.salePrice}$</span>
              </li>
              <li className="flex items-top gap-4 max-sm:gap-2 max-sm:flex-col w-20 border-stone-200 max-w-[120px]">
                <Link className="text-stone-700" href={`/products/edit/${product._id}`}>
                  <EditIcon/>
                </Link>
                <button onClick={() => createCopy(product._id)} className="text-stone-700 flex">
                  <CopyIcon/>
                </button>
                <button onClick={() => {
                  dispatch(openDelete());
                  dispatch(setDeleteItem(product._id))
                }} className="text-red-900 flex">
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
