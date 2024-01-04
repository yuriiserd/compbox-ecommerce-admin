import Dropdown from "@/components/Dropdown";
import InfoChart from "@/components/InfoChart";
import Layout from "@/components/Layout";
import OrdersSummaryCard from "@/components/OrdersSummaryCard";
import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import uk from 'date-fns/locale/uk';

// registerLocale('uk', uk);

export default function Home() {

   const firstDayOfMonth = useMemo(() => {
      const date = new Date();
      return new Date(date.getFullYear(), date.getMonth(), 1);
   }, []);

   const [orders, setOrders] = useState([]);
   const [ordersByPeriod, setOrdersByPeriod] = useState({
      today: [],
      week: [],
      month: [],
   });
   const [customers, setCustomers] = useState([]);

   const [fromDate, setFromDate] = useState(firstDayOfMonth);
   const [toDate, setToDate] = useState(new Date());

   useEffect(() => {
      getOrders();
      getCustomers();
   }, [fromDate, toDate]);

   useEffect(() => {
      getOrdersByPeriod();
   }, []);

   async function getOrders() {
      await axios.post("/api/orders", {period: [fromDate, toDate]}).then(res => {
         setOrders(res.data);
      }).catch(err => console.log(err));
   }
   async function getOrdersByPeriod() {
      const today = new Date();
      const week = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      const month = new Date(today.getFullYear(), today.getMonth(), 1);
      const orders = await axios.post("/api/orders", {period: [month, today]}).then(res => res.data);
      const ordersByPeriod = {
         today: [],
         week: [],
         month: [],
      };
      orders.forEach(order => {
         const date = new Date(order.createdAt);
         if (date.getTime() >= today.setHours(0, 0, 0, 0)) {
            ordersByPeriod.today.push(order);
         }
         if (date.getTime() >= week.getTime()) {
            ordersByPeriod.week.push(order);
         }
         if (date.getTime() >= month.getTime()) {
            ordersByPeriod.month.push(order);
         }
      });
      setOrdersByPeriod(ordersByPeriod);
   }

   async function getCustomers() {
      await axios.post("/api/customers", {period: [fromDate, toDate]}).then(res => {
         setCustomers(res.data);
      }
      ).catch(err => console.log(err));
   }
   
   
   const [chartInfo, setChartInfo] = useState("Orders");

   const ordersCount = {};
   const ordersTotal = {};
   const sordedOrders = orders.sort((order1, order2) => (
      new Date(order1.createdAt).getTime() - new Date(order2.createdAt).getTime()
   ));
   sordedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const day = date.getDate();
      const key = `${month + 1}/${day}/${year}`;
      if (calcOrderTotal(order) === 0) return;
      if (ordersCount[key]) {
         ordersCount[key] += 1;
      } else {
         ordersCount[key] = 1;
      }
      if (ordersTotal[key]) {
         ordersTotal[key] = parseFloat(ordersTotal[key]) + calcOrderTotal(order) + '';
      } else {
         ordersTotal[key] = calcOrderTotal(order) + '';
      }
   });
   function calcOrderTotal(order) {
      let total = 0;
      order.product_items.forEach(item => {
         if (order.paid) {
            if (order.coupon) {
               const priceData = item.price_data.unit_amount / 100 * item.quantity
               total += priceData - priceData * order.coupon.percent_off / 100;
            } else {
               total += item.price_data.unit_amount / 100 * item.quantity;
            }
         }
         
      });
      return total;
   }

   const customersCount = {};
   const sordedCustomers = customers.sort((customer1, customer2) => (
      new Date(customer1.createdAt).getTime() - new Date(customer2.createdAt).getTime()
   ));
   sordedCustomers.forEach(customer => {
      const date = new Date(customer.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const day = date.getDate();
      const key = `${month}/${day}/${year}`;
      if (customersCount[key]) {
         customersCount[key] += 1;
      } else {
         customersCount[key] = 1;
      }
   });



   


   
   return (
      <Layout>
         <div className="max-w-[1100px]">
            <div className="flex gap-4 mb-6 flex-wrap md:flex-nowrap flex-col md:flex-row items-center">
               <div className="relative max-w-[300px]">
                  <Dropdown 
                     items={[
                        "Orders",
                        "Income",
                        "Customers"
                     ]}
                     initialItem={chartInfo}
                     selectedItem={setChartInfo}
                  />
               </div>
               <div className="flex gap-2 items-center max-w-[300px] flex-col md:flex-row">
                  from
                  <ReactDatePicker
                     selected={fromDate}
                     onChange={(date) => {
                        setFromDate(date);
                     }}
                     dateFormat="MM.dd.yyyy"
                     className="w-full mb-0"
                     // locale="uk"
                  />
               </div>
               <div className="flex gap-2 items-center max-w-[300px] flex-col md:flex-row ">
                  to
                  <ReactDatePicker
                     selected={toDate}
                     onChange={(date) => {
                        setToDate(date);
                     }}
                     dateFormat="MM.dd.yyyy"
                     className="w-full mb-0"
                     // locale="uk"
                  />
               </div>
            </div>
            {chartInfo === "Orders" && (
               <div style={{ height: '300px' }}>
                  <h3 className="text-2xl mb-4">Orders</h3>
                  <InfoChart 
                     id="chartCanvasCount" 
                     key={"orders" + orders.length} 
                     data={ordersCount} 
                     color="#33c863" 
                     bg="rgba(51, 200, 99, .1)" 
                     label={"Orders"} 
                     step={1}
                  />
               </div>
            )}
            {chartInfo === "Income" && (
               <div style={{ height: '300px' }}>
                  <h3 className="text-2xl mb-4">Income</h3>
                  <InfoChart id="chartCanvasTotal" 
                     key={"income" + orders.length} 
                     data={ordersTotal} 
                     color="#f2994a" 
                     bg="rgba(242, 153, 74, .1)" 
                     label="Income"
                  />
               </div>
            )}
            {chartInfo === "Customers" && (
               <div style={{ height: '300px' }}>
                  <h3 className="text-2xl mb-4">Customers</h3>
                  <InfoChart 
                     id="chartCanvasTotal" 
                     key={"customers" + customers.length} 
                     data={customersCount} 
                     color="#007BFF" 
                     bg="rgba(0, 123, 255, .1)" 
                     label="Customers" 
                     step={1}
                  />
               </div>
            )}

            <div className="mt-20">
               <h3 className="text-2xl mb-4">Orders Summary</h3>
               <div className="flex justify-center md:justify-between gap-2 flex-wrap md:flex-nowrap">
                  <OrdersSummaryCard orders={ordersByPeriod.today} period="Today" />
                  <OrdersSummaryCard orders={ordersByPeriod.week} period="This Week" />
                  <OrdersSummaryCard orders={ordersByPeriod.month} period="This Month" />
               </div>
            </div>
         </div>

         
      </Layout>
   )
}

// export async function getServerSideProps() {

//    await mongooseConnect();
   
//    const orders = await Order.find({ createdAt: { $gte: firstDayOfMonth } }).sort({ createdAt: -1 });
//    const customers = await Customer.find({ createdAt: { $gte: firstDayOfMonth } }).sort({ createdAt: -1 });

//    return {
//       props: {
//          orders: JSON.parse(JSON.stringify(orders)),
//          customers: JSON.parse(JSON.stringify(customers)),
//       }
//    }
// } 
