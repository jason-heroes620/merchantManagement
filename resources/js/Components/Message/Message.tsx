import { Chat } from "@/types";
import {
    MinChatUiProvider,
    MainContainer,
    MessageInput,
    MessageContainer,
    MessageList,
    MessageHeader,
} from "@minchat/react-chat-ui";

const Message = ({ me, userId, message }: any) => {
    return (
        // <div
        //     key={message.id}
        //     className={`row ${
        //         userId === message.user_id ? "" : "justify-content-end"
        //     }`}
        // >
        //     <div className="col-md-6 py-1">
        //         {/* <small className="text-muted">
        //             <strong>{message.user?.name}</strong>
        //         </small> */}
        //         {/* <small className="text-muted float-right">{message.time}</small> */}
        //         <div
        //             className={`flex  max-w[50%]  alert alert-${
        //                 userId === message.user_id ? "primary" : "secondary"
        //             } ${me === userId ? "justify-end bg-red-200" : ""}`}
        //             role="alert"
        //         >
        //             <span className={`flex text-ellipsis py-2 px-2`}>
        //                 {message.message}
        //             </span>
        //         </div>
        //     </div>
        // </div>
        <MinChatUiProvider theme="#6ea9d7">
            <MainContainer style={{ height: "100vh" }}>
                <MessageContainer>
                    <MessageHeader />
                    <MessageList
                        currentUserId="dan"
                        messages={[
                            {
                                text: "Hello",
                                user: {
                                    id: "mark",
                                    name: "Markus",
                                },
                            },
                        ]}
                    />
                    <MessageInput
                        placeholder="Type message here"
                        showSendButton={true}
                    />
                </MessageContainer>
            </MainContainer>
        </MinChatUiProvider>
    );
};

export default Message;
