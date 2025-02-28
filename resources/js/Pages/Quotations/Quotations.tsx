import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import QuotationTab from "@/Components/Tabs/QuotationTab";
import Tab from "@/Components/Tabs/Tab";
import { PaginatedData, Quotation } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

const Quotations = ({ auth }) => {
    const {
        new_quotations,
        quotations,
        accepted_quotations,
        order_issued,
        type,
    } = usePage<{
        new_quotations: PaginatedData<Quotation>;
        quotations: PaginatedData<Quotation>;
        accepted_quotations: PaginatedData<Quotation>;
        type: string;
    }>().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Quotations
                    </h2>
                </div>
            }
        >
            <Head title="Quotations" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2"></div>
                            <div>
                                <Tabs defaultValue={type} className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="pending">
                                            Pending
                                        </TabsTrigger>
                                        <TabsTrigger value="current">
                                            Current
                                        </TabsTrigger>
                                        <TabsTrigger value="accepted">
                                            Accepted
                                        </TabsTrigger>
                                        <TabsTrigger value="issued">
                                            Order Issued
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="pending">
                                        <QuotationTab
                                            quotations={new_quotations}
                                        />
                                    </TabsContent>
                                    <TabsContent value="current">
                                        <QuotationTab quotations={quotations} />
                                    </TabsContent>
                                    <TabsContent value="accepted">
                                        <QuotationTab
                                            quotations={accepted_quotations}
                                        />
                                    </TabsContent>
                                    <TabsContent value="issued">
                                        <QuotationTab
                                            quotations={order_issued}
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

export default Quotations;
