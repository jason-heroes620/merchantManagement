import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import Room from "@/Components/Chats/Room";

const ChatRooms = ({ auth }: PageProps) => {
    const { rooms } = usePage<{ rooms: any }>().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Chats
                </h2>
            }
        >
            <Head title="Chats" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="col-md-8">
                                <div className="card">
                                    <div className="card-header">Chats</div>
                                    <div
                                        className="card-body"
                                        style={{
                                            height: "500px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {rooms?.map((r) => {
                                            return (
                                                <div
                                                    className="py-2"
                                                    key={r.id}
                                                >
                                                    <Room room={r} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ChatRooms;
