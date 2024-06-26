"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: BodyProps) => {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((currentListMessage) => {
                if (find(currentListMessage, { id: message.id })) {
                    return currentListMessage;
                }

                return [...currentListMessage, message];
            });
            bottomRef?.current?.scrollIntoView();
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((currentListMessage) =>
                currentListMessage.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }

                    return currentMessage;
                })
            );
        };

        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("messages:update", updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unbind("messages:update", updateMessageHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto px-5 py-5">
            {messages.map((message, i) => (
                <MessageBox key={message.id} data={message} isLast={i === messages.length - 1} />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    );
};

export default Body;
