import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Merchant from "./Merchant";
import Admin from "./Admin";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import moment from "moment";

export default function Dashboard({ auth }: PageProps) {
    const {
        merchant,
        product,
        schools,
        quotations,
        orders,
        confirmed_current_month,
    } = usePage<{
        merchant;
        product;
        schools;
        quotations;
        orders;
        confirmed_current_month: any;
    }>().props;

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
                                <Admin
                                    merchant={merchant}
                                    product={product}
                                    schools={schools}
                                    quotations={quotations}
                                    orders={orders}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="py-4 px-4">
                            <span>This Month's Confirmed Bookings</span>
                        </div>
                        <div className="flex flex-row py-2 px-4">
                            {(confirmed_current_month &&
                                confirmed_current_month.length) > 0 &&
                                confirmed_current_month.map((c) => {
                                    return (
                                        <Card
                                            className={"border max-w-[200px]"}
                                            key={c.proposal_id}
                                        >
                                            <CardContent className="py-4">
                                                <div>
                                                    <span className="font-bold">
                                                        {c.school_name}
                                                    </span>
                                                </div>
                                                <div
                                                    id="content"
                                                    className="flex flex-row justify-between px-2 py py"
                                                >
                                                    <span className="text-sm font-semibold italic capitalize">
                                                        {moment(
                                                            c.proposal_date
                                                        ).format("D MMM")}
                                                    </span>
                                                    <span className="text-sm font-bold">
                                                        {c.qty_student} pax
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    {c.locations.map((l) => (
                                                        <span
                                                            className="line-clamp-1"
                                                            key={l}
                                                        >
                                                            {l}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
