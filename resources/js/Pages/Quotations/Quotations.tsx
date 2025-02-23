import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import QuotationTab from "@/Components/Tabs/QuotationTab";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import { PaginatedData, Quotation } from "@/types";

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

    const index =
        type === "Current"
            ? 1
            : type === "Accepted"
            ? 2
            : type === "Order Issued"
            ? 3
            : 0;

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
                                <Tabs preSelectedTabIndex={index}>
                                    <Tab title="Pending">
                                        <QuotationTab
                                            quotations={new_quotations}
                                        />
                                    </Tab>

                                    <Tab title={"Current"}>
                                        <QuotationTab quotations={quotations} />
                                    </Tab>
                                    <Tab title="Accepted">
                                        <QuotationTab
                                            quotations={accepted_quotations}
                                        />
                                    </Tab>
                                    <Tab title="Order Issued">
                                        <QuotationTab
                                            quotations={order_issued}
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

export default Quotations;
