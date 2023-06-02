import { closeDelete, selectItemIdDelete, selectOpenPopupDelete } from "@/slices/deleteSlice";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loaded from "./Loaded";


export default function DeletePopup({collection}) {

  const itemId = useSelector(selectItemIdDelete);
  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();
  const [currentItem, setcurrentItem] = useState([]);
  
  console.log(itemId, openPopup, currentItem);

  useEffect(() => {
    if (openPopup) {
      axios.get('/api/' + collection + '?id=' + itemId).then(res => {
        setcurrentItem(res.data);
      })
    }
  },[openPopup])

  async function deleteProduct(id) {
    await axios.delete('/api/' + collection + '?id='+id).then(() => {
      dispatch(closeDelete());
    });
  }

  return (
    <>
      <div className={classNames('popup',{
        open: openPopup
      })}>
        <div className="popup__content"> 
          {openPopup && (
            <Loaded/>
          )}
          <p>Do you whant to delete<br/> "{collection === "categories" ? currentItem?.name : currentItem?.title}"?</p>
          <div className="flex gap-4 justify-center mt-4">
            <button className="btn btn_red" onClick={() => deleteProduct(currentItem?._id)}>Yes</button>
            <button className="btn" onClick={() => dispatch(closeDelete())}>No</button>
          </div>
        </div>
      </div>
    </>
  )
}