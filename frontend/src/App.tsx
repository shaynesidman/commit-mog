import { useState } from "react";
import { Input } from "./components/ui/input";
import { Field } from "./components/ui/field";
import { Button } from "./components/ui/button";
import { FriendCard, type FriendData } from "./components/friend-card";

export default function App() {
    const [username, setUsername] = useState("");
    const [friendsData, setFriendsData] = useState<FriendData[]>([]);

    const fetchFriends = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${username}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch friends");
            }
            console.log(data)
            setFriendsData(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="min-h-screen w-full p-8">
            <section className="mx-auto max-w-4xl flex flex-col gap-8">
                <Field orientation="horizontal">
                    <Input
                        type="search"
                        placeholder="Enter your GitHub username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onClick={fetchFriends}>Mog</Button>
                </Field>
                {friendsData.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {friendsData.map((friend) => (
                            <FriendCard key={friend.username} friend={friend} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
