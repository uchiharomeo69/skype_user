export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: string;
  active: boolean;
  avatar: string;
  activeCode: string;
}
