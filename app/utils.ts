"use server";

import { revalidateTag } from "next/cache";

export const revalidateProducts = async () => {
  revalidateTag("products");
};

export const deleteProducts = async (formData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/api/products/delete`, {
        method: "POST",
        body: formData,
      },
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error);
    } else {
      await revalidateProducts();
    }
  } catch (err: any) {
    return err;
  }
};
