import { ICategory, createCate, getOneCate, udpateCate } from "@/services/cate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

const validateForm = yup.object({
  name: yup.string().required(),
});

type ProductForm = Pick<ICategory, "name">;
const initiaFormState = {
  name: "",
};
type FormData = yup.InferType<typeof validateForm>;

export default function Addcate() {
  const { id } = useParams();
  const idParams = id as string;
  const isEdeting = useMatch("/admin/category/add");
  const isModel = Boolean(isEdeting);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: initiaFormState,
    resolver: yupResolver(validateForm),
  });

  const addProductMutation = useMutation({
    mutationFn: (body: ProductForm) => createCate({ data: body }),
    onError(error, variables) {
      console.log(error);
      console.log(variables, "variables");
    },
    onSuccess() {
      // console.log(data, "data mutation");
      reset();
      toast.success("them thanh cong");
      navigate("/admin/category");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (body: FormData) => {
      return udpateCate({
        body,
        id: idParams,
      });
    },
    onError(error, variables) {
      console.log(error);
      console.log(variables, "variables");
    },
    onSuccess() {
      // console.log(data, "data mutation");
      reset();
      toast.success("Sua thanh cong");
      navigate("/admin/category");
    },
  });
  
  const { data } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getOneCate(id as string),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (data && data.data) {
      console.log(data);
      setValue("name", data?.data?.name);
    }
  }, [data, setValue]);
  const handleSubmitForm = async (data: FormData) => {
    try {
      if (isModel) {
        const dataRes = await addProductMutation.mutateAsync(data);
        console.log("data: ", dataRes);
      } else {
        console.log("check mutaition :", data);
        updateProductMutation.mutate(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <p className="text-center mt-3 text-2xl font-semibold">
        {isModel && !id ? "Add products" : "Edit product"}
      </p>
      <form
        className="container m-auto"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="mb-6">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder=""
            {...register("name")}
          />
          <p className="text-red-500 my-1">{errors.name?.message}</p>
        </div>

        <div>
          {isModel ? (
            <button
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800"
              type="submit"
            >
              <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                Create
              </span>
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                  Update
                </span>
              </button>
              <button
                type="reset"
                className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                  Cancel
                </span>
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
