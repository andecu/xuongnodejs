import { UserLogin } from "@/interfaces/user";
import { loginSubmit } from "@/services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Khong dung dinh dang email")
    .required("khong duoc de trong"),
  password: yup.string().required("khong duoc de trong"),
});
type FormData = yup.InferType<typeof validationSchema>;

const Signin = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const navigation = useNavigate();
  const handleSubmitForm = async (data: FormData) => {
    try {
      const res = await loginSubmit(data as UserLogin);

      if (res) {
        alert("Dang nhap thanh cong");

        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: res?.userId,
            accessToken: res.token,
          })
        );

        navigation("/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <section className="h-screen">
      <div className="container h-full px-6 py-24">
        <div className="g-6 flex h-full   items-center justify-center  ">
          <div className="w-[40%] m-auto">
            <h1 className="mb-4 text-center">Login</h1>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@flowbite.com"
                />
                <p className="text-red-500 my-1">{errors.email?.message}</p>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <p className="my-1 text-red-500">{errors.password?.message}</p>
              </div>

              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
