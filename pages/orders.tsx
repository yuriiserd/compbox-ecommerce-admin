import Layout from "../components/Layout";
import EditIcon from "../components/icons/EditIcon"
import DeleteIcon from "../components/icons/DeleteIcon"
import DeletePopup from "../components/DeletePopup"
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "../slices/deleteSlice";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { statusColor } from "../lib/statusColor";
import ReloadIcon from "../components/icons/ReloadIcon";
import Dropdown from "../components/Dropdown";

export default function Orders() {

   const [orders, setOrders] = useState([]);
   const [noItemsFound, setNoItemsFound] = useState(false)
   const openPopup = useSelector(selectOpenPopupDelete);
   const [loading, setLoading] = useState(false);
   const [filters, setFilters] = useState({paid: "All", status: "All"}); //filters for orders

   const dispatch = useDispatch();
   const spinRef = useRef(null);

   useEffect(() => {
      if (!openPopup) {
         getOrders()
      }
   }, [openPopup, noItemsFound, filters])

   async function getOrders() {
      setLoading(true);
      if (filters.paid !== "All" || filters.status !== "All") {
         await axios.post('/api/orders', {filters: filters}).then(res => {
            setOrders(res.data);
            if (res.data.length === 0) {
               setNoItemsFound(true)
            } else {
               setNoItemsFound(false)
            }
            setLoading(false);
         })
      } else {
         await axios.get('/api/orders').then(res => {
            setOrders(res.data);
            if (res.data.length === 0) {
               setNoItemsFound(true)
            } else {
               setNoItemsFound(false)
            }
            setLoading(false);
         })
      }
   }
function spin() {
   const reload = spinRef.current
   reload.classList.add('spin')
   setTimeout(() => {
      reload.classList.remove('spin')
   }, 1000);
}
return (
   <Layout>
      
      <div className="flex items-center gap-4 justify-between max-w-[1100px]"> 
      <h1>Orders</h1>
         <button className="mb-2 p-2 opacity-60 outline-none" ref={spinRef} onClick={() => {
            getOrders()
            spin()
         }}>
            <ReloadIcon/>
         </button>
      </div>
      <Link className="btn min-w-fit" href={'/orders/new'}>Add new order</Link>
      <div className="flex gap-4 mt-6">
         
         <div className="relative">
            <label htmlFor="paid">Paid</label>
            <Dropdown
               initialItem={{name: filters.paid}}
               items={[
                  {name: 'All'},
                  {name: 'Paid'},
                  {name: 'Not paid'},
               ]}
               selectedItem={(item) => {
                  setFilters({...filters, paid: item.name})
               }}  
               editable={false}
            />
         </div>
         <div className="relative">
            <label htmlFor="paid">Status</label>
            <Dropdown
               initialItem={{name: filters.status}}
               items={[
                  {name: 'All'},
                  ...Object.keys(statusColor).map(item => ({name: item}))
               ]}
               selectedItem={(item) => {
                  setFilters({...filters, status: item.name})
               }}
               editable={false}
            />
         </div>
      </div>
      <div className="table default mt-6 max-w-[1100px]">
         <div className="table__head">
            <ul className="table-row">
               <li>Info</li>
               <li>Products</li>
               <li className="max-w-[100px]">Actions</li>
            </ul>
         </div>
         <div className="table__body">
            {!loading ? (
               <>
                  {!orders.length && !noItemsFound && (
                     <ul>
                        <li><Spinner/></li>
                     </ul>
                  )}
                  {noItemsFound && (
                     <ul>
                        <li className="text-center p-4 w-full">No orders found</li>
                     </ul>
                  )}
                  {orders.length > 0 && orders.map((order) => {
                     const time = new Date(order.createdAt).toLocaleString();
                     let totalPrice = 0;
                     order.product_items.forEach(item => {
                        totalPrice += item.price_data.unit_amount * item.quantity / 100;
                     })
                     return (
                        <ul key={order._id} className="table-row">
                           <li>
                              <span className={`${order.paid ? 'bg-green-500': 'bg-red-500'} px-2 mr-2 mb-1 inline-block rounded-md text-white`}>
                                 {order.paid ? 'Paid' : 'Not Paid'} 
                              </span>
                              <span 
                                 className={` px-2 mr-2 mb-1 inline-block rounded-md`} 
                                 style={{backgroundColor: statusColor[order.status]?.bg, color: statusColor[order.status]?.text}}
                              >
                                 {order.status} 
                              </span>
                              <span>{time}</span><br/>
                              {order.coupon && (
                                 <>
                                    <span>Coupon: {order.coupon.name} - {order.coupon.percent_off}%</span><br/>
                                 </>
                              )}
                              
                              {order.coupon ? (
                                 <>
                                    ${totalPrice}<span> - {order.coupon.percent_off}% = <strong>{
                                       totalPrice - totalPrice * order.coupon.percent_off / 100
                                       }</strong></span>
                                 </>
                              ) : (
                                 <strong>$ {totalPrice}</strong>
                              )}
                              <br/>

                              {order.name}<br/>
                              {order.email}<br/>
                              {order.country}, {order.city}, {order.address}, {order.zip}<br/>
                           </li>
                           <li>{order.product_items.map(item => (
                              <div key={item.price_data.product_data.id}>
                                 <span>{item.quantity}</span>
                                 <small> x </small>
                                 <Link className="text-[#007f80] hover:underline" href={'/products/edit/'+item.price_data.product_data.id}> 
                                    {item.price_data.product_data.name}
                                 </Link>
                                 <small> - ${item.price_data.unit_amount / 100} </small>
                              </div>
                           ))}</li>
                           
                           <li className="flex gap-3 px-2 max-w-[100px] max-sm:gap-2 border-stone-200 items-center">
                              <Link className="text-stone-700" href={`/orders/edit/${order._id}`}>
                                 <EditIcon/>
                              </Link>
                              <button title="delete" onClick={() => {
                                 dispatch(openDelete());
                                 dispatch(setDeleteItem(order._id))
                              }} className="text-red-900">
                                 <DeleteIcon/>
                              </button>
                           </li>
                        </ul>
                     )
                  })}
               </>
            ) : (
               <ul>
                  <li><Spinner/></li>
               </ul>
            )}
            

            
            
            
         </div>
      </div>
      <DeletePopup collection={'orders'}/>
   </Layout>
)
   
}
