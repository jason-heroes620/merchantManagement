import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

import { PaginatedData, Event } from "@/types";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import EventTab from "@/Components/Tabs/EventTab";

const Events = ({ auth }: PageProps) => {
    const { newEvents, events, role } = usePage<{
        newEvents: PaginatedData<Event>;
        events: PaginatedData<Event>;
    }>().props;
    console.log(events);
    console.log(newEvents);
    console.log("role => ", role);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Events
                </h2>
            }
        >
            <Head title="Events" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end px-8 py-2">
                                <Link
                                    href={route("events.create")}
                                    type="button"
                                    className="py-4 px-6 border bg-green-600 hover:bg-green-800 text-white rounded-md"
                                >
                                    Create Event
                                </Link>
                            </div>
                            <div>
                                <Tabs>
                                    <Tab title="Pending Events">
                                        <EventTab events={newEvents} />
                                    </Tab>

                                    <Tab
                                        title={
                                            role === "admin"
                                                ? "Events"
                                                : "My Events"
                                        }
                                    >
                                        <EventTab events={events} />
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

export default Events;
