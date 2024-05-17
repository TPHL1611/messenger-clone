import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log(request);

    const session = await getServerSession(request, response, authOptions);
    if (!session?.user?.email) {
        return response.status(401);
    }

    const socketId = request.body.socketId;
    const channel = request.body.channel_name;
    const data = {
        user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return response.send(authResponse);
}
