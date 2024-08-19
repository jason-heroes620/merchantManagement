import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    InputHTMLAttributes,
} from "react";

export default forwardRef(function TextArea(
    {
        className = "",
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLTextAreaElement> & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    return (
        <textarea
            className={
                "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 " +
                className
            }
            {...props}
            ref={localRef}
        ></textarea>
    );
});
