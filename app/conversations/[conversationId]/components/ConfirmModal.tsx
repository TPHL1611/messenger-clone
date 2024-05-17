"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

const ConfirmModal = ({ isOpen, onClose }: ConfirmModalProps) => {
    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);

        axios
            .delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose();
                router.push("/conversations");
                router.refresh();
            })
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false));
    }, [conversationId, router, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex items-center justify-center flex-shrink-0 rounded-full h-12 w-12 sm:mx-0 sm:h-10 sw:w-10">
                    <FiAlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="mx-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900">
                        Delete Conversation
                    </DialogTitle>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Are you sure to delete this conversation? This action can&lsquo;t be
                            undone
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 gap-3 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button onClick={onDelete} danger disabled={isLoading}>
                    Delete
                </Button>
                <Button onClick={onClose} secondary disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
