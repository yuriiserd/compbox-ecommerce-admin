import AdminForm from "../components/AdminFrom";
import DeletePopup from "../components/DeletePopup";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import DeleteIcon from "../components/icons/DeleteIcon";
import EditIcon from "../components/icons/EditIcon";
import { openDelete, selectOpenPopupDelete, setDeleteItem } from "../slices/deleteSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function Admins() {

   const [loading, setLoading] = useState(false);
   const [admins, setAdmins] = useState([]);
   const [adminId, setAdminId] = useState(null);
   const [showForm, setShowForm] = useState(false);
   const [error, setError] = useState(null);

   const openPopup = useSelector(selectOpenPopupDelete);

   const dispatch = useDispatch();

   useEffect(() => {
      if (!showForm) {
         getAdmins();
         setAdminId(null);
      }
   }, [showForm, openPopup])

   async function getAdmins() {
      
      setLoading(true);
      const res = await axios.get('/api/admins');
      if (res.data.length > 0) {
         setLoading(false);
         setError(null);
      } else {
         setLoading(false);
         setError('No admins found');
      }
      setAdmins(res.data);
   }


   return (
      <Layout>
         <h1>Admins</h1>
         {showForm ? <AdminForm adminId={adminId} setShowForm={setShowForm}/> : (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add Admin</button>
         )}
         <div className="table default mt-6 max-w-[1100px]">
            <div className="table__head">
               <ul className="table-row">
               <li className="max-w-[200px]">Name</li>
               <li className="max-w-[200px]">Email</li>
               <li className="max-w-[200px]">Last Login</li>
               <li className="max-w-[200px]">Role</li>
               <li className="max-w-[120px]">Actions</li>
               </ul>
            </div>
            <div className="table__body">
               {error && <p className="p-4 w-full text-center">{error}</p>}
               {!loading ? (
                  <>
                     {admins.map(admin => (
                        <ul key={admin._id} className="table-row">
                           <li className="max-w-[200px]">{admin.name}</li>
                           <li className="max-w-[200px]">{admin.email}</li>
                           <li className="max-w-[200px]">{new Date(admin.lastLogin).toLocaleString()}</li>
                           <li className="max-w-[200px]" >{admin.role}</li>
                           <li className="max-w-[120px] flex gap-2">
                              <button title="edit" onClick={() => {
                                 setAdminId(admin._id);
                                 setShowForm(true);
                              }} className="text-stone-700">
                                 <EditIcon/>
                              </button>
                              <button title="delete" onClick={() => {
                                 dispatch(setDeleteItem(admin._id));
                                 dispatch(openDelete());
                              }} className="text-stone-700">
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
         <DeletePopup collection={'admins'}/>
      </Layout>
   )
}
