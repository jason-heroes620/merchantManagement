import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Merchant from "./Merchant";
import Admin from "./Admin";

export default function Dashboard({ auth }: PageProps) {
    const { merchant, product } = usePage<{}>().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div> */}
                        <div>
                            {auth.user.roles.find((m) => m === "merchant") && (
                                <Merchant product={product} />
                            )}

                            {auth.user.roles.find((m) => m === "admin") && (
                                <Admin product={product} merchant={merchant} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="py-4 px-4">
                            <h2>Sales Report</h2>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
