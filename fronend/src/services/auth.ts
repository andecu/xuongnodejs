import instance from "@/configs/axios";
import { RegisterType, User, UserLogin } from "@/interfaces/user";

export interface DataAuthResponse {
  message: string | Array<string>;
  data: User;
  accessToken: string;
}

const accessToken: { accessToken: string; user: User } = localStorage.getItem(
  "user"
)
  ? JSON.parse(localStorage.getItem("user") as string)
  : "";

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

const getAccountAdmin = async (
  accessToken: string
): Promise<DataAuthResponse> => {
  const data = await instance.get<DataAuthResponse>(`/admin`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return data.data;
};

const getUserList = async (accessToken: string) =>
  instance.get<Omit<DataAuthResponse, "accessToken">>("/admin/userlist", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

const deleteUser = async (id: string) => {
  return instance.delete(id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const addUser = async (body: Omit<RegisterType, "confirmPassword">) =>
  await instance.post<DataAuthResponse>("/signup", body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
export {
  deleteUser,
  addUser,
  loginSubmit,
  getAccountAdmin,
  registerSubmit,
  getUserList,
};
