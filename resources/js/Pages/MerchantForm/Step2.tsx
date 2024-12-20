import React, { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import RichTextEditor from "@/Components/RichTextEditor";
import PrimaryButton from "@/Components/PrimaryButton";

const Step2 = ({
    data,
    setData,
    errors,
    submit,
    merchantType,
    setMerchantType,
    setSteps,
    progress,
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    <div className="flex flex-row gap-1">
                        <InputLabel
                            htmlFor="merchant_name"
                            value="Merchant Name"
                        />
                        <span className="text-red-500">*</span>
                    </div>
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
                    <div className="flex flex-row gap-1">
                        <InputLabel
                            htmlFor="person_in_charge"
                            value="Person In Charge"
                        />
                        <span className="text-red-500">*</span>
                    </div>
                    <TextInput
                        id="person_in_charge"
                        name="person_in_charge"
                        value={data.person_in_charge}
                        className="mt-1 block w-full"
                        autoComplete="person_in_charge"
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
                    <div className="flex flex-row gap-1">
                        <InputLabel htmlFor="mobile" value="Contact No." />
                        <span className="text-red-500">*</span>
                    </div>
                    <TextInput
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={data.mobile}
                        className="mt-1 block w-full"
                        autoComplete="mobile"
                        onChange={(e) => setData("mobile", e.target.value)}
                        required
                    />
                    <InputError message={errors.mobile} className="mt-2" />
                </div>
                <div className="mt-4">
                    <div className="flex flex-row gap-1">
                        <InputLabel htmlFor="email" value="Email" />
                        <span className="text-red-500">*</span>
                    </div>
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full py-2"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <div className="flex flex-row gap-1">
                        <InputLabel
                            htmlFor="description"
                            value="Tell us about yourself"
                            className="mb-1"
                        />
                        <span className="text-red-500">*</span>
                    </div>
                    <RichTextEditor
                        value={data.description}
                        onChange={setData}
                        contentFor={"description"}
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                {merchantType === "learningCenter" ? (
                    <div>
                        <div className="mt-4">
                            <div>
                                <InputLabel
                                    htmlFor="location"
                                    value="Location"
                                />
                                <TextInput
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={data.location}
                                    className="mt-1 block w-full py-2 px-2"
                                    autoComplete="location"
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    required={
                                        merchantType === "learningPartner"
                                            ? true
                                            : false
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div>
                                <InputLabel
                                    htmlFor="companyRegistration"
                                    value="Company Registration No."
                                />
                                <TextInput
                                    id="companyRegistration"
                                    name="companyRegistration"
                                    type="text"
                                    value={data.companyRegistration}
                                    className="mt-1 block w-full py-2 px-2"
                                    autoComplete="companyRegistration"
                                    onChange={(e) =>
                                        setData(
                                            "companyRegistration",
                                            e.target.value
                                        )
                                    }
                                    required={
                                        merchantType === "learningPartner"
                                            ? true
                                            : false
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="py-4">
                            <InputLabel
                                htmlFor="companyLogo"
                                value="Company Logo (.png, .jpg)"
                                className="pb-2"
                            />
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={(e) =>
                                    setData("merchant_logo", e.target.files[0])
                                }
                            />
                            {progress && (
                                <progress value={progress.percentage} max="100">
                                    {progress.percentage}%
                                </progress>
                            )}
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="companyRegistrationForm"
                                value="Company Registration Form (.pdf)"
                                className="pb-2"
                            />
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setData(
                                        "companyRegistrationForm",
                                        e.target.files[0]
                                    )
                                }
                            />
                            {progress && (
                                <progress value={progress.percentage} max="100">
                                    {progress.percentage}%
                                </progress>
                            )}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <div className="mt-8">
                    <InputLabel htmlFor="website" value="Web Site" />
                    <TextInput
                        id="website"
                        name="website"
                        type="url"
                        value={data.website}
                        className="mt-1 block w-full py-2 px-2"
                        autoComplete="website"
                        onChange={(e) => setData("website", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="facebook" value="Facebook Link" />
                    <TextInput
                        id="facebook"
                        name="facebook"
                        type="text"
                        value={data.facebook}
                        className="mt-1 block w-full py-2 px-2"
                        autoComplete="facebook"
                        onChange={(e) => setData("facebook", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="instagram" value="Instagram" />
                    <TextInput
                        id="instagram"
                        name="instagram"
                        type="text"
                        value={data.instagram}
                        className="mt-1 block w-full py-2 px-2"
                        autoComplete="instagram"
                        onChange={(e) => setData("instagram", e.target.value)}
                    />
                    <InputError message={errors.instagram} className="mt-2" />
                </div>
                <div className="py-2">
                    <small>
                        <span className="text-red-500">* </span>
                        <span>Required field</span>
                    </small>
                </div>
                <div className="flex items-center justify-end mt-8">
                    <button
                        onClick={() => {
                            setMerchantType(merchantType);
                            setSteps("step1");
                        }}
                        className={`inline-flex items-center px-4 py-2 bg-red-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150
                            } `}
                    >
                        Back
                    </button>
                    <PrimaryButton className="ms-4" disabled={false}>
                        Submit
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default Step2;
