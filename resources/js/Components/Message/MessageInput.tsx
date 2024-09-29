import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";

const MessageInput = ({ placeholder, sendMessage, setData }: any) => {
    return (
        <div className="input-group flex flex-row py-4">
            <div className="flex-1 w-full">
                <TextArea
                    id="text"
                    name="text"
                    onChange={(e) => setData("text", e.target.value)}
                    autoComplete="off"
                    type="text"
                    className="form-control w-full"
                    placeholder={placeholder}
                />
            </div>
            <div className="flex items-center input-group-append px-4">
                <button
                    onClick={(e) => sendMessage(e)}
                    className={`text-sm inline-flex items-center px-4 py-2 bg-green-600 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-white dark:text-gray-800 uppercase tracking-widest hover:bg-green-900 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 `}
                    type="button"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
