import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

import { PaginatedData, Product } from "@/types";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import ProductTab from "@/Components/Tabs/ProductTab";

const Products = ({ auth }: PageProps) => {
    const { newProducts, products, rejectedProducts, role, type } = usePage<{
        newProducts: PaginatedData<Product>;
        products: PaginatedData<Product>;
        rejectedProducts: PaginatedData<Product>;
        type: string;
    }>().props;

    const index = type === "Current" ? 1 : type === "Rejected" ? 2 : 0;
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
                                    href={route("product.form")}
                                    type="button"
                                    className="py-2 px-4 border bg-green-600 hover:bg-green-800 text-white font-bold text-sm rounded-md"
                                >
                                    Create Product
                                </Link>
                            </div>
                            <div>
                                <Tabs preSelectedTabIndex={index}>
                                    <Tab title="Pending">
                                        <ProductTab products={newProducts} />
                                    </Tab>

                                    <Tab
                                        title={
                                            role === "admin"
                                                ? "Current"
                                                : "My Products"
                                        }
                                    >
                                        <ProductTab products={products} />
                                    </Tab>
                                    <Tab title="Rejected">
                                        <ProductTab
                                            products={rejectedProducts}
                                        />
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
