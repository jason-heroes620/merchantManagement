import React from "react";
import dayjs from "dayjs";
import { Link } from "@inertiajs/react";
import { timeDisplay } from "@/utils/chatTimeDisplay";

const Room = ({ room }) => {
    return (
        <Link href={`/chats/${room.id}`}>
            <div className="py-4 bg-gray-200 rounded-md">
                <div className="flex flex-row">
                    <div className="flex px-4">
                        {!room.user.profile && (
                            <div className="flex w-[50px] h-[50px] rounded-[50%] bg-red-400">
                                <span className="m-auto font-bold ">
                                    {room.user.name
                                        .substring(0, 1)
                                        .toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex-col px-4">
                        <div className="flex flex-row justify-between">
                            <div style={{ fontWeight: "800" }}>
                                {room.user?.name}
                            </div>
                            <div className="text-muted">
                                {timeDisplay(room.message?.created_at)}
                            </div>
                        </div>
                        <span className="line-clamp-1">
                            {room.message.text}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Room;
