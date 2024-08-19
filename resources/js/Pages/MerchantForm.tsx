import { useEffect, FormEventHandler, useState } from "react";
import { Link, Head, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import SelectInput from "@/Components/SelectInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import RichTextEditor from "@/Components/RichTextEditor";
import { ToastContainer, toast } from "react-toastify";
import Modal from "@/Components/Modal";
import "react-toastify/dist/ReactToastify.css";

export default function MerchantForm({ flash }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        merchant_name: "",
        person_in_charge: "",
        email: "",
        mobile: "",
        description: "",
        website: "",
        facebook: "",
        instagram: "",
    });
    const [showModal, setShowModal] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("merchant.register"));
    };

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
            setShowModal(true);
        }
    }, [flash]);

    return (
        <GuestLayout>
            <Head title="Merchant Form" />
            <ToastContainer />
            <Modal
                maxWidth="md"
                show={showModal}
                onClose={() => setShowModal(false)}
            >
                <span>
                    Thank you for you submission. We will review your
                    information and get in touch with you in 3 business days.
                </span>
            </Modal>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="merchant_name" value="Merchant Name" />
                    <TextInput
                        id="merchant_name"
                        name="merchant_name"
                        value={data.merchant_name}
                        className="mt-1 block w-full"
                        autoComplete="merchant_name"
                        isFocused={true}
                        onChange={(e) =>
                            setData("merchant_name", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.merchant_name}
                        className="mt-2"
                    />
                </div>
                <div className="mt-4">
                    <InputLabel
                        htmlFor="person_in_charge"
                        value="Person In Charge"
                    />
                    <TextInput
                        id="person_in_charge"
                        name="person_in_charge"
                        value={data.person_in_charge}
                        className="mt-1 block w-full"
                        autoComplete="person_in_charge"
                        isFocused={true}
                        onChange={(e) =>
                            setData("person_in_charge", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.person_in_charge}
                        className="mt-2"
                    />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="mobile" value="Contact No." />
                    <TextInput
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={data.mobile}
                        className="mt-1 block w-full"
                        autoComplete="mobile"
                        isFocused={true}
                        onChange={(e) => setData("mobile", e.target.value)}
                        required
                    />
                    <InputError message={errors.mobile} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full py-2"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="py-4">
                    <InputLabel
                        htmlFor="description"
                        value="Tell us about yourself"
                        className="mb-1"
                    />
                    <RichTextEditor
                        value={data.description}
                        onChange={setData}
                        contentFor={"description"}
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                <div className="mt-2">
                    <InputLabel htmlFor="website" value="Web Site" />
                    <TextInput
                        id="website"
                        name="website"
                        type="website"
                        value={data.website}
                        className="mt-1 block w-full py-2 px-2"
                        autoComplete="website"
                        isFocused={true}
                        onChange={(e) => setData("website", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-2">
                    <InputLabel htmlFor="facebook" value="Facebook Link" />
                    <TextInput
                        id="facebook"
                        name="facebook"
                        type="facebook"
                        value={data.facebook}
                        className="mt-1 block w-full py-2 px-2"
                        autoComplete="facebook"
                        isFocused={true}
                        onChange={(e) => setData("facebook", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="instagram" value="Instagram" />
                    <TextInput
                        id="instagram"
                        name="instagram"
                        type="instagram"
                        value={data.instagram}
                        className="mt-1 block w-full py-2 px-2"
                        autoComplete="instagram"
                        isFocused={true}
                        onChange={(e) => setData("instagram", e.target.value)}
                    />
                    <InputError message={errors.instagram} className="mt-2" />
                </div>

                {/* <div className="mt-4">
                    <InputLabel htmlFor="category" value="Category" />
                    <SelectInput
                        name="category"
                        className="mt-1 block w-full"
                        value={data.category}
                        onChange={(e) => setData("category", e.target.value)}
                        options={[
                            { value: "1", label: "A" },
                            { value: "2", label: "B" },
                        ]}
                        required
                    />
                </div> */}

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Submit
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
