"use client"

import {useRouter} from 'next/navigation';
import {SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import Link from "next/link";
import {revalidateProducts} from "@/app/actions";

interface Inputs {
    sku: string;
    name: string;
    price: number;
    weight?: number;
    size?: number;
    height?: number;
    width?: number;
    length?: number;
}

enum ProductTypes {
    Disc = "DVD",
    Furniture = "Furniture",
    Book = "Book"
}

const ProductForm = () => {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState<ProductTypes>(ProductTypes.Disc);
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const {name, weight, height, size, sku, length, price, width} = data;
        const formData = new FormData();
        formData.append('sku', sku);
        formData.append('name', name);
        formData.append('price', price.toString());
        if (selectedProduct === ProductTypes.Disc && size) {
            formData.append('size', size.toString());
        } else if (selectedProduct === ProductTypes.Book && weight) {
            formData.append('weight', weight.toString());
        } else if (selectedProduct === ProductTypes.Furniture && height && width && length) {
            formData.append('dimensions', `${height}x${width}x${length}`);
        }
        try {
            const res = await fetch('http://localhost:8000/api/products/add', {
                method: "POST", body: formData
            });
            if (!res.ok) {
                const errorData = await res.json();
                // console.log(errorData.error.error);
                throw new Error(errorData.error);
            } else {
                // await revalidateProducts();
                await revalidateProducts();
                router.push('/');
            }
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <>
            <form id="product_form" className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-bold tracking-tight">Product Add</h2>
                    <div className="flex space-x-4">
                        <button className="text-xl border p-3 rounded-md">SAVE</button>
                        <Link href='/' className="text-xl border p-3 rounded-md">CANCEL
                        </Link>
                    </div>
                </div>
                <p>Sku:</p>
                <input
                    id="sku"
                    className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("sku", {required: true})}
                />
                <p>Name:</p>
                <input
                    id="name"
                    className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("name", {required: true})}
                />
                <p>Price:</p>
                <input
                    type='number'
                    id="price"
                    className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("price", {required: true})}
                />
                <p>Product type:</p>
                <select
                    onChange={(event) => {
                        setSelectedProduct(ProductTypes[event.target.value as keyof typeof ProductTypes]);

                    }}
                    id="productType"
                    name="productType"
                    className="max-w-[20rem] mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                    {(
                        Object.keys(ProductTypes).filter((v) =>
                            isNaN(Number(v)),
                        ) as (keyof typeof ProductTypes)[]
                    ).map((key, index) => {
                        return <option id={ProductTypes[key]} key={key} value={key}>{key}</option>;
                    })}
                </select>
                {selectedProduct === ProductTypes.Book && <>
                    <p>Weight in KG:</p>
                    <input
                        type='number'
                        id="weight"
                        className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("weight", {required: true})}
                    />
                </>}
                {selectedProduct === ProductTypes.Disc && <>
                    <p>Size in Mb:</p>
                    <input
                        type='number'
                        id="size"
                        className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("size", {required: true})}
                    />
                </>}
                {selectedProduct === ProductTypes.Furniture && <>
                    <p>Height in CM:</p>
                    <input
                        type='number'
                        id="height"
                        className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("height", {required: true})}
                    />
                    <p>Width in CM:</p>
                    <input
                        type='number'
                        id="width"
                        className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("width", {required: true})}
                    />
                    <p>Length in CM:</p>
                    <input
                        type='number'
                        id="length"
                        className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("length", {required: true})}
                    />
                </>}
            </form>
        </>
    )
}

export default ProductForm;