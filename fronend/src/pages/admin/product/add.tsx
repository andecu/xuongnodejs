import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { productAddSchema } from "@/components/utils/validate";
import instance from "@/configs/axios";
import { IProduct } from "@/interfaces/product";
import { cateList } from "@/services/cate";
import { addProduct } from "@/services/products";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}

const ProductAdd = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const { toast } = useToast();
  const form = useForm({
    resolver: joiResolver(productAddSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
      discount: "",
      featured: false,
    },
  });

  const { data: categoryList } = useQuery({
    queryKey: ["category"],
    queryFn: cateList,
  });

  const uploadImage = useMutation({
    mutationFn: (file) => {
      return instance.post("images/upload", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError(error: any) {
      toast(error.message);
    },
  });

  const mutation = useMutation({
    mutationFn: async (product: IProduct) => {
      const { data } = await addProduct(product);
      return data;
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Thêm sản phẩm thành công",
        variant: "success",
      });
      navigate("/admin/products");
    },
  });

  const onSubmit1 = async (product: IProduct) => {
    if (product.image) {
      const form = new FormData();
      form.append("images", product.image[0]);
      const a = await uploadImage.mutateAsync(form as any);
      if (a.data) {
        const imageProducts = a.data.urls[0].url as string;
        mutation.mutate({
          ...(product as unknown as Omit<IProduct, "_id">),
          image: imageProducts as string,
        });
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit1)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input {...field} id="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="price">Price</FormLabel>
                <FormControl>
                  <Input {...field} id="price" style={{ width: "500px" }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel htmlFor="Category">Category</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger {...field}>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryList &&
                      categoryList?.data?.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* shadcn ui input upload image have preview image link https://github.com/shadcn-ui/ui/issues/250*/}
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="image">Image</FormLabel>
                <FormControl>
                  <Input
                    {...rest}
                    id="image"
                    type="file"
                    onChange={(event) => {
                      const { files, displayUrl } = getImageData(event);
                      setPreview(displayUrl);
                      onChange(files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {preview && (
            <Avatar className="w-24 h-24">
              <AvatarImage src={preview} />
              <AvatarFallback>BU</AvatarFallback>
            </Avatar>
          )}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Input {...field} id="description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="discount">Discount</FormLabel>
                <FormControl>
                  <Input {...field} id="discount" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                {/* <FormLabel htmlFor="featured">Featured</FormLabel> */}
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured?</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant={"destructive"} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductAdd;
