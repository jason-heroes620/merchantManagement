import cx from "classnames";

interface DangerButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading: boolean;
}

export default function DangerButton({
    loading,
    className,
    children,
    ...props
}: DangerButtonProps) {
    const classNames = cx(
        "flex items-center",
        "focus:outline-none",
        "dark:bg-red-300",
        "dark:text-red-700",
        "hover:bg-red-800",
        "hover:text-white",
        {
            "pointer-events-none bg-opacity-75 select-none": loading,
        },
        className
    );
    return (
        <button disabled={loading} className={classNames} {...props}>
            {loading && <div className="mr-2 btn-spinner" />}
            {children}
        </button>
    );
}
