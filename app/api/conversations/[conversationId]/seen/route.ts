import getCurrentUser from "@/app/actions/getCurrentUser";
import client from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const conversation = await client.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        //Find the last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        //Update seen of last message
        const updatedMessage = await client.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                seen: true,
                sender: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
        });

        await pusherServer.trigger(currentUser.email, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage],
        });

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, "message:update", updatedMessage);

        return NextResponse.json(updatedMessage);
    } catch (error: any) {
        console.log(error, "ERROR_MESSAGES_SEEN");
        return new NextResponse("Internal error", { status: 500 });
    }
}
