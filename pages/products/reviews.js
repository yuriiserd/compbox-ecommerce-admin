import Dropdown from "@/components/Dropdown";
import { ErrorContext } from "@/components/ErrorContext";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import DeleteIcon from "@/components/icons/DeleteIcon";
import ReloadIcon from "@/components/icons/ReloadIcon";
import StarIcon from "@/components/icons/StarIcon";
import useAdminRole from "@/hooks/useAdminRole";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

export default function ReviewsPage() {

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("status");
  const [noItemsFound, setNoItemsFound] = useState(false);
  const {data: session} = useSession();

  const {setErrorMessage, setShowError} = useContext(ErrorContext);

  const spinRef = useRef(null);

  const statuses = useMemo(() => {
    return [
      "pending",
      "approved",
    ]
  }, [])
  
  useEffect(() => {
    getReviews()
  }, [])

  useEffect(() => {
    filterByStatus(status)
  }, [status])

  async function getReviews() {
    setLoading(true);
    await axios.get("/api/reviews?status=" + status)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
        if (res.data.length === 0) {
          setNoItemsFound(true)
        } else {
          setNoItemsFound(false)
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  }
  async function updateStatus(id, status) {

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to update reviews. Please contact an admin');
      setShowError(true);
      return;
    }

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
    
    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to delete reviews. Please contact an admin');
      setShowError(true);
      return;
    }

    try {
      await axios.delete(`/api/reviews?id=${id}`)
        .then(res => {
          getReviews()
        })
    } catch (err) {
      console.log(err);
    }
  }
  function spin() {
    const reload = spinRef.current
    reload.classList.add('spin')
    setTimeout(() => {
       reload.classList.remove('spin')
    }, 500);
  }
  function filterByStatus(status) {
    if (status === "status") {
      getReviews()
    } else {
      setLoading(true);
      axios.get(`/api/reviews?status=${status}`)
        .then(res => {
          setReviews(res.data);
          setLoading(false);
          if (res.data.length === 0) {
            setNoItemsFound(true)
          } else {
            setNoItemsFound(false)
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        })
    }
  }
  return (
    <Layout>
      <div className="flex items-center gap-4 justify-between max-w-[1100px]"> 
        <h1>Reviews</h1>
        
        <button className="mb-2 p-2 opacity-60 outline-none" ref={spinRef} onClick={() => {
          getReviews()
          spin()
        }}>
          <ReloadIcon/>
        </button>
      </div>
      <div className="max-w-[200px] relative">
        <Dropdown
          items={statuses}
          initialItem={status}
          selectedItem={async (status) => setStatus(status)}
          editable={false}
        />
      </div>
      <div className="table default mt-6 max-w-[1100px]">
          <div className="table__head">
            <ul className="table-row">
              <li className="max-w-[150px]">Name</li>
              <li className="max-w-[450px]">Comment</li>
              <li className="max-w-[200px]">Status</li>
            </ul>
          </div>
          <div className="table__body">
            {noItemsFound && (
              <ul>
                <li className="text-center p-4 w-full">No reviews found</li>
              </ul>
            )}
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