import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Link, Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { School } from "@/types";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import States from "@/Components/states.json";
import InputError from "@/Components/InputError";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { FiHelpCircle } from "react-icons/fi";
import GoogleMapInstruction from "@/Components/GoogleMapInstruction";
import { useObjectUrls } from "@/utils/getObjectUrls";
import { Button } from "@/Components/ui/button";

const states = States.sort((a, b) => (a > b ? 1 : -1)).map((s) => {
    return { label: s, value: s };
});

const View = ({ auth }) => {
    const { school, school_logo } = usePage<{
        school: School;
        school_logo: string;
    }>().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        school_name: school.school_name,
        address_1: school.address_1,
        address_2: school.address_2,
        address_3: school.address_3,
        city: school.city,
        postcode: school.postcode,
        state: school.state,
        contact_person: school.contact_person,
        email: school.email,
        contact_no: school.contact_no || "",
        mobile_no: school.mobile_no || "",
        school_logo: [],
        school_status: school.school_status,
        google_map_location: school.google_map_location,
        _method: "put",
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

    const handleSubmit = () => {};

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("schools")}>Back</Link>
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {school.school_name}
                    </h2>
                </div>
            }
        >
            <Head title="School" />
            <ToastContainer limit={3} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div>
                                <div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="py-4"
                                    >
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
                                                        value={data.address_1}
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
                                                        value={data.address_1}
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
                                                        className="pb-2"
                                                    />
                                                </div>
                                                <div className="flex flex-col md:col-span-5 lg:col-span-10">
                                                    <input
                                                        type="file"
                                                        multiple={false}
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => {
                                                            handleMainFileUpload(
                                                                e
                                                            );
                                                        }}
                                                    />
                                                    <small>
                                                        (supported formats .png,
                                                        .jpg. Image should not
                                                        be more than 2 MB)
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="grid py-2 grid-flow-row-dense grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                                <div className="flex items-center md:col-span-1 lg:col-span-2"></div>
                                                {logo && (
                                                    <div className="flex w-32 h-32 justify-center items-center px-2">
                                                        <img
                                                            src={getObjectUrl(
                                                                logo
                                                            )}
                                                            alt={logo.name}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="py-2">
                                                <div className="flex flex-grow align-center">
                                                    <InputLabel
                                                        htmlFor="google_map_location"
                                                        value="Google Location"
                                                    />
                                                    <div className="pl-2">
                                                        <HoverCard>
                                                            <HoverCardTrigger>
                                                                <FiHelpCircle
                                                                    size={15}
                                                                />
                                                            </HoverCardTrigger>
                                                            <HoverCardContent
                                                                side="right"
                                                                updatePositionStrategy="always"
                                                                className="w-100"
                                                            >
                                                                <GoogleMapInstruction />
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                    </div>
                                                </div>
                                                <TextInput
                                                    id="google_map_location"
                                                    name="google_map_location"
                                                    type="text"
                                                    value={
                                                        data.google_map_location
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="event_map_location"
                                                    onChange={(e) =>
                                                        setData(
                                                            "google_map_location",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <div
                                                    className="flex justify-center py-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: data.google_map_location,
                                                    }}
                                                />

                                                <InputError
                                                    message={
                                                        errors.google_map_location
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <hr />
                                            <div className="flex flex-col md:flex-row py-4 gap-8 justify-end">
                                                <div className="py-4">
                                                    <Button type="submit">
                                                        Update
                                                    </Button>
                                                </div>
                                                {school.school_status >= 1 && (
                                                    <div className="flex flex-row gap-4 bg-gray-200 px-6 py-4">
                                                        <Button variant="primary">
                                                            Approve
                                                        </Button>
                                                        <Button variant="destructive">
                                                            Reject
                                                        </Button>
                                                    </div>
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
