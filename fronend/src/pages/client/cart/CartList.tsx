import { Banner } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICartList } from "@/interfaces/cart";
import { deleteCart, descCount, getCartByUserid } from "@/services/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export default function CartList() {
  const [cartList, setCatList] = useState<ICartList[] | []>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const totalPrice = useMemo(() => cartList, [cartList]);
  const [user, setUser] = useState<any>();

  const { data: cartListDB } = useQuery({
    queryKey: ["cart", user?._id],
    queryFn: () => getCartByUserid(user?._id as string),
    enabled: user?._id !== undefined,
  });

  const invoices = useMemo(() => {
    return (
      cartList &&
      cartList.map((item) => ({
        _id: item.productId._id,
        image: item.productId.image,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        totalAmount: +item.productId.price * +item.quantity,
      }))
    );
  }, [cartList]);

  const updateCart = useMutation({
    mutationFn: async ({ productId, quantity }: any) => {
      await descCount({
        productId,
        userId: user?._id,
        quantity,
      });
    },

    onSuccess: () => {
      toast.success("Update quantity");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
    const user = localStorage.getItem("user");
    const userExit = user ? JSON.parse(user) : null;
    if (!userExit) {
      toast.error("You Login to Order");
      navigate("/signin");
    }
    setUser(userExit.userId);
  }, [navigate]);

  useEffect(() => {
    if (cartListDB?.data) {
      setCatList((cartListDB?.data as any)?.products);
    }
  }, [cartListDB]);

  const removecart = useMutation({
    mutationFn: async (_id: string) => {
      await deleteCart(_id, user?._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert("Xóa thành công");
    },
  });

  const handleDeleteCart = (id: string) => {
    const ab = confirm("Are you sure you want to delete");
    if (ab) {
      setCatList(cartList.filter((item) => item._id !== id));
      removecart.mutateAsync(id);
    }
  };

  const handleOnchangInput = (value: number, id: string) => {
    updateCart.mutateAsync({ productId: id, quantity: value });
  };

  const handleAscByCout = (id: string, indexCart: number, keyChange = true) => {
    const cartItem = cartList.find((_, i) => i === indexCart);
    if (cartItem?.quantity === 1 && keyChange) {
      toast.error("Khong the giam so luong");
      return;
    }
    if (cartItem) {
      const quantity = keyChange
        ? cartItem.quantity - 1
        : cartItem.quantity + 1;
      updateCart.mutateAsync({ productId: id, quantity });
    }
  };

  const handleOrder = () => {
    navigate((user?._id as string) ? "/order" : "signin");
  };

  return (
    <>
      <Banner />
      <div className="mt-8 m-auto pb-10">
        <div className="flex w-full gap-x-5">
          <div className="w-[70%] ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, i) => (
                  <TableRow key={invoice.name}>
                    <TableCell className="w-[125px]">
                      <img src={invoice.image} className="w-full c" />
                    </TableCell>
                    <TableCell>{invoice.name}</TableCell>
                    <TableCell>{invoice.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center rounded border justify-center border-gray-200 max-h-8">
                        <button
                          type="button"
                          className="w-6 leading-10 text-gray-600 transition hover:opacity-75"
                          onClick={() =>
                            handleAscByCout((invoice?._id as string) || "", i)
                          }
                        >
                          −
                        </button>

                        <input
                          type="number"
                          id="Quantity"
                          value={invoice.quantity}
                          className="h-6 w-10 border-y-0 border-x-[1px] border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                          onBlur={(e) => {
                            handleOnchangInput(
                              +e.target.value,
                              (invoice._id as string) || ""
                            );
                          }}
                        />

                        <button
                          type="button"
                          className=" w-6 leading-10 text-gray-600 transition hover:opacity-75"
                          onClick={() =>
                            handleAscByCout(
                              (invoice?._id as string) || "",
                              i,
                              false
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount} đ
                    </TableCell>
                    <TableCell className="text-right">
                      <i
                        onClick={() =>
                          handleDeleteCart((invoice?._id as string) || "")
                        }
                        className="  cursor-pointer top-2 text-ellipsis p-1 right-3.5 fa-solid fa-xmark"
                      ></i>{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-[25%] border bg-orange-300 flex justify-center items-center flex-col">
            <h2 className="py-4 font-bold text-lg">Cart total </h2>
            <div className="flex flex-col w-[80%]">
              <p className="flex justify-between items-center">
                <span>Subtotal</span>
                <span>{totalCurrentPurchasePrice}đ</span>
              </p>
              <p className="flex justify-between items-center">
                <span>Total</span>
                <span>{totalCurrentPurchasePrice}đ</span>
              </p>
            </div>
            <button
              onClick={handleOrder}
              className="my-4 p-3 rounded-lg border px-5 uppercase"
            >
              Check out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
