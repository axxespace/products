"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";
import { revalidateProducts } from "@/app/utils";
import FormInput from "@/app/components/Inputs/FormInput";
import Spinner from "@/app/components/UI/Spinner";

interface Inputs {
  sku: string;
  name: string;
  price: number;
  weight?: number;
  size?: number;
  height?: number;
  width?: number;
  length?: number;
  error?: string;
}

enum ProductTypes {
  Disc = "DVD",
  Furniture = "Furniture",
  Book = "Book",
}

const ProductForm = () => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductTypes>();
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!selectedProduct) {
      setError("error", { message: "Select a product type" });
      return;
    }
    const { name, weight, height, size, sku, length, price, width } = data;
    const formData = new FormData();
    formData.append("sku", sku);
    formData.append("name", name);
    formData.append("price", price.toString());
    if (selectedProduct === ProductTypes.Disc && size) {
      formData.append("size", size.toString());
    } else if (selectedProduct === ProductTypes.Book && weight) {
      formData.append("weight", weight.toString());
    } else if (
      selectedProduct === ProductTypes.Furniture &&
      height &&
      width &&
      length
    ) {
      formData.append("dimensions", `${height}x${width}x${length}`);
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DB_HOST}/api/products/add`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      } else {
        await revalidateProducts();
        router.push("/");
      }
    } catch (err: any) {
      setError("error", { message: err.message });
    }
  };

  useEffect(() => {
    clearErrors("error");
  }, [watch("sku"), selectedProduct]);

  return (
    <>
      <form
        id="product_form"
        className="mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5 md:flex-row justify-between items-center text-white">
          <h2 className="text-4xl font-bold tracking-tight">Product Add</h2>
          <div className="flex space-x-4">
            <div
              className={`${
                isSubmitting ? "pl-3" : "pl-0"
              } flex items-center border rounded-md transition-all`}
            >
              <span
                className={`h-6 transition-all ${isSubmitting ? "w-6" : "w-0"}`}
              >
                <Spinner />
              </span>
              <button className="flex items-center gap-2 text-xl p-3">
                Save
              </button>
            </div>
            <Link href="/" className="text-xl border p-3 rounded-md">
              Cancel
            </Link>
          </div>
        </div>
        <div>
          <FormInput
            {...register("sku", {
              required: { value: true, message: "Sku is required" },
            })}
            label="Sku:"
            id="sku"
            error={errors.sku}
          />
          <FormInput
            {...register("name", {
              required: { value: true, message: "Name is required" },
            })}
            label="Name:"
            id="name"
            error={errors.name}
          />
          <FormInput
            {...register("price", {
              required: { value: true, message: "Price is required" },
            })}
            type="number"
            label="Price:"
            id="price"
            error={errors.price}
          />

          <div className="my-3 text-white">
            <p>Product type:</p>
            <select
              onChange={(event) => {
                setSelectedProduct(
                  ProductTypes[event.target.value as keyof typeof ProductTypes],
                );
              }}
              id="productType"
              name="productType"
              className="max-w-[20rem] block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option hidden>choose</option>
              {(
                Object.keys(ProductTypes).filter((v) =>
                  isNaN(Number(v)),
                ) as (keyof typeof ProductTypes)[]
              ).map((key) => {
                return (
                  <option key={key} value={key}>
                    {ProductTypes[key]}
                  </option>
                );
              })}
            </select>
          </div>
          {selectedProduct === ProductTypes.Book && (
            <FormInput
              {...register("weight", {
                required: { value: true, message: "Weight is required" },
              })}
              type="number"
              label="Weight:"
              id="weight"
              error={errors.weight}
            />
          )}
          {selectedProduct === ProductTypes.Disc && (
            <FormInput
              {...register("size", {
                required: { value: true, message: "Size is required" },
              })}
              type="number"
              label="Size:"
              id="size"
              error={errors.size}
            />
          )}
          {selectedProduct === ProductTypes.Furniture && (
            <>
              <FormInput
                {...register("height", {
                  required: { value: true, message: "Height is required" },
                })}
                type="number"
                label="Height in CM:"
                id="height"
                error={errors.height}
              />
              <FormInput
                {...register("width", {
                  required: { value: true, message: "Width is required" },
                })}
                type="number"
                label="Width in CM:"
                id="width"
                error={errors.width}
              />
              <FormInput
                {...register("length", {
                  required: { value: true, message: "Length is required" },
                })}
                type="number"
                label="Length in CM:"
                id="length"
                error={errors.length}
              />
            </>
          )}
          {errors.error && (
            <p className="text-red-700">{errors.error.message}</p>
          )}
        </div>
      </form>
    </>
  );
};

export default ProductForm;
