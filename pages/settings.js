import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import DeleteIcon from "@/components/icons/DeleteIcon";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { get } from "sortablejs";
import Spinner from "@/components/Spinner";
import Coupons from "@/components/Coupons";
import useAdminRole from "@/hooks/useAdminRole";
import { useSession } from "next-auth/react";
import { ErrorContext } from "@/components/ErrorContext";


export default function Settings() {
   
   const [products, setProducts] = useState([]); // for search
   const [initialProducts, setInitialProducts] = useState([]); // for display featured product
   const [product, setProduct] = useState({});
   const [initialProduct, setInitialProduct] = useState({});
   const [noItemsFound, setNoItemsFound] = useState(false);
   const [openDropdown, setOpenDropdown] = useState(false);
   const [saved, setSaved] = useState(false);
   const [loading, setLoading] = useState(false);

   const {data: session} = useSession();
   const {setErrorMessage, setShowError} = useContext(ErrorContext);

   useEffect(() => {
      setLoading(true);
      axios.get('/api/products?limit=10').then(res => {
         setProducts(res.data);
         setInitialProducts(res.data);
      });
      getFeatured();
   }, []);

   async function getFeatured() {
      await axios.get('/api/settings?name=featuredProduct').then(async res => {
         if (res.data.value) {
            await axios.get('/api/products?id='+res.data.value).then(res => {
               setProduct(res.data);
               setInitialProduct(res.data);
            });
         }
         setLoading(false);
      });
   }

   async function saveSettings() {

      const role = await useAdminRole(session?.user?.email);
      if (role !== 'Admin') {
         setErrorMessage('You are not authorized to save settings. Please contact an admin');
         setShowError(true);
         return;
      }
      

      if (product._id !== initialProduct._id) {
         await axios.put('/api/settings', {name: 'featuredProduct', value: product._id}).then(res => {
            if (res.data) {
               setSaved(true);
               setTimeout(() => {
                  setSaved(false);
               }, 2000);
            }
         });
         getFeatured()
      }
   }
   

   return (
      <Layout>
         <h1>Settings</h1>
         {!loading ? (
            <div className="max-w-xl settings">

               <div className="mb-6 w-full relative">
                  <h4 className="mb-2 block">Featured Product</h4>
                  {initialProducts.length > 0 && (
                     <div className="flex gap-4 items-center">
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
                  {openDropdown && !noItemsFound && (
                     <ul className="absolute z-[1001] bottom-0 left-0 right-0 h-60 overflow-y-scroll translate-y-full bg-stone-200 rounded-md px-2 pt-2">
                        {products.length > 0 && products.map(product => (
                           <li className="mb-2 cursor-pointer hover:underline flex items-center gap-2" key={product._id} onClick={() => {setProduct(product); setOpenDropdown(false)}}>
                              <Image src={product.images[0]} width={40} height={40}/>
                              <span>{product.title}</span>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>

               <Coupons setSaved={setSaved}/>

            </div>
         ) : (
            <Spinner/>
         )}
         <div className="flex">
            <button className="btn" onClick={saveSettings}>Save</button> 
            {saved && (
               <span className="ml-4 succes">Saved!</span>
            )}
         </div>

         {/* close overlay for dropdown */}
         {openDropdown && (
            <div onClick={() => setOpenDropdown(false)} className="fixed bg-transparent left-0 top-0 w-full h-full z-[1000]"></div>
         )}
      </Layout>
   )
}
