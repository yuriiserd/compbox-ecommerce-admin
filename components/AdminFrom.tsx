import { useContext, useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import axios from "axios";
import Image from "next/image";
import Spinner from "./Spinner";
import bcrypt from "bcryptjs";
import useAdminRole from "../hooks/useAdminRole";
import { useSession } from "next-auth/react";
import { ErrorContext } from "./ErrorContext";
import { Admin } from "../types/admin";

type AdminFormProps = {
  adminId: string;
  setShowForm: (value: boolean) => void;
}

export default function AdminForm({ adminId, setShowForm }: AdminFormProps) {

  const [admin, setAdmin] = useState<Admin>({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
    photo: '',
    lastLogin: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [existingAdminPassword, setExistingAdminPassword] = useState('');

  const {data: session} = useSession();
  const {setErrorMessage, setShowError} = useContext(ErrorContext);
  

  useEffect(() => {
    if (adminId) {
      axios.get(`/api/admins?id=${adminId}`).then(res => {
        setAdmin({
          ...res.data,
          password: ''
        });
        setExistingAdminPassword(res.data.password);
      })
    }
  }, [adminId])

  
  async function uploadImage(e) {

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to upload images. Please contact an admin');
      setShowError(true);
      return;
    }

    setUploadingImage(true);
    const file = e.target?.files[0];
    if (e.target?.files.length > 0) {
      const data = new FormData();
      data.append('file', file)
      const res = await axios.post('/api/upload', data);
      if (res.data.links.length > 0) {
        setUploadingImage(false);
      }
      setAdmin(prev => {
        return {
          ...prev,
          photo: res.data.links[0]
        }
      })
    }
  }

  async function saveAdmin(e) {
    e.preventDefault();

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to save admins. Please contact an admin');
      setShowError(true);
      return;
    }

    if (adminId) {
      const res = await axios.put(`/api/admins?id=${adminId}`, 
      {
        ...admin, 
        // if password is not empty, hash it, otherwise use existing password
        password: admin.password !== '' ? await protectPassword(admin.password) : existingAdminPassword
      });
      if (res.data.success) {
        setAdmin({
          name: '',
          email: '',
          password: '',
          role: 'Admin',
          photo: ''
        });
        setShowForm(false);
      }
      return
    }
    const res = await axios.post('/api/admins', {...admin, password: await protectPassword(admin.password)});
    if (res.data.success) {
      setAdmin({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
        photo: ''
      });
      setShowForm(false);
    }
  }

  async function protectPassword(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  return (
    <form onSubmit={saveAdmin}>
      <div className="mb-4">
        <div className="flex gap-4 flex-wrap mb-4">
          <div className="max-w-[200px]">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              className="mb-0"
              value={admin?.name}
              onChange={(e) => setAdmin(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </div>
          <div className="max-w-[200px]">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              className="mb-0"
              value={admin?.email}
              onChange={(e) => setAdmin(prev => ({
                ...prev,
                email: e.target.value
              }))}
              />
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="max-w-[200px]">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              className="mb-0"
              required={!adminId}
              value={admin?.password}
              onChange={(e) => setAdmin(prev => ({
                ...prev,
                password: e.target.value
              }))}
            />
          </div>
          <div className="relative max-w-[200px]">
            <label htmlFor="role">Role</label>
            <Dropdown
              items={[
                "Admin",
                "Viewer"
              ]}
              initialItem={admin?.role}
              selectedItem={(item) => setAdmin(prev => ({
                ...prev,
                role: item
              }))}
            />
          </div>
        </div>
      </div>
      <span className="mb-2 block">Photo</span>
        <div className="flex mb-4">
          {admin?.photo && (
            <div key={admin?.photo} className="image-preview">
              <Image src={admin?.photo} className="rounded-lg object-cover h-24 w-24 hover:object-contain" width={96} height={96} alt={`image`}/>
              <div className="delete" onClick={() => setAdmin(prev => {
                return {
                  ...prev,
                  photo: ''
                }
              })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          )}
          {!admin?.photo && (
            <label className="upload mb-0">
              {uploadingImage && (
                <Spinner/>
              )}
              {!uploadingImage && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
              <input type="file" onChange={uploadImage} className="hidden"></input>
            </label>
          )}
        </div>
      <div className="flex gap-4">
        <button className="btn" >Save</button>
        <button className="btn btn_red" onClick={() => {
          setShowForm(false)
          setAdmin({
            name: '',
            email: '',
            password: '',
            role: 'Admin',
            photo: ''
          });
        }}>Cancel</button>
      </div>
    </form>
  );
}