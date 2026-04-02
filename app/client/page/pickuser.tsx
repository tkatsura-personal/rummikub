import React, { useEffect, useRef, useState, CSSProperties } from "react";
import ActionButton from "../components/Button";
import { useNavigate } from "react-router-dom";

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
        fetch("http://localhost:3000/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            setUsers(data);
            setLoadingUsers(false);
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
    }, []);

    const toLobby = () =>{
        navigate('/lobby/${uid}');
    }

    return (
        <div>
            {loadingUsers ? "Loading Users..." : 
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="null">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.username}>{user.username}</option>
                    ))}
                </select>
            }
            <Router>
                <ActionButton label="Select" onClick={() => toLobby()} />
            </Router>
        </div>
    )
} 