import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps, Merchant } from "@/types";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import LoadingButton from "@/Components/Button/LoadingButton";
import RichTextEditor from "@/Components/RichTextEditor";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";

const MerchantReview = ({ auth, flash }: PageProps) => {
    const [merchantAbout, setMerchantAbout] = useState("");
    const { merchant, types, merchant_description } = usePage<{
        merchant: any;
        types: [];
        merchant_description: any;
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: merchant.merchant.merchant_name,
        phone: merchant.merchant.merchant_phone,
        email: merchant.merchant.merchant_email,
        merchant_description: merchant_description,
        merchant_type: merchant.merchant.merchant_type,
        id: merchant.merchant.id,
        web: merchant.web,
        facebook: merchant.facebook,
        instagram: merchant.instagram,
        _method: "put",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (confirm("Confirm to update?")) {
            e.preventDefault();

            // NOTE: We are using POST method here, not PUT/PATCH. See comment above.
            post(route("merchant.update", { id: merchant.merchant_id }));
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
                                        {merchant.merchant.merchant_name}
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
                                                    value={
                                                        merchant.merchant
                                                            .merchant_name
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="merchant_name"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="py-2">
                                                <InputLabel
                                                    htmlFor="Type"
                                                    value="Type"
                                                />
                                                <SelectInput
                                                    options={types}
                                                    onChange={(e) => {
                                                        setData(
                                                            "merchant_type",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
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
                                                        merchant.merchant
                                                            .merchant_email
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="email"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
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
                                                        merchant.merchant
                                                            .merchant_phone
                                                    }
                                                    maxLength={14}
                                                    className="mt-1 block w-full"
                                                    autoComplete="phone"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
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
                                                    value={merchant.web}
                                                    className="mt-1 block w-full"
                                                    autoComplete="website"
                                                    isFocused={true}
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
                                                    value={merchant.facebook}
                                                    className="mt-1 block w-full"
                                                    autoComplete="facebook"
                                                    isFocused={true}
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
                                                    value={merchant.instagram}
                                                    className="mt-1 block w-full"
                                                    autoComplete="instagram"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "instagram",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="py-4">
                                            <div className="flex items-center px-8 py-2 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                                <LoadingButton
                                                    loading={processing}
                                                    type="submit"
                                                    className="ml-auto btn-indigo border py-4 px-6 rounded-md "
                                                >
                                                    Update Merchant
                                                </LoadingButton>
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

export default MerchantReview;
