import ProposalTab from "@/Components/Tabs/ProposalTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";

const Proposals = ({ auth, proposals, requestingOrder, type }: any) => {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Proposals
                    </h2>
                </div>
            }
        >
            <Head title="Proposals" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2"></div>
                            <div>
                                <Tabs defaultValue={type} className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="current">
                                            Current
                                        </TabsTrigger>
                                        <TabsTrigger value="requestingOrder">
                                            <div className="flex flex-row gap-2 items-center">
                                                Requesting Order
                                                {requestingOrder.data &&
                                                    requestingOrder.data
                                                        .length > 0 && (
                                                        <Badge variant="destructive">
                                                            {
                                                                requestingOrder.total
                                                            }
                                                        </Badge>
                                                    )}
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="current">
                                        <ProposalTab proposals={proposals} />
                                    </TabsContent>
                                    <TabsContent value="requestingOrder">
                                        <ProposalTab
                                            proposals={requestingOrder}
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

export default Proposals;
