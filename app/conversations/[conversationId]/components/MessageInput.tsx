"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
    placeholder?: string;
    type?: string;
    required?: boolean;
    id: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const MessageInput = ({ id, register, errors, required, placeholder, type }: MessageInputProps) => {
    return (
        <div className="relative w-full">
            <input
                type={type}
                id={id}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                className="w-full rounded-full text-black text-sm font-light bg-neutral-100 py-3 px-4 focus:outline-none"
            />
        </div>
    );
};

export default MessageInput;
