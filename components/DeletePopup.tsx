import { closeDelete, selectItemIdDelete, selectOpenPopupDelete } from "../slices/deleteSlice";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { useSession } from "next-auth/react";
import { ErrorContext } from "./ErrorContext";
import useAdminRole from "../hooks/useAdminRole";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { Order } from "../types/order";
import { Admin } from "../types/admin";


export default function DeletePopup({collection}: {collection: string}) {

  const itemId = useSelector(selectItemIdDelete);
  const openPopup = useSelector(selectOpenPopupDelete);
  const [loading, setLoading] = useState({
    inProgress: false,
    done: false
  });
  const dispatch = useDispatch();
  const [currentItem, setcurrentItem] = useState<Product | Category | Order | Admin | null>(null);

  const {data: session} = useSession();
  const {setErrorMessage, setShowError} = useContext(ErrorContext);

  useEffect(() => {
    if (openPopup) {
      axios.get('/api/' + collection + '?id=' + itemId).then(res => {
        setcurrentItem(res.data);
      })
    }
  },[openPopup])

  async function deleteItem(id: string) {

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage(`You are not authorized to delete ${collection ? collection : 'items'}. Please contact an admin`);
      setShowError(true);
      dispatch(closeDelete())
      setLoading(() => {
        return {
          inProgress: false,
          done: false
        }
      })
      return;
    }

    await axios.delete('/api/' + collection + '?id='+id).then((res) => {
      if (res.data) {
        setLoading(() => {
          return {
            inProgress: false,
            done: true
          }
        })
      }
    }).then(() => {
      setTimeout(() => {
        dispatch(closeDelete())
        setLoading(() => {
          return {
            inProgress: false,
            done: false
          }
        })
      }, 10) // timeout to show "item deleted" gif
    })
  }

  const deleteMessage = () => {
    if (collection === "categories") {
      return (currentItem as Category)?.name
    } 
    else if (collection === "orders") {
      return 'order ' + currentItem?._id
    } 
    else if (collection === "products") {
      return (currentItem as Product)?.title
    } 
    else if (collection === "admins") {
      return (currentItem as Admin)?.name
    } 
    else {
      return 'this item'
    }
  }

  return (
    <>
      <div className={classNames('popup',{
        open: openPopup
      })}>
        <div className="popup__content"> 
          {loading.inProgress && (
            <Loading inProgress/>
          )}
          {loading.done && (
            <Loading done/>
          )}
          {!loading.inProgress && !loading.done && (
            <>
              <p>Do you whant to delete<br/> {deleteMessage()}?</p>
              
              <div className="flex gap-4 justify-center mt-4">
                <button className="btn btn_red" onClick={() => {
                  deleteItem(currentItem?._id);
                  setLoading(() => {
                    return {
                      inProgress: true,
                      done: false
                    }
                  })
                }}>Yes</button>
                <button className="btn" onClick={() => {
                  dispatch(closeDelete());
                  setTimeout(() => {
                    setcurrentItem(null)
                  }, 300) // timeout to remove Item after popup close
                }}>No</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}