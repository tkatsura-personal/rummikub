import React, { useEffect, useRef, useState, CSSProperties } from "react";
import ActionButton from "../components/Button";
import { useNavigate } from "react-router-dom";

const backendLink = import.meta.env.VITE_BACKEND;

interface user {
    id: string;
    username: string;
    email: string;
    createdAt: {_seconds: BigInteger, _nanoseconds: BigInteger};
}

export default function Users() {
    const navigate = useNavigate();
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [users, setUsers] = useState<user[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>();
    useEffect(() => {
        fetch("${backendLink}/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUsers(data);
            setLoadingUsers(false);
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
    }, []);

    const toLobby = () => navigate(`/lobby/${selectedUser}`);

    return (
        <div>
            {loadingUsers ? "Loading Users..." : 
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="null">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            }
            <ActionButton label="Select" onClick={() => toLobby()} />
        </div>
    )
}