import getCurrentUser from "@/app/actions/getCurrentUser";
import client from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { message, image, conversationId } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //Create new message
        const newMessage = await client.message.create({
            // Data value
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: currentUser.id,
                    },
                },
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            // Include seen and sender information
            include: {
                seen: true,
                sender: true,
            },
        });

        //Update conversation in database
        const updatedConversation = await client.conversation.update({
            // Where clause
            where: {
                id: conversationId,
            },
            // Data value
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id,
                    },
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        // Trigger action push noti from server
        await pusherServer.trigger(conversationId, "messages:new", newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, "coversation:update", {
                id: conversationId,
                message: [lastMessage],
            });
        });

        return NextResponse.json(newMessage);
    } catch (err: any) {
        console.log(err, "ERROR MESSAGES");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
