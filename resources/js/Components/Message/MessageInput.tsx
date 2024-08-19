import { useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import { method } from "lodash";
import { PageProps } from "@/types";

const MessageInput = ({ sendMessage, setData }: any) => {
    return (
        <div className="input-group">
            <TextInput
                id="text"
                name="text"
                onChange={(e) => setData("text", e.target.value)}
                autoComplete="off"
                type="text"
                className="form-control"
                placeholder="Message..."
            />
            <div className="input-group-append">
                <button
                    onClick={(e) => sendMessage(e)}
                    className="btn btn-primary"
                    type="button"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
