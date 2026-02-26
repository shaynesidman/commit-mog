import { useState } from "react";
import { type FriendData } from "../components/friend-card";

export function useFriends() {
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<FriendData | null>(null);
    const [moggers, setMoggers] = useState<FriendData[]>([]);
    const [mogged, setMogged] = useState<FriendData[]>([]);
    const [equals, setEquals] = useState<FriendData[]>([]);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${username}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch friends");
            }

            setUserData(data.user);
            setMoggers(data.friends.filter((friend: FriendData) => friend.commits > data.user.commits));
            setMogged(data.friends.filter((friend: FriendData) => friend.commits < data.user.commits));
            setEquals(data.friends.filter((friend: FriendData) => friend.commits == data.user.commits));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setUserData(null);
        setMoggers([]);
        setMogged([]);
        setEquals([]);
        setUsername("");
    };

    return { username, setUsername, isLoading, userData, moggers, mogged, equals, fetchFriends, reset };
}
