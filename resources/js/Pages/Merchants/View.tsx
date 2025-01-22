import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import LoadingButton from "@/Components/Button/LoadingButton";
import DangerButton from "@/Components/Button/DangerButton";
import RichTextEditor from "@/Components/RichTextEditor";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import MerchantFileList from "@/Components/Merchant/MerchantFileList";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/Components/ui/button";

dayjs.extend(customParseFormat);

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

const View = ({ auth, flash }: any) => {
    const {
        merchant,
        types,
        merchant_description,
        merchant_files,
        merchant_logo,
    } = usePage<{
        merchant: any;
        types: [];
        merchant_description: any;
        merchant_logo: string;
    }>().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        merchant_name: merchant.merchant_name,
        person_in_charge: merchant.person_in_charge,
        merchant_phone: merchant.merchant_phone,
        merchant_email: merchant.merchant_email,
        merchant_description: merchant_description,
        id: merchant.id,
        web: merchant.web || "",
        facebook: merchant.facebook || "",
        instagram: merchant.instagram || "",
        merchant_type: merchant.merchant_type,
        location: merchant.location || "",
        merchant_logo: [],
        company_registration: merchant.company_registration || "",
        ic_no: merchant.ic_no || "",
        _method: "put",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (confirm("Confirm to update?")) {
            // NOTE: We are using POST method here, not PUT/PATCH. See comment above.
            post(route("merchant.update", merchant.id), {
                forceFormData: true,
                preserveState: false,
                method: "put",
            });
        }
    };

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        } else if (flash.message.failed) {
            toast.error(flash.message.failed);
        }
    }, [flash, merchant.status]);

    const handleMainFileUpload = (e) => {
        const files: File[] = Array.from(e.target.files || []);
        var canUpload = true;
        files.map((f: File) => {
            f.size > 1048576 ? (canUpload = false) : "";
        });
        if (canUpload) {
            setData("merchant_logo", [...e.target.files]);
        } else {
            alert("1 or more files exceed the upload limit.");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("merchants")}>Back</Link>
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Merchant Detail
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
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                            <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                <InputLabel
                                                    htmlFor="person_in_charge"
                                                    value="Person In Charge"
                                                />
                                            </div>
                                            <div className="flex md:col-span-5 lg:col-span-10">
                                                <TextInput
                                                    id="person_in_charge"
                                                    name="person_in_charge"
                                                    defaultValue={
                                                        data.person_in_charge
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData(
                                                            "person_in_charge",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                                <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                                    <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                        <InputLabel
                                                            htmlFor="images"
                                                            value="Company Logo"
                                                            className="pb-2"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col md:col-span-5 lg:col-span-10">
                                                        <input
                                                            type="file"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => {
                                                                handleMainFileUpload(
                                                                    e
                                                                );
                                                            }}
                                                        />
                                                        <small>
                                                            (supported formats
                                                            .png, .jpg. Image
                                                            should not be more
                                                            than 2 MB)
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                                    <div className="flex items-center md:col-span-1 lg:col-span-2"></div>
                                                    {merchant_logo && (
                                                        <div className="flex flex-row gap-4 py-2">
                                                            <img
                                                                src={
                                                                    merchant_logo
                                                                }
                                                                alt={
                                                                    merchant_logo
                                                                }
                                                                width={80}
                                                                height={"auto"}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                                <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                            <div>
                                                <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                                    <div className="flex items-center md:col-span-1 lg:col-span-2">
                                                        <InputLabel
                                                            htmlFor="icNo"
                                                            value="Identification No."
                                                        />
                                                    </div>
                                                    <div className="flex md:col-span-5 lg:col-span-10">
                                                        <TextInput
                                                            id="icNo"
                                                            name="ic_no"
                                                            value={data.ic_no}
                                                            className="mt-1 block w-full"
                                                            autoComplete="icNo"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "ic_no",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                        <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
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
                                                    merchant_id={merchant.id}
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
                                                    <div className="flex justify-end flex-row">
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
                                                                                merchant.id
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
                                                                                merchant.id
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
