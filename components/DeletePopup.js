import { closeDelete, selectItemIdDelete, selectOpenPopupDelete } from "@/slices/deleteSlice";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";


export default function DeletePopup({collection}) {

  const itemId = useSelector(selectItemIdDelete);
  const openPopup = useSelector(selectOpenPopupDelete);
  const [loading, setLoading] = useState({
    inProgress: false,
    done: false
  });
  const dispatch = useDispatch();
  const [currentItem, setcurrentItem] = useState([]);

  useEffect(() => {
    if (openPopup) {
      axios.get('/api/' + collection + '?id=' + itemId).then(res => {
        setcurrentItem(res.data);
      })
    }
  },[openPopup])

  async function deleteItem(id) {
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
      }, 1500) // timeout to show "item deleted" gif
    })
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
              <p>Do you whant to delete<br/> "{collection === "categories" ? currentItem?.name : currentItem?.title}"?</p>
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