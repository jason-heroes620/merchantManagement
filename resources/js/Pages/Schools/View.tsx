import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect, FormEventHandler } from "react";
import { School } from "@/types";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import States from "@/Components/states.json";
import InputError from "@/Components/InputError";
import { useObjectUrls } from "@/utils/getObjectUrls";
import { Button } from "@/Components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const states = States.sort((a, b) => (a > b ? 1 : -1)).map((s) => {
    return { label: s, value: s };
});

const View = ({ auth, flash, previousUrl }: any) => {
    const { school, school_logo } = usePage<{
        school: School;
        school_logo: any;
    }>().props;
    const { toast } = useToast();
    const { data, setData, post, put, processing, errors, reset } = useForm({
        school_name: school.school_name,
        address_1: school.address_1,
        address_2: school.address_2,
        address_3: school.address_3 || "",
        city: school.city || "",
        postcode: school.postcode || "",
        state: school.state || "",
        contact_person: school.contact_person,
        email: school.email,
        contact_no: school.contact_no || "",
        mobile_no: school.mobile_no || "",
        school_logo: school_logo,
        school_status: school.school_status,
        google_place_name: school.google_place_name || "",
    });
    const [logo, setLogo] = useState<File>();
    const getObjectUrl = useObjectUrls();

    const handleMainFileUpload = (e) => {
        const files: File = e.target.files[0];
        var canUpload = true;
        files.size > 1048576 ? (canUpload = false) : "";
        if (canUpload) {
            setLogo(files);
            setData("school_logo", e.target.files[0]);
        } else {
            alert("1 or more files exceed the upload limit.");
        }
    };

    const [open, setOpen] = useState(false);
    const [openReject, setOpenReject] = useState(false);

    const handleApprove = () => {
        axios.put(route("school.approve", school.school_id)).then((resp) => {
            if (resp.data.success) {
                toast({
                    variant: "default",
                    description: resp.data.success,
                });
            } else {
                toast({
                    variant: "destructive",
                    description: resp.data.error,
                });
            }
        });
    };

    const handleReject = () => {
        axios.put(route("school.reject", school.school_id)).then((resp) => {
            if (resp.data.success) {
                toast({
                    variant: "default",
                    description: resp.data.success,
                });
            } else {
                toast({
                    variant: "destructive",
                    description: resp.data.error,
                });
            }
        });
    };
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("school.update", school.school_id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    variant: "default",
                    description: "School information updated",
                });
            },
            onError: (errors) => {
                ({
                    variant: "desctructive",
                    description: "School information update failed",
                });
            },
        });
    };

    useEffect(() => {
        if (flash.message.success) {
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Button
                            variant="destructive"
                            // onClick={() => router.visit(previousUrl.toString())}
                            onClick={() => router.visit(route("schools"))}
                        >
                            Back
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {school.school_name}
                    </h2>
                </div>
            }
        >
            <Head title="School" />
            {/* <ToastContainer limit={3} /> */}
            <Toaster />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="py-4">
                                <div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="school_name"
                                                value="School"
                                            />
                                        </div>
                                        <div className="flex md:col-span-5 lg:col-span-10">
                                            <TextInput
                                                id="school"
                                                name="school_name"
                                                type="text"
                                                value={data.school_name}
                                                className="mt-1 block w-full"
                                                autoComplete="school_name"
                                                onChange={(e) =>
                                                    setData(
                                                        "school_name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                maxLength={150}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.school_name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="address_1"
                                                value="Address 1"
                                            />
                                        </div>
                                        <div className="flex md:col-span-5 lg:col-span-10">
                                            <TextInput
                                                id="address_1"
                                                name="address_1"
                                                type="text"
                                                value={data.address_1}
                                                className="mt-1 block w-full"
                                                autoComplete="address_1"
                                                onChange={(e) =>
                                                    setData(
                                                        "address_1",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                maxLength={100}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.address_1}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="address_2"
                                                value="Address 2"
                                            />
                                        </div>
                                        <div className="flex md:col-span-5 lg:col-span-10">
                                            <TextInput
                                                id="address_2"
                                                name="address_2"
                                                type="text"
                                                value={data.address_2}
                                                className="mt-1 block w-full"
                                                autoComplete="address_2"
                                                onChange={(e) =>
                                                    setData(
                                                        "address_2",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={100}
                                                required
                                            />
                                        </div>
                                        <InputError
                                            message={errors.address_2}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="address_3"
                                                value="Address 3"
                                            />
                                        </div>
                                        <div className="flex md:col-span-5 lg:col-span-10">
                                            <TextInput
                                                id="address_3"
                                                name="address_3"
                                                type="text"
                                                value={data.address_3}
                                                className="mt-1 block w-full"
                                                autoComplete="address_3"
                                                onChange={(e) =>
                                                    setData(
                                                        "address_3",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={100}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense md:gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="city"
                                                value="City"
                                            />
                                        </div>
                                        <div className="flex md:col-span-2 lg:col-span-4">
                                            <TextInput
                                                id="city"
                                                name="city"
                                                type="text"
                                                value={data.city}
                                                className="mt-1 block w-full"
                                                autoComplete="city"
                                                onChange={(e) =>
                                                    setData(
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={100}
                                                required
                                            />
                                        </div>
                                        <InputError
                                            message={errors.city}
                                            className="mt-2"
                                        />
                                        <div className="flex pt-4 md:pt-1 items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="postcode"
                                                value="Postcode"
                                            />
                                        </div>
                                        <div className="flex md:col-span-2 lg:col-span-4">
                                            <TextInput
                                                id="postcode"
                                                name="postcode"
                                                type="text"
                                                value={data.postcode}
                                                className="mt-1 block w-full"
                                                autoComplete="postcode"
                                                onChange={(e) =>
                                                    setData(
                                                        "postcode",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={12}
                                                required
                                            />
                                        </div>
                                        <InputError
                                            message={errors.postcode}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="state"
                                                value="State"
                                            />
                                        </div>
                                        <div className="flex md:col-span-5 lg:col-span-10">
                                            <SelectInput
                                                options={states}
                                                selected={data.state}
                                                onChange={(e) => {
                                                    setData(
                                                        "state",
                                                        e.target.value
                                                    );
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="email"
                                                value="Email"
                                            />
                                        </div>
                                        <div className="flex md:col-span-5 lg:col-span-10">
                                            <TextInput
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={data.email}
                                                className="mt-1 block w-full"
                                                autoComplete="email"
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                maxLength={100}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense md:gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="contact_no"
                                                value="Contact No."
                                            />
                                        </div>
                                        <div className="flex md:col-span-2 lg:col-span-4">
                                            <TextInput
                                                id="contact_no"
                                                name="contact_no"
                                                type="text"
                                                value={data.contact_no}
                                                className="mt-1 block w-full"
                                                autoComplete="contact_no"
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_no",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={20}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.contact_no}
                                            className="mt-2"
                                        />
                                        <div className="flex pt-4 md:pt-1 items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="mobile_no"
                                                value="Mobile No."
                                            />
                                        </div>
                                        <div className="flex md:col-span-2 lg:col-span-4">
                                            <TextInput
                                                id="mobile_no"
                                                name="mobile_no"
                                                type="tel"
                                                value={data.mobile_no}
                                                className="mt-1 block w-full"
                                                autoComplete="mobile_no"
                                                onChange={(e) =>
                                                    setData(
                                                        "mobile_no",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={20}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.mobile_no}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                        <div className="flex items-center md:col-span-1 lg:col-span-2">
                                            <InputLabel
                                                htmlFor="images"
                                                value="School Logo"
                                            />
                                        </div>
                                        {school_logo ? (
                                            <div className="flex w-32 h-32 justify-center items-center px-2">
                                                <img
                                                    src={school_logo}
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            "No logo provided"
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="google_place_name"
                                            value="Google Place Name"
                                        />
                                        <TextInput
                                            id="google_place_name"
                                            name="google_place_name"
                                            value={data.google_place_name}
                                            className="mt-1 block w-full"
                                            autoComplete="google_place_name"
                                            onChange={(e) =>
                                                setData(
                                                    "google_place_name",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={200}
                                        />
                                    </div>

                                    <hr />
                                    <div className="flex flex-col md:flex-row py-4 gap-8 justify-end">
                                        <div className="py-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                        {school.school_status >= 1 && (
                                            <div className="flex flex-row gap-4 bg-gray-200 px-6 py-4">
                                                <AlertDialog
                                                    open={open}
                                                    onOpenChange={setOpen}
                                                >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="primary">
                                                            Approve
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle></AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Confirm to
                                                                approve?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleApprove()
                                                                }
                                                            >
                                                                Confirm
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <AlertDialog
                                                    open={openReject}
                                                    onOpenChange={setOpenReject}
                                                >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive">
                                                            Reject
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle></AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Confirm to
                                                                reject?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleReject()
                                                                }
                                                            >
                                                                Confirm
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
