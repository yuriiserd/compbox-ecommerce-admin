import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Dropdown from "./Dropdown";
import Link from "next/link";
import DeleteIcon from "./icons/DeleteIcon";
import CopyIcon from "./icons/CopyIcon";
import CheckIcon from "./icons/CheckIcon";
import Loading from "./Loading";


export default function OrderForm({
  _id,
  address: existingAddress,
  city: existingCity, 
  country: existingCountry, 
  email: existingEmail, 
  name: existingName, 
  product_items: existingProducts, 
  zip: existingZip
}) {

  const [address, setAddress] = useState(existingAddress || '');
  const [city, setCity] = useState(existingCity || '');
  const [country, setCountry] = useState(existingCountry || '');
  const [email, setEmail] = useState(existingEmail || '');
  const [name, setName] = useState(existingName || '');
  const [products, setProducts] = useState(existingProducts || []);
  const [zip, setZip] = useState(existingZip || '');

  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [goToOrders, setGoToOrders] = useState(false);
  const [copied, setCopied] = useState(false);
  const [productsIds, setProductsIds] = useState({});
  const [requestInProgress, setRequestInProgress] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (paymentUrl.length > 0) {
      navigator.clipboard.writeText(paymentUrl);
      setCopied(true)
    }
  },[paymentUrl])

  useEffect(() => {
    updateTotalPrice();
    updateProductsIds();
    setCopied(false);
  }, [products])
  

  async function saveOrder(e) {
    e.preventDefault();
    const data = {address, city, country, email, name, product_items: products, zip};
    
    if (_id) {
      await axios.put('/api/orders', {...data, _id});
    } else {
      await axios.post('/api/orders', data);
    }
    setGoToOrders(true);
  }

  if(goToOrders) {
    router.push('/orders');
  }

  function updateTotalPrice() {
    setTotalPrice(0)
    products.forEach(product => {
      setTotalPrice(price => price + (product.quantity * product.price_data.unit_amount / 100))
    })
  }
  function updateProductsIds() {
    setProductsIds({});
    products.forEach(product => {
      const productId = product.price_data.product_data.id;
      setProductsIds(ids => {
        return {
          ...ids, 
          [productId]: product.quantity
        }
      })
    })
  }

  //quantity functions
  function decreaseQuantity(currentProduct) {
    if (currentProduct.quantity === 1) return;
    setProducts(products => {
      return products.map(product => {
        if (product.price_data.product_data.id === currentProduct.price_data.product_data.id ) {
          if (product.quantity !== 1) {
            return {...product, quantity: parseInt(product.quantity) - 1}
          }
        } else {
          return product
        }
      })
    })
  }
  function increaseQuantity(currentProduct) {
    setProducts(products => {
      return products.map(product => {
        if (product.price_data.product_data.id === currentProduct.price_data.product_data.id ) {
          return {...product, quantity: parseInt(product.quantity) + 1}
        } else {
          return product
        }
      })
    })
  }
  function changeQuantity(currentProduct, newQuantity) {
    
    if (newQuantity.length === 0) {
      newQuantity = 1;
    }
    
    newQuantity = parseInt(newQuantity);

    setProducts(products => {
      return products.map(product => {
        if (product.price_data.product_data.id === currentProduct.price_data.product_data.id ) {
          return {...product, quantity: newQuantity}
        } else {
          return product
        }
      })
    })
  }
  //quantity functions - END

  function deleteProduct(id) {
    setProducts(products => {
      return products.filter(product => product.price_data.product_data.id !== id)
    })
  }

  async function getPaymentUrl() {
    setRequestInProgress(true)
    const data = {
      _id,
      address,
      city,
      country,
      email,
      name,
      products: productsIds,
      zip
    }
    await axios.post('/api/checkout', data).then(response => {
      if (response.data.url) {
        setPaymentUrl(response.data.url);
      }
    });
    setRequestInProgress(false)
  }

  return (
    <>
      <div className="form">
        
        <div>
          <h3 className="text-xl mb-4">Customer details</h3>
          <label>Name</label>
          <input 
            type="text" 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Country</label>
          <input 
            type="text" 
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <label>City</label>
          <input 
            type="text" 
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label>Address</label>
          <input 
            type="text" 
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label>Zip</label>
          <input 
            type="text" 
            placeholder="Zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          

          <button type="submit" onClick={(e) => saveOrder(e)} className="btn ">{_id ? 'Save' : 'Add Order'}</button>
        </div>
        <div className="products">
          {/* TODO Stripe payment link */}
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl">Products</h3>
            {!!products.length && (
              <button className="btn btn_white flex gap-2" onClick={() => {
              getPaymentUrl();
              }}>
                Stripe Url
                {copied && (
                  <CheckIcon/>
                )}
                
                {!copied && (
                  <CopyIcon/>
                )}
              </button>
            )}
            {requestInProgress && (
              <div className="w-14 h-14 -m-2">
                <Loading inProgress/>
              </div>
            )}
            
            <h3 className="text-xl">Total:</h3>
            <span>${totalPrice}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {products.map((product => {
              return (
                <div key={product.price_data.product_data.id} className="flex mb-2 mr-2 items-center gap-2">
                  <div>
                    <span className="inline-flex items-center mr-2 gap-2">
                      <div className="flex gap-1 border rounded-3xl">
                        <button onClick={() => decreaseQuantity(product)} className="pr-1 pl-2">-</button>
                        <input 
                          className="border-none mb-0 mr-0 w-10 py-1 px-0 text-center" 
                          type="text" 
                          onChange={(event) => {
                            changeQuantity(product, event.target.value)
                          }} 
                          value={product.quantity}/>
                        <button onClick={() => increaseQuantity(product)} className="pl-1 pr-2">+</button>
                      </div>
                       x 
                    </span>
                    <Link className="text-blue-700 hover:underline" href={'/products/edit/'+product.price_data.product_data.id}>
                      {product.price_data.product_data.name}
                    </Link>
                    <small> - ${product.price_data.unit_amount / 100}</small>
                  </div>
                  <button onClick={() => deleteProduct(product.price_data.product_data.id)} className="text-red-900 cursor-pointer">
                    <DeleteIcon/>
                  </button>
                </div>
              )
            }))}
          </div>

          <hr/>
          <br/>

          <div className="flex flex-wrap gap-2">
            TODO select list of site products. <br/>
            Ability to add more products to order
          </div>
        </div>
      </div>
    </>
  )
}