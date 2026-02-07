import { useState } from "react";
import { Input } from "./components/ui/input";
import { Field } from "./components/ui/field";
import { Button } from "./components/ui/button";

type FriendsData = {
    username: string;
    commits: number;
}

export default function App() {
    const [username, setUsername] = useState("");
    const [friendsData, setFriendsData] = useState<FriendsData[]>([]);

    const fetchFriends = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${username}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch friends");
            }
            setFriendsData(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="h-screen w-full">
            <section className="h-full flex justify-center items-center">
                <div className="">
                    <Field orientation="horizontal">
                        <Input 
                            type="search" 
                            placeholder="Enter your GitHub username" 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <Button onClick={fetchFriends}>Mog</Button>
                    </Field>
                    {friendsData.map((friend) => (
                        <div key={friend.username}>
                            <p>Username: {friend.username}</p>
                            <p>Commits: {friend.commits}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
