"use client";

import clsx from "clsx";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import { User } from "@prisma/client";
import { FullConversationType } from "@/app/types";

import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}
const ConversationList = ({ initialItems, users }: ConversationListProps) => {
    const router = useRouter();
    const session = useSession();

    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isOpen, conversationId } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        const conversationHandler = (conversation: FullConversationType) => {
            setItems((currentConversation) => {
                if (find(currentConversation, { id: conversationId })) {
                    return currentConversation;
                }
                return [conversation, ...currentConversation];
            });
        };

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) =>
                current.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return {
                            ...currentConversation,
                            messages: conversation.messages,
                        };
                    }
                    return currentConversation;
                })
            );
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((remain) => remain.id !== conversation.id)];
            });
            if (conversationId === conversation.id) {
                router.push("/conversations");
            }
        };

        pusherClient.subscribe(pusherKey);
        pusherClient.bind("conversation:new", conversationHandler);
        pusherClient.bind("conversation:update", updateHandler);
        pusherClient.bind("conversation:remove", removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:new", conversationHandler);
            pusherClient.unbind("conversation:update", updateHandler);
            pusherClient.unbind("conversation:remove", removeHandler);
        };
    }, [pusherKey, conversationId, router]);

    return (
        <>
            <GroupChatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={users}
            />
            <aside
                className={clsx(
                    "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
                    isOpen ? "hidden" : "block w-full left-0"
                )}>
                <div className="px-5">
                    <div className="flex items-center justify-between mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">Messages</div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-full p-2 bg-gray-100 text-gray-600 hover:opacity-75 transition cursor-pointer">
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
};

export default ConversationList;
