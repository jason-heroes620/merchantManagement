import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps, Merchant } from "@/types";
import { PaginatedData } from "@/types";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import MerchantTab from "@/Components/Tabs/MerchantTab";

const Merchants = ({ auth }: PageProps) => {
    const { merchants, pendingMerchants } = usePage<{
        merchants: PaginatedData<Merchant>;
        pendingMerchants: PaginatedData<Merchant>;
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
                                <Tabs preSelectedTabIndex={0}>
                                    <Tab title="Pending Merchants">
                                        <MerchantTab
                                            merchants={pendingMerchants}
                                        />
                                    </Tab>

                                    <Tab title={"Merchants"}>
                                        <MerchantTab merchants={merchants} />
                                    </Tab>
                                </Tabs>

                                {/* <div>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="dark:text-white">
                                                    Merchant
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div> */}
                            </div>
                            {/* <div className="pt-4">
                                <div>
                                    <h2 className="text-lg dark:text-white font-semibold">
                                        Merchant List
                                    </h2>
                                </div>
                                <div>
                                    <Table
                                        columns={[
                                            {
                                                label: "Name",
                                                name: "name",
                                                renderCell: (row) => (
                                                    <>
                                                        <>{row.merchant_name}</>
                                                        {row.deleted_at && (
                                                            <Trash2
                                                                size={16}
                                                                className="ml-2 text-gray-400"
                                                            />
                                                        )}
                                                    </>
                                                ),
                                            },
                                            {
                                                label: "Email",
                                                name: "email",
                                                renderCell: (row) => (
                                                    <>
                                                        <>
                                                            {row.merchant_email}
                                                        </>
                                                    </>
                                                ),
                                            },
                                            {
                                                label: "Contact No.",
                                                name: "phone",
                                                colSpan: 2,
                                                renderCell: (row) => (
                                                    <>
                                                        <>
                                                            {row.merchant_phone}
                                                        </>
                                                    </>
                                                ),
                                            },
                                        ]}
                                        rows={data}
                                        getRowDetailsUrl={(row) =>
                                            route("merchants.view", row.id)
                                        }
                                    />
                                    <Pagination links={links} />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Merchants;
