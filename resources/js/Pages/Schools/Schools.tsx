import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import SchoolTab from "@/Components/Tabs/SchoolTab";
import { PaginatedData, School } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import SearchBar from "@/Components/SearchBar";

const Schools = ({ auth }) => {
    const { new_schools, schools, rejected_schools, type, search } = usePage<{
        new_schools: PaginatedData<School>;
        schools: PaginatedData<School>;
        rejected_schools: PaginatedData<School>;
        type: string;
        search: string;
    }>().props;

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
                            <div className="flex justify-end px-8 py-2">
                                <SearchBar link={"schools"} search={search} />
                            </div>
                            <div>
                                <Tabs defaultValue={type} className="w-full">
                                    <TabsList>
                                        <TabsTrigger
                                            value="pending"
                                            className="gap-2"
                                        >
                                            Pending
                                            <div className="flex flex-row gap-2 items-center">
                                                {new_schools.data &&
                                                    new_schools.data.length >
                                                        0 && (
                                                        <Badge variant="destructive">
                                                            {new_schools.total}
                                                        </Badge>
                                                    )}
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger value="current">
                                            Current
                                        </TabsTrigger>
                                        <TabsTrigger value="rejected">
                                            Rejected
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="pending">
                                        <SchoolTab schools={new_schools} />
                                    </TabsContent>
                                    <TabsContent value="current">
                                        <SchoolTab schools={schools} />
                                    </TabsContent>
                                    <TabsContent value="rejected">
                                        <SchoolTab schools={rejected_schools} />
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

export default Schools;
