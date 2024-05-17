"use client";

import Modal from "@/app/components/Modal";
import Image from "next/image";

interface ImageModalProps {
    src?: string | null;
    isOpen?: boolean;
    onClose: () => void;
}

const ImageModal = ({ src, isOpen, onClose }: ImageModalProps) => {
    if (!src) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-80 h-80">
                <Image src={src} fill alt="Image" className="object-contain" />
            </div>
        </Modal>
    );
};

export default ImageModal;
