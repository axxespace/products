"use client";

import { deleteProducts } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Spinner from "@/app/components/UI/Spinner";

interface productType {
  id: number;
  sku: string;
  name: string;
  price: number;
  weight?: number;
  dimensions?: string;
  size?: number;
}

const ProductsList = ({ data }: { data: productType[] }) => {
  const [errorMessage, setErrorMessage] = useState();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: FormData) => {
    startTransition(() => {
      try {
        deleteProducts(data);
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    });
  };

  return (
    <form action={onSubmit}>
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center text-white">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Product List
        </h2>
        <p className="text-red-700">{errorMessage}</p>
        <div className="flex space-x-4">
          <button
            type="button"
            className="text-xl border p-3 rounded-md"
            onClick={() => {
              router.push("add-product");
            }}
          >
            ADD
          </button>
          <div
            className={`${
              isPending ? "pl-3" : "pl-0"
            } flex items-center border rounded-md transition-all`}
          >
            <span className={`h-6 transition-all ${isPending ? "w-6" : "w-0"}`}>
              <Spinner />
            </span>
            <button id="delete-product-btn" className="text-xl p-3">
              MASS DELETE
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {data.length > 0 &&
          data.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg border p-4 flex "
            >
              <input
                aria-describedby="comments-description"
                type="checkbox"
                name="idsToDelete[]"
                value={product.id}
                className="delete-checkbox h-4 w-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <div className="flex flex-col items-center w-full pr-4 text-white">
                <h3 className="font-semibold">{product.sku}</h3>
                <p>{product.name}</p>
                <p>
                  {product.weight && `${product.weight} KG`}
                  {product.size && `${product.size} MB`}
                  {product.dimensions}
                </p>
                <p>{product.price}$</p>
              </div>
            </div>
          ))}
      </div>
    </form>
  );
};

export default ProductsList;
