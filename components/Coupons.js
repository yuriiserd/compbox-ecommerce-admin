import axios from "axios";
import { useEffect, useState } from "react";
import DeleteIcon from "./icons/DeleteIcon";
import Spinner from "./Spinner";

export default function Coupons({setSaved}) {

  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCoupons()
  }, []);

  async function getCoupons() {
    setLoading(true);
    await axios.get('/api/coupons').then(res => {
      setCoupons(res.data);
      setLoading(false);
    });
  }
  // add coupon to sripe 
  async function addCoupon() {
    if (coupon.name && coupon.percent_off) {
      await axios.post('/api/coupons', coupon).then(res => {
          if (res.data) {
            getCoupons();
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
            }, 2000);
          }
      })
    }
  }
  // update coupon in state
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
      {!loading ? (
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
      ) : (
        <Spinner/>
      )}
    </div>
  )
}