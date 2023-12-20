import Dropdown from "@/components/Dropdown";
import InfoChart from "@/components/InfoChart";
import Layout from "@/components/Layout";
import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { useState } from "react";
// import { google } from 'googleapis';



export default function Home({orders, customers}) {


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
      const key = `${month}/${day}/${year}`;
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
         <div className="relative max-w-[300px] mb-6">
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
         {chartInfo === "Orders" && (
            <div style={{ height: '300px' }}>
               <h3 className="text-2xl mb-4">Orders</h3>
               <InfoChart id="chartCanvasCount" data={ordersCount} color="#33c863" bg="rgba(51, 200, 99, .1)" label={"Orders"} step={1}/>
            </div>
         )}
         {chartInfo === "Income" && (
            <div style={{ height: '300px' }}>
               <h3 className="text-2xl font-semibold mb-4">Income</h3>
               <InfoChart id="chartCanvasTotal" data={ordersTotal} color="#f2994a" bg="rgba(242, 153, 74, .1)" label="Income"/>
            </div>
         )}
         {chartInfo === "Customers" && (
            <div style={{ height: '300px' }}>
               <h3 className="text-2xl font-semibold mb-4">Customers</h3>
               <InfoChart id="chartCanvasTotal" data={customersCount} color="#007BFF" bg="rgba(0, 123, 255, .1)" label="Customers" step={1}/>
            </div>
         )}

         
      </Layout>
   )
}

export async function getServerSideProps() {

   await mongooseConnect();
   
   // async function getAnalyticsData() {
   //    const jwt = new google.auth.JWT(
   //      process.env.GOOGLE_CLIENT_EMAIL,
   //      null,
   //      process.env.GOOGLE_PRIVATE_KEY,
   //      ['https://www.googleapis.com/auth/analytics.readonly'],
   //      null
   //    );
    
   //    await jwt.authorize();
    
   //    const response = await google.analytics('v3').data.ga.get({
   //      auth: jwt,
   //      ids: 'ga:' + process.env.VIEW_ID,
   //      'start-date': '30daysAgo',
   //      'end-date': 'today',
   //      metrics: 'ga:sessions,ga:users',
   //    });
   //    console.log(response.data, "response.data")
    
   //    return response.data;
   //  }
   // //  console.log(process.env.VIEW_ID, process.env.GOOGLE_CLIENT_EMAIL, process.env.GOOGLE_PRIVATE_KEY)
   //  // Use this function wherever you need to fetch Google Analytics data
   // getAnalyticsData().then(data => console.log(data));

   const orders = await Order.find({}).sort({ createdAt: -1 });
   const customers = await Customer.find({}).sort({ createdAt: -1 });

   return {
      props: {
         orders: JSON.parse(JSON.stringify(orders)),
         customers: JSON.parse(JSON.stringify(customers)),
      }
   }
} 
