import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";

const Step1 = ({ types, merchantType, setMerchantType, setSteps }) => {
    console.log("merchant type => ", types);
    return (
        <div>
            <div className="flex flex-col items-center">
                <div>
                    <span className="font-bold text-[18px] ">I AM A</span> 
                </div>
                <div className="flex flex-row py-10 justify-between gap-10">
                    {types?.map((type, i) => {
                        return (
                            <div key={i}>
                                <button
                                    onClick={() => setMerchantType(type.type)}
                                    className={`border border-[#F36B3C] py-10 px-8 rounded-3xl hover:bg-[#F36B3C] hover:text-white hover:font-bold hover:opacity-80 ${
                                        merchantType === type.type
                                            ? "text-white bg-[#F36B3C]"
                                            : "text-[#F36B3C]"
                                    }`}
                                >
                                    <span>{type.name}</span>
                                </button>
                            </div>
                        );
                    })}
                    {/* <div>
                        <button
                            onClick={() => setMerchantType("independant")}
                            className={`border border-[#F36B3C] py-10 px-8 rounded-3xl hover:bg-[#F36B3C] hover:text-white hover:font-bold hover:opacity-80 ${
                                merchantType === "independant"
                                    ? "text-white bg-[#F36B3C]"
                                    : "text-[#F36B3C]"
                            }`}
                        >
                            <span>Independant Event Creator</span>
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => setMerchantType("learningPartner")}
                            className={`border border-[#F36B3C] py-10 px-8 rounded-3xl hover:bg-[#F36B3C] hover:text-white hover:font-bold hover:opacity-80 ${
                                merchantType === "learningPartner"
                                    ? "text-white bg-[#F36B3C]"
                                    : "text-[#F36B3C]"
                            }`}
                        >
                            <span>Learning Partner / Corporate</span>
                        </button>
                    </div> */}
                </div>
            </div>
            <div className="flex items-center justify-end mt-4">
                <PrimaryButton
                    onClick={() => setSteps("step2")}
                    className="ms-4"
                    disabled={merchantType === "" ? true : false}
                >
                    Next
                </PrimaryButton>
            </div>
        </div>
    );
};

export default Step1;
