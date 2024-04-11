import instance from "@/configs/axios";

export interface ICategory {
  createdAt: string;
  name: string;

  updatedAt: string;
  _id: string;
}

const createCate = ({ data }: { data: Pick<ICategory, "name"> }) =>
  instance.post("/categories", data);

const cateList = async () => instance.get<ICategory[]>("/categories");

const getOneCate = (id: string) => instance.get<ICategory>("/categories/" + id);

const deleteCate = ({ id }: { id: string; accessToken: string }) =>
  instance.delete("/categories/" + id);

const udpateCate = ({
  body,
  id,
}: {
  body: Pick<ICategory, "name">;
  id: string;
}) => {
  return instance.patch(`/categories/${id}`, body);
};

export { createCate, cateList, udpateCate, getOneCate, deleteCate };
