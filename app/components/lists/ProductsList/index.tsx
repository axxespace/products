"use client"

import {SubmitHandler, useForm} from "react-hook-form";
import Link from "next/link";
import {revalidateProducts} from "@/app/utils";
import Spinner from "@/app/components/UI/Spinner";

interface Inputs {
    products: string[];
    endpointError?: string;
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
        setError,
        formState: {errors, isSubmitting},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const productIds = data.products;
        const formData = new FormData();
        for (let i = 0; i < productIds.length; i++) {
            formData.append('idsToDelete[]', productIds[i]);
        }
        try {
            await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/api/products/delete`, {
                method: "POST", body: formData
            })
        } catch (err: any) {
            setError('endpointError', {message: err.message});
        }
        await revalidateProducts();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-5 justify-between items-center text-white">
                <h2 className="text-4xl font-bold tracking-tight text-white">Product List</h2>
                <div className="flex space-x-4">
                    <Link href='/addproduct' className="text-xl border p-3 rounded-md">ADD</Link>
                    <button disabled={!watch('products')?.length}
                            id="delete-product-btn"
                            className="flex items-center gap-2 text-xl border p-3 rounded-md "
                    >
                        <div className={`transition-all ${isSubmitting ? 'w-6' : 'w-0'} h-6`}><Spinner/></div>
                        MASS DELETE
                    </button>
                </div>
            </div>
            {errors.endpointError && <p className='text-red-700'>{errors.endpointError.message}</p>}
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.length > 0 && products.map((product) => (
                    <div key={product.id} className="group relative rounded-lg border p-4 flex ">
                        <input
                            id="comments"
                            aria-describedby="comments-description"
                            type="checkbox"
                            {...register("products")}
                            value={product.id}
                            className="delete-checkbox h-4 w-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <div className="flex flex-col items-center w-full pr-4 text-white">
                            <h3 className="font-semibold">
                                {product.sku}
                            </h3>
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
    )
}

export default ProductsList;