import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Head } from "@inertiajs/react";
import { PaginatedData, Invoice } from "@/types";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import InvoiceTab from "@/Components/Tabs/InvoiceTab";

const Invoices = ({ auth }) => {
    const { invoices, paid_invoices, cancelled_invoices, type } = usePage<{
        invoices: PaginatedData<Invoice>;
        // paid_invoices: PaginatedData<Invoice>;
        // cancelled_invoices: PaginatedData<Invoice>;
        type: string;
    }>().props;

    const index = type === "Cancelled" ? 2 : type === "Paid" ? 1 : 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Invoices
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
                                {/* <Tabs preSelectedTabIndex={index}> */}
                                <Tab title="Current">
                                    <InvoiceTab invoices={invoices} />
                                </Tab>
                                {/* <Tab title={"Paid"}>
                                        <InvoiceTab invoices={paid_invoices} />
                                    </Tab> */}
                                {/* <Tab title={"Cancelled"}>
                                        <InvoiceTab
                                            invoices={cancelled_invoices}
                                        />
                                    </Tab> */}
                                {/* </Tabs> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Invoices;
