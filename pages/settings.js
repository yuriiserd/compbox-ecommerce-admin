import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import DeleteIcon from "@/components/icons/DeleteIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { get } from "sortablejs";


export default function Settings() {
   
   const [products, setProducts] = useState([]); // for search
   const [initialProducts, setInitialProducts] = useState([]); // for display featured product
   const [product, setProduct] = useState({});
   const [initialProduct, setInitialProduct] = useState({});
   const [noItemsFound, setNoItemsFound] = useState(false);
   const [openDropdown, setOpenDropdown] = useState(false);
   const [saved, setSaved] = useState(false);
   const [coupons, setCoupons] = useState([]);
   const [coupon, setCoupon] = useState({});

   useEffect(() => {
      axios.get('/api/products?limit=10').then(res => {
         setProducts(res.data);
         setInitialProducts(res.data);
      });
      axios.get('/api/settings?name=featuredProduct').then(res => {
         if (res.data.value) {
            axios.get('/api/products?id='+res.data.value).then(res => {
               setProduct(res.data);
               setInitialProduct(res.data);
            });
         }
      });
      getCoupons()
   }, []);

   async function getCoupons() {
      await axios.get('/api/coupons').then(res => {
         setCoupons(res.data);
      });
   }

   async function saveSettings() {
      if (product._id !== initialProduct._id) {
         await axios.put('/api/settings', {name: 'featuredProduct', value: product._id}).then(res => {
            if (res.data) {
               setSaved(true);
               setTimeout(() => {
                  setSaved(false);
               }, 2000);
            }
         });
      }
      
   }
   async function addCoupon() {
      if (coupon.name && coupon.percent_off) {
         await axios.post('/api/coupons', coupon).then(res => {
            if (res.data) {
               getCoupons()
               setSaved(true);
               setTimeout(() => {
                  setSaved(false);
               }, 2000);
            }
         })
      }
   }
   function updateCoupon(field, value, type = 'string') {
      const newCoupon = {...coupon};
      if (type === 'number') {
         if (value !== '') {
            value = parseInt(value);
         }
      };
      newCoupon[field] = value;
      setCoupon(newCoupon);
   }
   function deleteCoupon(id) {
      if (id) {
         axios.delete('/api/coupons?id='+id).then(res => {
            console.log(res.data)
            getCoupons()
         })
      }
   }

   return (
      <Layout>
         <h1>Settings</h1>
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

            <div className="mb-6 w-full relative">
               <h4 className="mb-2 block">Coupons</h4>
               <div className="flex gap-4 items-center justify-between mb-4">
                  
                  <div className="flex gap-4 items-center">
                     <div className="relative w-[40%]">
                        <input className="mr-0" type="text" placeholder="Coupon Code"
                           onChange={(e) => updateCoupon('name', e.target.value)}
                           value={coupon?.name || ''}
                        />
                     </div>
                     <div className="relative w-[30%]">
                        <input className="pr-0" type="text" placeholder="Discount"
                           onChange={(e) => updateCoupon('percent_off', e.target.value, 'number')}
                           value={coupon?.percent_off || ''}
                        />
                        <span className="absolute right-[2px] top-[50%] translate-y-[-50%] bg-white px-2">%</span>
                     </div>
                     <div className="relative w-[30%]">
                        <input type="text" placeholder="Duration"
                           onChange={(e) => updateCoupon('duration_in_months', e.target.value, 'number')}
                           value={coupon?.duration_in_months || ''}
                        />
                     </div>
                  </div>
                  <button className="btn btn_white btn_small min-w-[120px]" onClick={addCoupon}>Add Coupon</button>
               </div>
               {coupons.length > 0 && (
                  <>
                     <div className="flex gap-4 border-b-2 border-r border-l border-t px-4 ">
                        <div className="relative w-[40%] border-r py-2">
                           Coupon Code
                        </div>
                        <div className="relative w-[20%] border-r py-2">
                           Discount
                        </div>
                        <div className="relative w-[20%] border-r py-2">
                           Duration in month
                        </div>
                        <div className="relative w-[10%]"></div>
                     </div>
                     {coupons.map((coupon, index) => (
                        <div className="flex gap-4 border-b border-r border-l px-4 " key={index}>
                           <div className="relative w-[40%] border-r py-2">
                              {coupon?.name || ''}
                           </div>
                           <div className="relative w-[20%] border-r py-2">
                              {coupon?.percent_off || '-'}%
                           </div>
                           <div className="relative w-[20%] border-r py-2">
                              {coupon?.duration_in_months || 'forever'}
                           </div>
                           <div className="relative w-[10%] text-right py-2">
                              <button className="btn btn_red btn_small" 
                                 onClick={() => deleteCoupon(coupon?.id)}
                              ><DeleteIcon/></button>
                           </div>
                        </div>
                     ))}
                  </>
               )}
               
            </div>

            {/* <div className="mb-6 w-full relative">
               <div className="flex gap-4 items-center justify-between">
                  <span className="mb-2 block">setting</span>
                  <button className="btn btn_white btn_small">button</button>
               </div>
            </div> */}

         </div>
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
