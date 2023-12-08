import ProductForm from "@/app/components/forms/ProductForm";
import {revalidatePath} from "next/cache";


const AddProduct = (formData: FormData) => {
    return (
        <ProductForm/>
    )
}

export default AddProduct;