import { useState, PropsWithChildren, ReactNode } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, router } from "@inertiajs/react";
import { User } from "@/types";
import Loading from "@/Components/Loading";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [loading, setLoading] = useState(false);

    router.on("start", () => {
        setLoading(true);
    });

    router.on("finish", (event) => {
        if (event.detail.visit.completed) setLoading(false);
    });

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo
                                        // className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200"
                                        size={"106"}
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                                {user.roles.find((u) => u === "admin") && (
                                    <NavLink
                                        href={route("merchants")}
                                        active={route().current("merchants")}
                                    >
                                        Merchants
                                    </NavLink>
                                )}
                                {/* <NavLink
                                    href={route("products")}
                                    active={route().current("products")}
                                >
                                    Products
                                </NavLink> */}
                                <div className="hidden sm:flex sm:items-center sm:ms-6">
                                    <div className="ms-3 relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Products
                                                        <svg
                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route(
                                                        "products",
                                                        "locations"
                                                    )}
                                                >
                                                    Location
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "products",
                                                        "supplies"
                                                    )}
                                                >
                                                    School Supplies
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                                {user.roles.find((u) => u === "merchant") && (
                                    <NavLink
                                        href={route("chatrooms")}
                                        active={route().current("chatrooms")}
                                    >
                                        Chats
                                    </NavLink>
                                )}
                                {user.roles.find((u) => u === "admin") && (
                                    <>
                                        <NavLink
                                            href={route("schools")}
                                            active={route().current("schools")}
                                        >
                                            Schools
                                        </NavLink>
                                        <NavLink
                                            href={route("proposals")}
                                            active={route().current(
                                                "proposals"
                                            )}
                                        >
                                            Proposals
                                        </NavLink>
                                        <NavLink
                                            href={route("orders")}
                                            active={route().current("orders")}
                                        >
                                            Orders
                                        </NavLink>
                                        <NavLink
                                            href={route("invoices")}
                                            active={route().current("invoices")}
                                        >
                                            Invoices
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {user.roles.find((u) => u === "admin") && (
                            <ResponsiveNavLink
                                href={route("merchants")}
                                active={route().current("merchants")}
                            >
                                Merchants
                            </ResponsiveNavLink>
                        )}
                        {/* <ResponsiveNavLink
                            href={route("products")}
                            active={route().current("products")}
                        >
                            Products
                        </ResponsiveNavLink> */}
                        <div>
                            <div className="px-4">
                                <span>Products</span>
                            </div>
                            <div className="px-6">
                                <ResponsiveNavLink
                                    href={route("products", {
                                        category: "locations",
                                    })}
                                    active={route().current(
                                        "products.locations"
                                    )}
                                >
                                    Location
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("products", {
                                        category: "supplies",
                                    })}
                                    active={route().current(
                                        "products.supplies"
                                    )}
                                >
                                    School Supplies
                                </ResponsiveNavLink>
                            </div>
                        </div>
                        {user.roles.find((u) => u === "admin") && (
                            <>
                                <ResponsiveNavLink
                                    href={route("schools")}
                                    active={route().current("schools")}
                                >
                                    Schools
                                </ResponsiveNavLink>
                                {/* <NavLink
                                            href={route("quotations")}
                                            active={route().current(
                                                "quotations"
                                            )}
                                        >
                                            Quotations
                                        </NavLink> */}
                                <ResponsiveNavLink
                                    href={route("proposals")}
                                    active={route().current("proposals")}
                                >
                                    Proposals
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("orders")}
                                    active={route().current("orders")}
                                >
                                    Orders
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("invoices")}
                                    active={route().current("invoices")}
                                >
                                    Invoices
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                {loading ? <Loading loading={loading} /> : ""}
                {children}
            </main>
        </div>
    );
}
