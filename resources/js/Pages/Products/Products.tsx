import { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { PageProps, PaginatedData, Product } from "@/types";
import ProductTab from "@/Components/Tabs/ProductTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";

const Products = ({ auth, flash }: PageProps) => {
    const { toast } = useToast();

    const { newProducts, products, rejectedProducts, role, type } = usePage<{
        newProducts: PaginatedData<Product>;
        products: PaginatedData<Product>;
        rejectedProducts: PaginatedData<Product>;
        type: string;
    }>().props;

    useEffect(() => {
        if (flash.message.success) {
            toast({
                description: flash.message.success,
            });
        }
    }, [flash]);

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
            <Toaster />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2">
                                <Link
                                    href={route("product.form")}
                                    type="button"
                                    className="py-2 px-4 border bg-green-800 hover:bg-green-800/60 text-white font-bold text-sm rounded-md"
                                >
                                    Create Product
                                </Link>
                            </div>
                            <div>
                                <Tabs defaultValue={type} className="w-full">
                                    <TabsList>
                                        <TabsTrigger
                                            value="pending"
                                            className="gap-2"
                                        >
                                            Pending
                                            <div className="flex flex-row items-center">
                                                {newProducts.data &&
                                                    newProducts.data.length >
                                                        0 && (
                                                        <Badge variant="destructive">
                                                            {newProducts.total}
                                                        </Badge>
                                                    )}
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger value="current">
                                            Current
                                        </TabsTrigger>
                                        <TabsTrigger value="rejected">
                                            Rejected
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="pending">
                                        <ProductTab
                                            products={newProducts}
                                            type={type}
                                        />
                                    </TabsContent>
                                    <TabsContent value="current">
                                        <ProductTab
                                            products={products}
                                            type={type}
                                        />
                                    </TabsContent>
                                    <TabsContent value="rejected">
                                        <ProductTab
                                            products={rejectedProducts}
                                            type={type}
                                        />
                                    </TabsContent>
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
