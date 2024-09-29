import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { PageProps, Merchant } from "@/types";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import LoadingButton from "@/Components/Button/LoadingButton";
import DangerButton from "@/Components/Button/DangerButton";
import RichTextEditor from "@/Components/RichTextEditor";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import MerchantFileList from "@/Components/Merchant/MerchantFileList";

import "react-toastify/dist/ReactToastify.css";

const View = ({ auth, flash }: any) => {
    const [merchantAbout, setMerchantAbout] = useState("");
    const { merchant, types, merchant_description, merchant_files } = usePage<{
        merchant: any;
        types: [];
        merchant_description: any;
    }>().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        merchant_name: merchant.merchant_name,
        merchant_phone: merchant.merchant_phone,
        merchant_email: merchant.merchant_email,
        merchant_description: merchant_description,
        id: merchant.merchant_id,
        web: merchant.web || "",
        facebook: merchant.facebook || "",
        instagram: merchant.instagram || "",
        merchant_type: merchant.merchant_type,
        location: merchant.location || "",
        company_registration: merchant.company_registration || "",
        _method: "put",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (confirm("Confirm to update?")) {
            e.preventDefault();

            // NOTE: We are using POST method here, not PUT/PATCH. See comment above.
            put(route("merchant.update", merchant.merchant_id));
        }
    };

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Link
                            href={route("merchants")}
                            className="text-indigo-600 hover:text-white border rounded-md hover:bg-red-800 py-2 px-4"
                        >
                            Back
                        </Link>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Merchant
                    </h2>
                </div>
            }
        >
            <Head title="Merchants" />
            <ToastContainer limit={3} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div>
                                <div>
                                    <h3 className="text-lg font-semibold dark:text-white">
                                        {merchant.merchant_name}
                                    </h3>
                                </div>
                                <div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="py-4"
                                    >
                                        <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="merchant_name"
                                                    value="Name"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="merchant_name"
                                                    name="merchant_name"
                                                    defaultValue={
                                                        data.merchant_name
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="merchant_name"
                                                    onChange={(e) =>
                                                        setData(
                                                            "merchant_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="merchantType"
                                                    value="Merchant Type"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <SelectInput
                                                    options={types}
                                                    selected={
                                                        data.merchant_type
                                                    }
                                                    onChange={(e) => {
                                                        setData(
                                                            "merchant_type",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="merchant_email"
                                                    value="Email"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={
                                                        data.merchant_email
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="email"
                                                    onChange={(e) =>
                                                        setData(
                                                            "merchant_email",
                                                            e.target.value
                                                        )
                                                    }
                                                    // required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="merchant_phone"
                                                    value="Phone"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    defaultValue={
                                                        data.merchant_phone
                                                    }
                                                    maxLength={14}
                                                    className="mt-1 block w-full"
                                                    autoComplete="phone"
                                                    onChange={(e) =>
                                                        setData(
                                                            "merchant_phone",
                                                            e.target.value
                                                        )
                                                    }
                                                    // required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-start md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="merchant_description"
                                                    value="About"
                                                />
                                            </div>
                                            <div className="md:col-span-5 lg:col-span-10">
                                                <RichTextEditor
                                                    value={merchant_description}
                                                    onChange={setData}
                                                    contentFor={
                                                        "merchant_description"
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {merchant.type === "learningCenter" ? (
                                            <div>
                                                <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                                    <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                        <InputLabel
                                                            htmlFor="location"
                                                            value="Location"
                                                        />
                                                    </div>
                                                    <div className="flex md:col-span-5 lg:col-span-10">
                                                        <TextInput
                                                            id="location"
                                                            name="location"
                                                            value={
                                                                data.location
                                                            }
                                                            className="mt-1 block w-full"
                                                            autoComplete="location"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "location",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                                    <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                        <InputLabel
                                                            htmlFor="companyRegistration"
                                                            value="Company Registration No."
                                                        />
                                                    </div>
                                                    <div className="flex md:col-span-5 lg:col-span-10">
                                                        <TextInput
                                                            id="companyRegistration"
                                                            name="companyRegistration"
                                                            value={
                                                                data.company_registration
                                                            }
                                                            className="mt-1 block w-full"
                                                            autoComplete="companyRegistration"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "company_registration",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="website"
                                                    value="Web Site"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="website"
                                                    name="website"
                                                    type="url"
                                                    value={data.web}
                                                    className="mt-1 block w-full"
                                                    autoComplete="website"
                                                    onChange={(e) =>
                                                        setData(
                                                            "web",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="facebook"
                                                    value="Facebook"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="facebook"
                                                    name="facebook"
                                                    value={data.facebook}
                                                    className="mt-1 block w-full"
                                                    autoComplete="facebook"
                                                    onChange={(e) =>
                                                        setData(
                                                            "facebook",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="instagram"
                                                    value="Instagram"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="instagram"
                                                    name="instagram"
                                                    value={data.instagram}
                                                    className="mt-1 block w-full"
                                                    autoComplete="instagram"
                                                    onChange={(e) =>
                                                        setData(
                                                            "instagram",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {merchant.type === "learningCenter" ? (
                                            <div>
                                                <MerchantFileList
                                                    data={merchant_files}
                                                />
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="py-4">
                                            <div className="flex justify-end flex-col md:flex-row">
                                                <div className="flex items-center px-4 py-2 bborder-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                                    <LoadingButton
                                                        loading={processing}
                                                        type="submit"
                                                        className="ml-auto border py-2 px-4 rounded-md text-sm"
                                                    >
                                                        Update
                                                    </LoadingButton>
                                                </div>
                                                {merchant.status === 1 ? (
                                                    <div className="flex justify-end flex-col md:flex-row">
                                                        <div className="flex items-center px-4 py-2 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                                            <DangerButton
                                                                loading={
                                                                    processing
                                                                }
                                                                type="button"
                                                                className="ml-auto border py-2 px-4 rounded-md text-sm"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            "Confirm to reject merchant?"
                                                                        )
                                                                    ) {
                                                                        post(
                                                                            route(
                                                                                "merchant.reject",
                                                                                merchant.merchant_id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                Reject
                                                            </DangerButton>
                                                        </div>
                                                        <div className="flex items-center px-4 py-2 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                                            <LoadingButton
                                                                loading={
                                                                    processing
                                                                }
                                                                type="button"
                                                                className="ml-auto border py-2 px-4 rounded-md text-sm"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            "Confirm to approve merchant?"
                                                                        )
                                                                    ) {
                                                                        put(
                                                                            route(
                                                                                "merchant.approve",
                                                                                merchant.merchant_id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                Approve
                                                            </LoadingButton>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
