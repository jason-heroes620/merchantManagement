import { Head, usePage } from "@inertiajs/react";
import { Order, PaginatedData } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import OrderTab from "@/Components/Tabs/OrderTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";

const Orders = ({ auth }) => {
    const { pending_payment, paid, failed, cancelled, type } = usePage<{
        pending_payment: PaginatedData<Order>;
        paid: PaginatedData<Order>;
        failed: PaginatedData<Order>;
        cancelled: PaginatedData<Order>;
        type: string;
    }>().props;

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
                                <Tabs defaultValue={type} className="w-full">
                                    <TabsList className="gap-4">
                                        <TabsTrigger value="pending">
                                            <div className="flex flex-row items-center gap-2">
                                                Pending
                                                {pending_payment.data.length >
                                                0 ? (
                                                    <Badge variant="destructive">
                                                        {pending_payment.total}
                                                    </Badge>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger value="paid">
                                            Paid
                                        </TabsTrigger>
                                        <TabsTrigger value="failed">
                                            Failed Payment
                                        </TabsTrigger>
                                        <TabsTrigger value="cancelled">
                                            Cancelled
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="pending">
                                        <OrderTab orders={pending_payment} />
                                    </TabsContent>
                                    <TabsContent value="paid">
                                        <OrderTab orders={paid} />
                                    </TabsContent>
                                    <TabsContent value="failed">
                                        <OrderTab orders={failed} />
                                    </TabsContent>
                                    <TabsContent value="cancelled">
                                        <OrderTab orders={cancelled} />
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

export default Orders;
