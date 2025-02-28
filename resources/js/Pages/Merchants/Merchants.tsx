import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps, Merchant } from "@/types";
import { PaginatedData } from "@/types";
import MerchantTab from "@/Components/Tabs/MerchantTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

const Merchants = ({ auth }: PageProps) => {
    const { merchants, pendingMerchants, rejectedMerchants, type } = usePage<{
        merchants: PaginatedData<Merchant>;
        pendingMerchants: PaginatedData<Merchant>;
        rejectedMerchants: PaginatedData<Merchant>;
        type: string;
    }>().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Merchants
                </h2>
            }
        >
            <Head title="Merchants" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="py-4 border-1 border-gray-100">
                                <Tabs defaultValue={type} className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="pending">
                                            Pending
                                        </TabsTrigger>
                                        <TabsTrigger value="current">
                                            Current
                                        </TabsTrigger>
                                        <TabsTrigger value="rejected">
                                            Rejected
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="pending">
                                        <MerchantTab
                                            merchants={pendingMerchants}
                                        />
                                    </TabsContent>
                                    <TabsContent value="current">
                                        <MerchantTab merchants={merchants} />
                                    </TabsContent>
                                    <TabsContent value="rejected">
                                        <MerchantTab
                                            merchants={rejectedMerchants}
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

export default Merchants;
