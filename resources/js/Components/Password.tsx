import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import InputLabel from "@/Components/InputLabel";

interface PasswordWithConfirmationProps {
    pattern?: RegExp; // Optional regex pattern for password validation
    minLength?: number; // Minimum password length
    onPasswordChange?: (password: string, isValid: boolean) => void; // Callback for password changes
    setData;
}

const PasswordInput: React.FC<PasswordWithConfirmationProps> = ({
    pattern,
    minLength = 8,
    onPasswordChange,
    setData,
}) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState("Weak");

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Password strength checker
    const checkStrength = (value: string) => {
        if (value.length >= minLength) {
            if (
                /[A-Z]/.test(value) &&
                /[0-9]/.test(value) &&
                /[@$!%*?&#]/.test(value)
            ) {
                return "Strong";
            } else if (/[A-Z]/.test(value) || /[0-9]/.test(value)) {
                return "Medium";
            }
        }
        return "Weak";
    };

    // Handle password input change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        // Update strength
        const newStrength = checkStrength(value);
        setStrength(newStrength);

        // Validate pattern and length
        checkIsValid(value, confirmPassword);
        setData("password", value);
    };

    // Handle confirm password input change
    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        checkIsValid(password, e.target.value);
        setData("password_confirmation", e.target.value);
        setConfirmPassword(e.target.value);
    };

    const checkIsValid = (pass1, pass2) => {
        const isValid =
            (!pattern || pattern.test(pass1)) &&
            pass1.length >= minLength &&
            pass1 === pass2;
        if (onPasswordChange) {
            onPasswordChange(pass1, isValid);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            {/* Password Input */}
            <div className="mt-4">
                <div className="flex flex-row">
                    <InputLabel htmlFor="new_password" value="New Password" />
                </div>
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        style={{
                            width: "100%",
                            padding: "10px 40px 10px 10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                        className="mt-1"
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <div className="px-2 pt-2">
                    <small>
                        <ul className="px-2">
                            <li className="list-disc">
                                At least 8 characters.
                            </li>
                            <li className="list-disc">
                                A combination of uppercase letters, lowercase
                                letters, numbers, and symbols.
                            </li>
                        </ul>
                    </small>
                </div>
                <div>
                    {password.length > 0 && (
                        <small>
                            Password Strength:{" "}
                            <strong
                                style={{
                                    color:
                                        strength === "Strong"
                                            ? "green"
                                            : strength === "Medium"
                                            ? "orange"
                                            : "red",
                                }}
                            >
                                {strength}
                            </strong>
                        </small>
                    )}
                </div>
                {pattern && !pattern.test(password) && password.length > 0 && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                        Password must match the required pattern.
                    </div>
                )}
                {password.length > 0 && password.length < minLength && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                        Password must be at least {minLength} characters long.
                    </div>
                )}
            </div>

            <div className="mt">
                {/* Confirmation Input */}
                <InputLabel
                    htmlFor="confirm_password"
                    value="Confirm Password"
                />
                <div style={{ position: "relative" }}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirm your password"
                        style={{
                            width: "100%",
                            padding: "10px 40px 10px 10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                        className="mt-1"
                    />
                    <span
                        onClick={toggleConfirmPasswordVisibility}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                        }}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* Validation Messages */}
                {confirmPassword && password !== confirmPassword && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                        Passwords do not match.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordInput;
