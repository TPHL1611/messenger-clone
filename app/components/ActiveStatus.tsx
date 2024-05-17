"use client";
import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";
import useActiveChannel from "../hooks/useActiveChannel";

interface ActiveStatusProps {
    user?: User;
}

const ActiveStatus = ({ user }: ActiveStatusProps) => {
    useActiveChannel();
    const active = useActiveList();

    return <div>Active</div>;
};

export default ActiveStatus;
