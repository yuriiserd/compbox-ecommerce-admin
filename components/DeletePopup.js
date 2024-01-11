import { closeDelete, selectItemIdDelete, selectOpenPopupDelete } from "@/slices/deleteSlice";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { useSession } from "next-auth/react";
import { ErrorContext } from "./ErrorContext";
import useAdminRole from "@/hooks/useAdminRole";


export default function DeletePopup({collection}) {

  const itemId = useSelector(selectItemIdDelete);
  const openPopup = useSelector(selectOpenPopupDelete);
  const [loading, setLoading] = useState({
    inProgress: false,
    done: false
  });
  const dispatch = useDispatch();
  const [currentItem, setcurrentItem] = useState([]);

  const {data: session} = useSession();
  const {setErrorMessage, setShowError} = useContext(ErrorContext);

  useEffect(() => {
    if (openPopup) {
      axios.get('/api/' + collection + '?id=' + itemId).then(res => {
        setcurrentItem(res.data);
      })
    }
  },[openPopup])

  async function deleteItem(id) {

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
      return currentItem?.name
    } else if (collection === "orders") {
      return 'this order'
    } else if (collection === "products") {
      return currentItem?.title
    } else {
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
                    setcurrentItem([])
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