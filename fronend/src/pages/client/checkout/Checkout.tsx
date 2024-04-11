import { Banner } from "@/components";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkoutValidate } from "@/components/utils/validate";
import instance from "@/configs/axios";
import { ICartList } from "@/interfaces/cart";
import { getCartByUserid } from "@/services/cart";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const [cartList, setCatList] = useState<ICartList[] | []>([]);
  const totalPrice = useMemo(() => cartList, [cartList]);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();
  const { data: cartListDB } = useQuery({
    queryKey: ["cart", user?._id],
    queryFn: () => getCartByUserid(user?._id as string),
    enabled: user?._id !== undefined,
  });

  const formOrder = useForm({
    resolver: yupResolver(checkoutValidate),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      company: "",
      country: "",
      address: "",
      city: "",
      province: "",
      zip_code: "",
      email: "",
      note: "",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: any) => {
      await instance.post("http://localhost:8080/api/v1/order", data);
    },

    onSuccess: () => {
      toast.success("Order Success fully");
      navigate("/");
    },
  });

  const totalCurrentPurchasePrice = useMemo(
    () =>
      (totalPrice as ICartList[]).reduce((result, current) => {
        return result + current.quantity * Number(current.productId.price);
      }, 0),
    [totalPrice]
  );
 

  useEffect(() => {
    
    if (cartListDB?.data) {
      setCatList((cartListDB?.data as any)?.products);
    }
  }, [cartListDB]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userExit = user ? JSON.parse(user) : null;
    if (!userExit) {
      toast.error("You Login to Order");
      navigate("/signin");
    }
    setUser(userExit.userId);
  }, [navigate]);

  const handleSubit = (product: any) => {
    const data = {
      orderby: user._id,
      information: product,
      products: cartList?.map((item) => ({
        product: item.productId._id,
        count: item.quantity,
        price: item.productId.price,
      })),
      total: totalCurrentPurchasePrice,
      totalAfterDiscount: totalCurrentPurchasePrice,
    };
    orderMutation.mutateAsync(data);
  };
  return (
    <>
      <Banner />

      <div className=" m-auto mt-5 pb-10">
        <Form {...formOrder}>
          <form onSubmit={formOrder.handleSubmit(handleSubit)}>
            <div className="flex w-full gap-x-5">
              <div className="w-[45%] ">
                <h2 className="font-bold text-lg my-3">Billing Detail</h2>

                {/* first and last name */}
                <div className="grid grid-cols-2 gap-x-8">
                  <FormField
                    control={formOrder.control}
                    name="firstName"
                    render={({ field }: any) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="First_name">First Name</FormLabel>
                        <FormControl>
                          <Input {...field} id="First_name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formOrder.control}
                    name="lastName"
                    render={({ field }: any) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="name">Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} id="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* company */}
                <FormField
                  control={formOrder.control}
                  name="company"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="company">
                        Company Name(Optional)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} id="company" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* country */}
                <FormField
                  control={formOrder.control}
                  name="country"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Country / Region</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger {...field}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Viet_Name">Viet Name</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formOrder.control}
                  name="address"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="address">Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} id="address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formOrder.control}
                  name="city"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="city">Town / City</FormLabel>
                      <FormControl>
                        <Input {...field} id="city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* province */}

                <FormField
                  control={formOrder.control}
                  name="province"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger {...field}>
                            <SelectValue placeholder="Select a Province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Viet Nam">Viet Nam</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* zip code */}
                <FormField
                  control={formOrder.control}
                  name="zip_code"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="zip_code">Zip code</FormLabel>
                      <FormControl>
                        <Input {...field} id="zip_code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* phone number */}
                <FormField
                  control={formOrder.control}
                  name="phone"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="phone">Phone number</FormLabel>
                      <FormControl>
                        <Input {...field} id="phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* phone number */}
                <FormField
                  control={formOrder.control}
                  name="email"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} id="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formOrder.control}
                  name="note"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel htmlFor="note">
                        Adiditonal infomation
                      </FormLabel>
                      <FormControl>
                        <Input {...field} id="note" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[45%] p-10 h-[40%] border bg-orange-300 flex justify-center items-center flex-col">
                <div className="flex flex-col w-[80%]">
                  <p className="flex justify-between items-center">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span>Asgoard sofa</span>
                    <span>{totalCurrentPurchasePrice}đ</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span>{totalCurrentPurchasePrice}đ</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span>Total</span>
                    <span className="text-lg font-semibold text-[#B88E2F]">
                      <span>{totalCurrentPurchasePrice}đ</span>
                    </span>
                  </p>
                </div>
                <hr />
                <div className="w-[80%] m-auto">
                  <div className="flex">
                    <Input type="checkbox" />
                    <p>Direct Bank Transfer</p>
                  </div>
                  <div className="flex">
                    <Input type="checkbox" />
                    <p>Direct Bank Transfer</p>
                  </div>
                  <div className="flex">
                    <Input type="checkbox" />
                    <p>Cash On Delivery</p>
                  </div>
                </div>

                <p className="my-4">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our{" "}
                  <strong> privacy policy.</strong>
                </p>
                <button
                  type="submit"
                  className="px-4  py-3 rounded bg-[#DC3545] text-white"
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
