import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import DeleteIcon from "@/components/icons/DeleteIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function Settings() {
   
   const [products, setProducts] = useState([]);
   const [product, setProduct] = useState({name: ' '});
   const [noItemsFound, setNoItemsFound] = useState(false);
   const [openDropdown, setOpenDropdown] = useState(false);
   const [saved, setSaved] = useState(false);

   useEffect(() => {
      axios.get('/api/products?limit=10').then(res => {
         setProducts(res.data);
      });
      axios.get('/api/settings?name=featuredProduct').then(res => {
         if (res.data.value) {
            axios.get('/api/products?id='+res.data.value).then(res => {
               setProduct(res.data);
            });
         }
      });
   }, []);

   async function saveSettings() {
      await axios.put('/api/settings', {name: 'featuredProduct', value: product._id}).then(res => {
         if (res.data) {
            setSaved(true);
            setTimeout(() => {
               setSaved(false);
            }, 2000);
         }
      });
   }

   return (
      <Layout>
         <h1>Settings</h1>
         <div className="max-w-xl">
            <div className="mb-4 w-full relative">
               <span className="mb-2 block">Featured Product</span>
               {products.length > 0 && (
                  <div className="flex gap-4">
                     <div className="w-1/2" onClick={() => {setOpenDropdown(true)}}>
                        <Search setProducts={setProducts} setNoItemsFound={setNoItemsFound}/>
                     </div>
                     <div className="w-1/2">
                        {product.title && (
                           <div className="flex gap-4 items-center">
                              <span>{product.title}</span>
                              <button className="btn btn_red btn_small" onClick={() => {setProduct({})}}><DeleteIcon/></button>
                           </div>
                        )}
                     </div>
                  </div>
               )}
               
               {openDropdown && (
                  <ul className="absolute z-50 bottom-0 left-0 right-0 h-60 overflow-y-scroll translate-y-full bg-stone-200 rounded-md px-2 pt-2">
                     {products.length > 0 && products.map(product => (
                        <li className="mb-2 cursor-pointer hover:underline flex items-center gap-2" key={product._id} onClick={() => {setProduct(product); setOpenDropdown(false)}}>
                           <Image src={product.images[0]} width={40} height={40}/>
                           <span>{product.title}</span>
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </div>
         <button className="btn" onClick={saveSettings}>Save</button> 
         {saved && (
            <span className="ml-4">Saved!</span>
         )}
      </Layout>
   )
}
