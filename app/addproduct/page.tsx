import ProductForm from "@/app/components/forms/ProductForm";
import {revalidatePath} from "next/cache";


const AddProduct = () => {
    return (
        <ProductForm/>
    )
}

export default AddProduct;