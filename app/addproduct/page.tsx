import ProductForm from "@/app/components/forms/ProductForm";
import {revalidatePath} from "next/cache";


const AddProduct = (formData: FormData) => {
    const revalidateProducts = async () => {
        "use server"
        revalidatePath('/');
    }
    return (
        <ProductForm/>
    )
}

export default AddProduct;