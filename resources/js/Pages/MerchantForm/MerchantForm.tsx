import { useEffect, FormEventHandler, useState } from "react";
import { Link, Head, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { ToastContainer, toast } from "react-toastify";
import Modal from "@/Components/Modal";
import Step1 from "./Step1";
import Step2 from "./Step2";

import "react-toastify/dist/ReactToastify.css";

export default function MerchantForm({ flash }: any) {
    const { types } = usePage<{ types: any }>().props;
    const { data, setData, post, processing, errors, reset, progress } =
        useForm({
            merchant_name: "",
            person_in_charge: "",
            email: "",
            mobile: "",
            description: "",
            website: "",
            facebook: "",
            instagram: "",
            companyRegistration: "",
            companyRegistrationForm: null,
            location: "",
            merchantType: "",
        });
    const [showModal, setShowModal] = useState(false);
    const [steps, setSteps] = useState("step1");
    const [merchantType, setMerchantType] = useState("");

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("merchant.register"), { forceFormData: true });
        reset();
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
            <div className="flex-1 px-20 py-6 items-center">
                <div className="flex flex-row justify-between gap-10">
                    <div
                        className={
                            steps === "step1" ? "font-extrabold" : "opacity-50"
                        }
                    >
                        <div className="flex flex-row">
                            <div className="flex w-6 h-6 items-center justify-center bg-blue-800 text-white rounded-[50%]">
                                1
                            </div>
                            <span className="pl-2">Step 1</span>
                        </div>
                    </div>
                    <hr className="flex-1 items-center px-10 mt-2 border-black" />
                    <div
                        className={
                            steps === "step2" ? "font-extrabold" : "opacity-50"
                        }
                    >
                        <div className="flex flex-row">
                            <div className="flex w-6 h-6 items-center justify-center bg-blue-800 text-white rounded-[50%]">
                                2
                            </div>
                            <span className="pl-2">Step 2</span>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
            {steps === "step1" ? (
                <Step1
                    types={types}
                    merchantType={merchantType}
                    setMerchantType={setMerchantType}
                    setSteps={setSteps}
                    setData={setData}
                />
            ) : (
                <Step2
                    data={data}
                    setData={setData}
                    errors={errors}
                    submit={submit}
                    merchantType={merchantType}
                    setMerchantType={setMerchantType}
                    setSteps={setSteps}
                    progress={progress}
                />
            )}
        </GuestLayout>
    );
}
