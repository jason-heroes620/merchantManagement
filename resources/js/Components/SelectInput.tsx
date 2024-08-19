import { ComponentProps } from "react";

interface SelectInputProps extends ComponentProps<"select"> {
    error?: string;
    options: { value: string; label: string }[];
    selected?: string;
}

export default function SelectInput({
    name,
    error,
    className,
    options = [],
    selected,
    ...props
}: SelectInputProps) {
    console.log("selected => ", selected);
    return (
        <select
            id={name}
            name={name}
            {...props}
            value={selected}
            className={`form-select w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 border-gray-300 rounded ${
                error
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : ""
            }`}
        >
            <option key={0} value="0">
                Choose
            </option>
            {options?.map(({ value, label }, index) => (
                <option key={index} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}