import Layout from "@/components/Layout";
import EditIcon from "@/components/icons/EditIcon"
import DeleteIcon from "@/components/icons/DeleteIcon"
import DeletePopup from "@/components/DeletePopup"
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "@/slices/deleteSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/Spinner";

export default function Orders() {

   const [orders, setOrders] = useState([]);
   const [noItemsFound, setNoItemsFound] = useState(false)
   const openPopup = useSelector(selectOpenPopupDelete);


   const dispatch = useDispatch();

   useEffect(() => {
      axios.get('/api/orders').then(res => {
         setOrders(res.data);
         if (res.data.length === 0) {
            setNoItemsFound(true)
         } else {
            setNoItemsFound(false)
         }
      })
   }, [openPopup, noItemsFound])



return (
   <Layout>
      <h1>Orders</h1>
      <Link className="btn min-w-fit" href={'/orders/new'}>Add new order</Link>
      <div className="table default mt-6">
         <div className="table__head">
            <ul className="table-row">
               <li>Info</li>
               <li>Products</li>
               <li>Actions</li>
            </ul>
         </div>
         <div className="table__body">

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
            
            {orders.map((order) => {
               const time = new Date(order.createdAt).toLocaleString();
               let totalPrice = 0;
               order.product_items.forEach(item => {
                  totalPrice += item.price_data.unit_amount * item.quantity / 100;
               })
               return (
                  <ul key={order._id} className="table-row">
                     <li>
                        <span>{time}</span><br/>
                        <strong>$ {totalPrice}</strong><br/>
                        {order.name}<br/>
                        {order.email}<br/>
                        {order.country}, {order.city}, {order.address}, {order.zip}<br/>
                     </li>
                     <li>{order.product_items.map(item => (
                        <div key={item.price_data.product_data.id}>
                           <span>{item.quantity}</span>
                           <small> x </small>
                           <Link className="text-blue-700 hover:underline" href={'/products/edit/'+item.price_data.product_data.id}> 
                              {item.price_data.product_data.name}
                           </Link>
                           <small> - ${item.price_data.unit_amount / 100} </small>
                        </div>
                     ))}</li>
                     {/* TODO edit, delete function. add new order page and edit page */}
                     <li className="flex gap-3 px-2 max-sm:gap-2 border-stone-200 items-center">
                        <Link className="text-stone-700" href={`/orders/edit/${order._id}`}>
                           <EditIcon/>
                        </Link>
                        <button title="delete" onClick={() => {
                           dispatch(openDelete());
                           dispatch(setDeleteItem(order._id))
                        }} className="text-stone-700">
                        <DeleteIcon/>
                        </button>
                     </li>
                  </ul>
               )
            })}
         </div>
      </div>
      <DeletePopup collection={'orders'}/>
   </Layout>
)
   
}
