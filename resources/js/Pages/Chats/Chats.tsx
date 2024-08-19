import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Chat, PaginatedData } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState, FormEventHandler } from "react";
import Message from "@/Components/Message/Message.jsx";
import MessageInput from "@/Components/Message/MessageInput.jsx";

// const REVERB_APP_ID = 965717;
// const REVERB_APP_KEY = "v3q9f4wcmt91fpdkyxjq";
// const REVERB_APP_SECRET = "3dasp8g8ilyv6xd3n8fh";
// const REVERB_HOST = "localhost";
// const REVERB_PORT = 8080;
// const REVERB_SCHEME = "http";

const Chats = ({ auth }: PageProps) => {
    const { chats } = usePage<{ chats: any }>().props;
    const { datas, links } = chats;
    const [allMessages, setAllMessages] = useState(chats);

    const { data, setData, post, processing, errors, reset } = useForm({
        text: "",
    });

    const messageRequest = () => {
        try {
            post(route("create.message"));
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const sendMessage: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.text.trim() === "") {
            alert("Please enter a message!");
            return;
        }

        messageRequest();
    };

    // window.Echo.channel("chat-channel").listen("message.sent", (newMessage) => {
    //     console.log("New message:", newMessage.message);
    // });

    useEffect(() => {
        try {
            window.Echo.channel(`chat.${auth.user.id}`).listen(
                "NewMessage",
                (newMessage: Chat) => {
                    setAllMessages((prevAllMessages: any) => [
                        ...prevAllMessages,
                        newMessage.message,
                    ]);
                }
            );
        } catch (e) {
            console.log("error =>", e);
        }
        return () => {
            window.Echo.leave(`chat.${auth.user.id}`);
        };
    }, []);

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
                                    <div className="card-header">Chat Box</div>
                                    <div
                                        className="card-body"
                                        style={{
                                            height: "500px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {allMessages?.map((message: Chat) => (
                                            <Message
                                                key={message.id}
                                                userId={message.user_id}
                                                message={message}
                                            />
                                        ))}
                                        {/* <span ref={scroll}></span> */}
                                    </div>
                                    <div className="card-footer">
                                        <MessageInput
                                            sendMessage={sendMessage}
                                            setData={setData}
                                        />
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

export default Chats;
