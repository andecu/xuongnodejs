import instance from "@/configs/axios";
import { RegisterType, User, UserLogin } from "@/interfaces/user";

export interface DataAuthResponse {
  message: string | Array<string>;
  userId: User;
  token: string;
}

const loginSubmit = async (data: UserLogin): Promise<DataAuthResponse> => {
  const response = await instance.post<DataAuthResponse>("/auth/signin", data);

  return response.data;
};

const registerSubmit = async (
  data: RegisterType
): Promise<DataAuthResponse> => {
  const result = instance.post<DataAuthResponse>("/auth/signup", data);
  return (await result).data;
};

const getAccountAdmin = async (): Promise<DataAuthResponse> => {
  const data = await instance.get<DataAuthResponse>(`/admin`, {});
  return data.data;
};

const getUserList = async () =>
  instance.get<Omit<DataAuthResponse, "accessToken">>("/admin/userlist", {});

const deleteUser = async (id: string) => {
  return instance.delete(id, {});
};

const addUser = async (body: Omit<RegisterType, "confirmPassword">) =>
  await instance.post<DataAuthResponse>("/signup", body, {});
export {
  deleteUser,
  addUser,
  loginSubmit,
  getAccountAdmin,
  registerSubmit,
  getUserList,
};
