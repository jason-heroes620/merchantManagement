import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

import { PaginatedData, Product } from "@/types";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import ProductTab from "@/Components/Tabs/ProductTab";

const Products = ({ auth }: PageProps) => {
    const { newProducts, products, role } = usePage<{
        newProducts: PaginatedData<Product>;
        products: PaginatedData<Product>;
    }>().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2">
                                <Link
                                    href={route("products.form")}
                                    type="button"
                                    className="py-2 px-4 border bg-green-600 hover:bg-green-800 text-white font-bold text-sm rounded-md"
                                >
                                    Create Product
                                </Link>
                            </div>
                            <div>
                                <Tabs>
                                    <Tab title="Pending Products">
                                        <ProductTab products={newProducts} />
                                    </Tab>

                                    <Tab
                                        title={
                                            role === "admin"
                                                ? "Products"
                                                : "My Products"
                                        }
                                    >
                                        <ProductTab products={products} />
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Products;
