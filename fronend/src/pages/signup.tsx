import { registerSubmit } from "@/services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

const registerSchema = yup.object({
  email: yup
    .string()
    .required("Khong duoc de trong")
    .email("Khong dung dinh dang email"),
  name: yup.string().min(3).max(30).required("Khong duoc de trong"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Your password is too short."),
  confirmPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
});

type FormData = yup.InferType<typeof registerSchema>;
// type errorMessage = [];

export default function Signup() {
  const navigation = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  // const [errRespon, setErrResponses] = useState<errorMessage[]>([]);
  const handleSubmitForm = async (data: FormData) => {
    try {
      const res = await registerSubmit(data);
      console.log(res);
      if (res) {
        toast.success("Đăng kí thành công")

        navigation("/signin");
      }
    } catch (error: any) {
      // const messageErr = [...errRespon, error];
      // setErrResponses(pre=>([...pre, messageErr]));
      console.log(error?.response?.data);
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="overflow-hidden">
      <div className="min-h-screen  flex justify-center items-center">
        <div className="py-12 px-12   ">
          <div>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
              Create An Account
            </h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              Create an account to enjoy all the services without any ads for
              free!
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              {...register("name")}
              placeholder="User name"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            />
            <p className="text-red-500 my-1">{errors.name?.message}</p>
            <input
              type="text"
              {...register("email")}
              placeholder="Email Addres"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            />
            <p className="text-red-500 my-1">{errors.email?.message}</p>

            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              id="password"
            />
            <p className="text-red-500 my-1">{errors.password?.message}</p>

            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Password"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            />
            <p className="text-red-500 my-1">
              {errors.confirmPassword?.message}
            </p>
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="py-3 w-64 text-xl text-white bg-purple-400 rounded-2xl"
            >
              Create Account
            </button>
            <p className="mt-4 text-sm">
              Already Have An Account?
              <span className="underline cursor-pointer"> Sign In</span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
