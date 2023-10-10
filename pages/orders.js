import Layout from "@/components/Layout";
import EditIcon from "@/components/icons/EditIcon"
import DeleteIcon from "@/components/icons/DeleteIcon"
import DeletePopup from "@/components/DeletePopup"
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "@/slices/deleteSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Orders() {

   const [orders, setOrders] = useState([])
   const openPopup = useSelector(selectOpenPopupDelete);

   const dispatch = useDispatch();

   useEffect(() => {
      axios.get('/api/orders').then(res => {
         setOrders(res.data)
      })
   }, [openPopup])



return (
   <Layout>
      <h1>Orders</h1>
      <div className="table default mt-6">
         <div className="table__head">
            <ul className="table-row">
               <li>Info</li>
               <li>Products</li>
               <li>Actions</li>
            </ul>
         </div>
         <div className="table__body">
            
            {orders.map((order) => {
               console.log(order);
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
                        <div>
                           <span>{item.quantity}</span>
                           <Link href={'/products/edit/'+item.price_data.product_data.id}> 
                              <small> x </small>{item.price_data.product_data.name}<small> - ${item.price_data.unit_amount / 100} </small>
                           </Link>
                        </div>
                     ))}</li>
                     {/* TODO edit, delete function. add new order page and edit page */}
                     <li className="flex gap-3 px-2 max-sm:gap-2 border-stone-200">
                        <button title="edit" onClick={() => {}} className="text-stone-700">
                        <EditIcon/>
                        </button>
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
