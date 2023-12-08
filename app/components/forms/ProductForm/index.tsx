"use client"

import {useRouter} from 'next/navigation';
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import Link from "next/link";
import {revalidateProducts} from "@/app/utils";
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
    endpointError?: string;
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
        setError,
        clearErrors,
        formState: {errors, isSubmitting},
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
            const res = await fetch('https://nika-scandi-assignment.000webhostapp.com/api/products/add', {
                method: "POST", body: formData
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
            } else {
                await revalidateProducts();
                router.push('/');
            }
        } catch (err: any) {
            setError('endpointError', {message: err.message});
        }
    }

    useEffect(() => {
        clearErrors('endpointError');
    }, [watch('sku')]);

    return (
        <>
            <form id="product_form" className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
                    <h2 className="text-4xl font-bold tracking-tight">Product Add</h2>
                    <div className="flex space-x-4">
                        <button className="flex items-center gap-2 text-xl border p-3 rounded-md">
                            <div className={`transition-all w-${isSubmitting ? '6' : '0'} h-6`}><Spinner/></div>
                            SAVE
                        </button>
                        <Link href='/' className="text-xl border p-3 rounded-md">
                            CANCEL
                        </Link>
                    </div>
                </div>
                <div>
                    <FormInput {...register("sku", {required: {value: true, message: 'Sku is required'}})} label='Sku:'
                               id='sku' error={errors.sku}/>
                    <FormInput {...register("name", {required: {value: true, message: 'Name is required'}})}
                               label='Name:'
                               id='name' error={errors.name}/>
                    <FormInput {...register("price", {required: {value: true, message: 'Price is required'}})}
                               type='number'
                               label='Price:'
                               id='price' error={errors.price}/>

                    <div className='my-3'>
                        <p>Product type:</p>
                        <select
                            onChange={(event) => {
                                setSelectedProduct(ProductTypes[event.target.value as keyof typeof ProductTypes]);

                            }}
                            id="productType"
                            name="productType"
                            className="max-w-[20rem] block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                            {(
                                Object.keys(ProductTypes).filter((v) =>
                                    isNaN(Number(v)),
                                ) as (keyof typeof ProductTypes)[]
                            ).map((key, index) => {
                                return <option key={key} value={key}>{ProductTypes[key]}</option>;
                            })}
                        </select>
                    </div>
                    {selectedProduct === ProductTypes.Book &&
                        <FormInput {...register("weight", {required: {value: true, message: 'Weight is required'}})}
                                   type='number'
                                   label='Weight:'
                                   id='weight' error={errors.weight}/>}
                    {selectedProduct === ProductTypes.Disc &&
                        <FormInput {...register("size", {required: {value: true, message: 'Size is required'}})}
                                   type='number'
                                   label='Size:'
                                   id='size' error={errors.size}/>}
                    {selectedProduct === ProductTypes.Furniture && <>
                        <FormInput {...register("height", {required: {value: true, message: 'Height is required'}})}
                                   type='number'
                                   label='Height in CM:'
                                   id='height' error={errors.height}/>
                        <FormInput {...register("width", {required: {value: true, message: 'Width is required'}})}
                                   type='number'
                                   label='Width in CM:'
                                   id='width' error={errors.width}/>
                        <FormInput {...register("length", {required: {value: true, message: 'Length is required'}})}
                                   type='number'
                                   label='Length in CM:'
                                   id='length' error={errors.length}/>
                    </>}
                    {errors.endpointError && <p className='text-red-700'>{errors.endpointError.message}</p>}
                </div>
            </form>
        </>
    )
}

export default ProductForm;