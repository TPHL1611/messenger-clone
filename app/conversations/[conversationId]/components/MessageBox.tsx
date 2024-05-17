"use client";

import getSession from "@/app/actions/getSession";
import getUsers from "@/app/actions/getUsers";
import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
    isLast?: boolean;
    data: FullMessageType;
}

const MessageBox = ({ isLast, data }: MessageBoxProps) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = session.data?.user?.email === data.sender.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data.sender.email)
        .map((user) => user.name)
        .join(", .");

    const containerClass = clsx("flex gap-3 py-2", isOwn && "justify-end");
    const avatarClass = clsx(isOwn && "order-2");
    const messageClass = clsx(
        "text-sm overflow-hidden w-fit",
        isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
        data.image ? "rounded-md" : "px-4 py-2 rounded-full h-fit"
    );

    return (
        <div className={containerClass}>
            {!isOwn && (
                <div className={avatarClass}>
                    <Avatar user={data.sender} />
                </div>
            )}
            <div className="flex flex-col w-fit">
                <div className="flex w-fit items-end">
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            src={data.image}
                            width="200"
                            height="200"
                            alt="Image"
                            className={clsx("cursor-pointer", messageClass)}
                            onClick={() => setImageModalOpen(true)}
                        />
                    ) : (
                        <p className={messageClass}>{data.body}</p>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <p className="text-xs font-light text-gray-500 -translate-x-1 mt-1">{`Seen by ${seenList}`}</p>
                )}
            </div>
        </div>
    );
};

export default MessageBox;
