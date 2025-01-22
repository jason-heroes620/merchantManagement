import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import SchoolTab from "@/Components/Tabs/SchoolTab";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import { PaginatedData, School } from "@/types";

const Schools = ({ auth }) => {
    const { new_schools, schools, rejected_schools, type } = usePage<{
        new_schools: PaginatedData<School>;
        schools: PaginatedData<School>;
        rejected_schools: PaginatedData<School>;
        type: string;
    }>().props;
    const index = type === "Current" ? 1 : type === "Rejected" ? 2 : 0;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Schools
                </h2>
            }
        >
            <Head title="Schools" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2"></div>
                            <div>
                                <Tabs preSelectedTabIndex={index}>
                                    <Tab title="Pending">
                                        <SchoolTab schools={new_schools} />
                                    </Tab>

                                    <Tab title={"Current"}>
                                        <SchoolTab schools={schools} />
                                    </Tab>
                                    <Tab title="Rejected">
                                        <SchoolTab schools={rejected_schools} />
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

export default Schools;
