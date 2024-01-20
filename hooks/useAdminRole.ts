import axios from "axios";

export default async function useAdminRole(email: string) {

  const adminDoc = await axios.get(`/api/admins?email=${email}`);
  const role = adminDoc.data.role;
  return role;
}