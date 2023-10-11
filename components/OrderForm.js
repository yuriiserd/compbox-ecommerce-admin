import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Dropdown from "./Dropdown";
import Link from "next/link";


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
  
  const [goToOrders, setGoToOrders] = useState(false);

  const router = useRouter();

  async function saveOrder(e) {
    e.preventDefault();
    const data = {address, city, country, email, name, products_items: products, zip};
    if (_id) {
      await axios.put('/api/orders', {...data, _id}).then((res) => {
        console.log(res)
      });
    } else {
      await axios.post('/api/orders', data).then((res) => {
        console.log(res)
      });
    }
    // setGoToOrders(true);
  }

  if(goToOrders) {
    router.push('/orders');
  }

  console.log(products);

  return (
    <>
      <form className="form" onSubmit={(e) => saveOrder(e)}>
        
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
          

          <button type="submit" className="btn ">{_id ? 'Save' : 'Add Order'}</button>
        </div>
        <div className="products">
          <h3 className="text-xl mb-4">Products</h3>
          <div className="flex flex-wrap gap-2">
            {products.map((product => {
              return (
                <Link href={'/products/edit/'+product.price_data.product_data.id} key={product.price_data.product_data.id}>
                  {product.price_data.product_data.name}
                </Link>
              )
            }))}
            <br/>
          </div>
          <div className="flex flex-wrap gap-2">
            list of site products
          </div>
        </div>
      </form>
    </>
  )
}