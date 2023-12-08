'use server'

import {revalidateTag} from "next/cache";

export const revalidateProducts = async () => {
    revalidateTag('products');
}