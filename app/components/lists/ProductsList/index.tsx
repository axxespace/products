"use client"

import {SubmitHandler, useForm} from "react-hook-form";
import Link from "next/link";
import {revalidateTag} from "next/cache";

interface Inputs {
    products: string[];
}

interface productType {
    id: number;
    sku: string;
    name: string;
    price: number;
    weight?: number;
    dimensions?: string;
    size?: number;
}

const ProductsList = ({products}: { products: productType[] }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const productIds = data.products;
        const formData  = new FormData();
        for (let i = 0; i < productIds.length; i++) {
            formData.append('idsToDelete[]', productIds[i]);
        }
        const res = await fetch('http://localhost:8000/api/products/delete', {
            method: "POST", body: formData
        })
        revalidateTag('products');
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-bold tracking-tight">Product List</h2>
                    <div className="flex space-x-4">
                        <Link href='/addproduct' className="text-xl border p-3 rounded-md">ADD</Link>
                        <button disabled={!watch('products')?.length} id="delete-product-btn"
                                className="text-xl border p-3 rounded-md">MASS DELETE
                        </button>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative rounded-lg border p-4 flex ">
                            <input
                                id="comments"
                                aria-describedby="comments-description"
                                type="checkbox"
                                {...register("products")}
                                value={product.id}
                                className="delete-checkbox h-4 w-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <div className="flex flex-col items-center w-full pr-4">
                                <h3 className="text-sm">
                                    {product.sku}
                                </h3>
                                <p className="text-sm">{product.name}</p>
                                <p className="text-sm">
                                    {product.weight && `${product.weight} KG`}
                                    {product.size && `${product.weight} MB`}
                                    {product.dimensions}
                                </p>
                                <p className="text-sm font-medium">{product.price}$</p>
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    )
}

export default ProductsList;