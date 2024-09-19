import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Chat, PaginatedData } from "@/types";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState, FormEventHandler } from "react";
import MessageInput from "@/Components/Message/MessageInput.jsx";
import * as Ably from "ably";
import {
    MinChatUiProvider,
    MainContainer,
    MessageContainer,
    MessageList,
    MessageHeader,
} from "@minchat/react-chat-ui";

var ably = new Ably.Realtime({
    key: import.meta.env.VITE_ABLY_KEY,
});

const Chats = ({ auth }: PageProps) => {
    const { chats, receiver } = usePage<{ chats: any; receiver: any }>().props;
    const { datas, links } = chats;
    const [allMessages, setAllMessages] = useState(chats);
    const { data, setData, post, processing, errors, reset } = useForm({
        text: "",
        roomId: receiver.id,
    });
    const channel = ably.channels.get("message");
    const messageRequest = () => {
        try {
            console.log("data= >", data);

            // setData("text", "");
            post(route("create.message"), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    reset();
                },
            });
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (data.text.trim() === "") {
            alert("Please enter a message!");
            return;
        }

        messageRequest();
    };

    const subscribe = async () => {
        channel.subscribe("AblyMessageEvent", (message) => {
            console.log("subscribed To Channel => ", message.data);
            setAllMessages((prevAllMessages: any) => [
                ...prevAllMessages,
                JSON.parse(message.data),
            ]);
        });
    };
    useEffect(() => {
        console.log("data ->", receiver);
        try {
            subscribe();
        } catch (e) {
            console.log("error =>", e);
        }
        return () => {
            // pusher.unsubscribe(`chat.${auth.user.id}`);
            channel.unsubscribe();
            window.Echo.leave("message");
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Link
                            href={route("chatrooms")}
                            onClick={() => channel.unsubscribe("message")}
                            className="text-indigo-600 hover:text-white border rounded-md hover:bg-red-800 py-2 px-4"
                        >
                            Back
                        </Link>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"></h2>
                </div>
            }
        >
            <Head title="Chats" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="col-md-8">
                                <div className="card">
                                    {/* <div className="card-header bg-gray-100 py-4">
                                        <div className="px-4">
                                            {receiver.user?.name}
                                        </div>
                                    </div> */}
                                    <div className="card-body py-4 px-4">
                                        <MinChatUiProvider theme="#6ea9d7">
                                            <MainContainer
                                                style={{ height: "100vh" }}
                                            >
                                                <MessageContainer>
                                                    <MessageHeader
                                                        showBack={false}
                                                        mobileView={true}
                                                    >
                                                        {receiver?.user.name}
                                                    </MessageHeader>
                                                    <MessageList
                                                        currentUserId={auth.user.id.toString()}
                                                        messages={allMessages}
                                                        mobileView={true}
                                                    />
                                                    <MessageInput
                                                        placeholder="Type message here"
                                                        sendMessage={
                                                            sendMessage
                                                        }
                                                        setData={setData}
                                                    />
                                                </MessageContainer>
                                            </MainContainer>
                                        </MinChatUiProvider>
                                        {/* {allMessages?.map((message: Chat) => (
                                            <Message
                                                key={message.id}
                                                me={auth.user.id}
                                                userId={message.user_id}
                                                message={message}
                                            />
                                        ))} */}
                                        {/* <span ref={scroll}></span> */}
                                    </div>
                                </div>
                                {/* <div className="card-footer flex-1 item-end">
                                    <MessageInput
                                        sendMessage={sendMessage}
                                        setData={setData}
                                    />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Chats;
