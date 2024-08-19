import cx from "classnames";

interface LoadingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading: boolean;
}

export default function LoadingButton({
    loading,
    className,
    children,
    ...props
}: LoadingButtonProps) {
    const classNames = cx(
        "flex items-center",
        "focus:outline-none",
        "dark:bg-green-300",
        "dark:text-green-700",
        "hover:bg-green-800",
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
