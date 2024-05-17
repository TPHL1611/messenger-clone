import getCurrentUser from "@/app/actions/getCurrentUser";
import client from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingConversation = await client.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        if (!existingConversation) {
            return new NextResponse("Invalid Id", { status: 400 });
        }

        const deletedConversation = await client.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id],
                },
            },
        });

        existingConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:remove", existingConversation);
            }
        });
        return NextResponse.json(deletedConversation);
    } catch (error: any) {
        console.log(error, "ERROR_CONVERSATION_DELETE");
        return new NextResponse("Internal error", { status: 500 });
    }
}
