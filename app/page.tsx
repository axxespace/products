
import ProductsList from "@/app/components/lists/ProductsList";

const Products = async () => {
    const getProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/api/products`, { next: { tags: ['products'] } });
            return res.json();
        } catch (e) {
            throw e;
        }
    }
    const products = await getProducts();


    return (
        <ProductsList products={products} />
    )
}

export default Products;