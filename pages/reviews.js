import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import DeleteIcon from "@/components/icons/DeleteIcon";
import StarIcon from "@/components/icons/StarIcon";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ReviewsPage() {

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const statuses = useMemo(() => {
    return [
      "pending",
      "approved",
    ]
  }, [])
  
  useEffect(() => {
    getReviews()
  }, [])

  async function getReviews() {
    setLoading(true);
    await axios.get("/api/reviews")
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  }

  async function updateStatus(id, status) {
    try {
      await axios.put(`/api/reviews/`, {
        id: id,
        status
      }).then(res => {
        getReviews()
      })
    } catch (err) {
      console.log(err);
    }
  } 
  async function deleteReview(id) {
    console.log(id);
    try {
      await axios.delete(`/api/reviews?id=${id}`)
        .then(res => {
          getReviews()
        })
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <h1>Reviews</h1>
      <div className="table default mt-6 max-w-[1100px]">
          <div className="table__head">
            <ul className="table-row">
              <li className="max-w-[150px]">Name</li>
              <li className="max-w-[450px]">Comment</li>
              <li className="max-w-[200px]">Status</li>
            </ul>
          </div>
          <div className="table__body">
            {!loading ? (
              <>
                {reviews.map((review, i) => (
                  <ul key={review._id} className="table-row">
                    <li className="max-w-[150px]">{review.userName}</li>
                    <li className="max-w-[450px]">
                      <Link href={"/products/edit/" + review.productId._id} className="flex items-start gap-4 ">
                        <Image src={review.productId.images[0]} width={40} height={40} alt={review.productId.title}/>
                        <div>
                          <h3>{review.productId.title}</h3>
                          <div className="max-w-[90px] flex">
                            {Array(5).fill(0).map((_, i) => (
                              <StarIcon key={i} fill={review.rating > i ? "#ffc107" : "none"}/>
                            ))}
                          </div>
                          {review.comment}
                        </div>
                        
                      </Link>
                      
                    </li>
                    <li style={{zIndex: 10000 - i}} className="max-w-[200px] relative flex gap-2 items-center">
                      
                      <div className={"relative"}>
                        <Dropdown
                          items={statuses}
                          initialItem={review.status}
                          selectedItem={async (status) => updateStatus(review._id, status)}
                          editable={false}
                        />
                      </div>
                      <div className={`w-1 h-9 ${review.status === 'pending' ? "bg-orange-400" : "bg-green-500"}`}></div>

                      <button  onClick={() => deleteReview(review._id)}>
                        <DeleteIcon/>
                      </button>
                    </li>
                  </ul>
                ))}
              </>
            ) : (
              <Spinner/> 
            )}
          </div>
        </div>
    </Layout>
  )
}