import { LabelHTMLAttributes } from "react";

export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={
                `block font-bold text-sm text-gray-800 dark:text-gray-300 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
