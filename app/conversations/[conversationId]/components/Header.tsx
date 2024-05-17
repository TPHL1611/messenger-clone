"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "../../components/ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

const Header = ({ conversation }: HeaderProps) => {
    //Lấy thông tin các user khác
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    //Set text hiển thị đang online
    const statusText = useMemo(() => {
        // Hiển thị số lượng thành viên
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }

        return isActive ? "Active" : "Offline";
    }, [conversation]);

    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div className="bg-white w-full flex justify-between items-center border-b shadow-sm py-3 px-4 sm:px-4 lg:px-6">
                <div className="flex gap-3 items-center">
                    <Link
                        href="/conversations"
                        className="block text-sky-500 hover:text-sky-600 transition cursor-pointer lg:hidden">
                        <HiChevronLeft size={32} />
                    </Link>
                    {conversation.isGroup ? (
                        <AvatarGroup users={conversation.users} />
                    ) : (
                        <Avatar user={otherUser} />
                    )}
                    <div className="flex flex-col">
                        <div>{conversation.name || otherUser.name}</div>
                        <div className="text-sm font-light text-neutral-500">{statusText}</div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
                />
            </div>
        </>
    );
};
export default Header;
