import React from "react";

const StrongPasswordInstruction = () => {
    return (
        <div>
            <span>Password guide</span>
            <ul className="px-2">
                <li className="list-disc">At least 8 characters.</li>
                <li className="list-disc">
                    A combination of uppercase letters, lowercase letters,
                    numbers, and symbols.
                </li>
            </ul>
        </div>
    );
};

export default StrongPasswordInstruction;
