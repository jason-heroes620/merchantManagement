import { Head, usePage } from "@inertiajs/react";
import { Order, PaginatedData } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import OrderTab from "@/Components/Tabs/OrderTab";

const Orders = ({ auth }) => {
    const { pending_payment, paid, type } = usePage<{
        pending_payment: PaginatedData<Order>;
        paid: PaginatedData<Order>;
        type: string;
    }>().props;

    const index = type === "Paid" ? 1 : 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Orders
                    </h2>
                </div>
            }
        >
            <Head title="Orders" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2"></div>
                            <div>
                                <Tabs preSelectedTabIndex={index}>
                                    <Tab title="Pending Payment">
                                        <OrderTab orders={pending_payment} />
                                    </Tab>

                                    <Tab title={"Paid"}>
                                        <OrderTab orders={paid} />
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

export default Orders;
