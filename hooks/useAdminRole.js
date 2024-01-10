import axios from "axios";

export default async function useAdminRole(email) {

  const adminDoc = await axios.get(`/api/admins?email=${email}`);
  console.log(adminDoc);
  const role = adminDoc.data.role;
  console.log(role);
  return role;
}