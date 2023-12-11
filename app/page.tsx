import ProductsList from "@/app/components/lists/ProductsList";

const ProductsPage = async () => {
  const getProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/api/products`, {
      next: { tags: ["products"] },
    });
    return res.json();
  };
  const products = await getProducts();

  return <ProductsList data={products} />;
};

export default ProductsPage;
