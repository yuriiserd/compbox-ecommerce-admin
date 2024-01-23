export type Admin = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  photo: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date | '' | null;
}