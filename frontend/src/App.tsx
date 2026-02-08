import { useState } from "react";
import { Input } from "./components/ui/input";
import { Field } from "./components/ui/field";
import { Button } from "./components/ui/button";
import { FriendCard, type FriendData } from "./components/friend-card";

export default function App() {
    const [username, setUsername] = useState("");
    const [userData, setUserData] = useState<FriendData | null>(null);
    const [moggers, setMoggers] = useState<FriendData[]>([]);
    const [mogged, setMogged] = useState<FriendData[]>([]); 
    const [equals, setEquals] = useState<FriendData[]>([]); 

    const fetchFriends = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${username}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch friends");
            }
            
            setUserData(data.user);
            setMoggers(data.friends.filter((friend: FriendData) => {
                return friend.commits > data.user.commits;
            }));
            setMogged(data.friends.filter((friend: FriendData) => {
                return friend.commits < data.user.commits;
            }));
            setEquals(data.friends.filter((friend: FriendData) => {
                return friend.commits == data.user.commits;
            }));
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
                {userData && (
                    <FriendCard friend={userData} variant="featured" />
                )}
                <div className="flex flex-col gap-4">
                    {moggers.length > 0 && 
                        <div className="flex flex-col gap-2">
                            <label>Moggers</label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {moggers.map((friend) => (
                                    <FriendCard key={friend.username} friend={friend} />
                                ))}
                            </div>
                        </div>
                    }
                    {mogged.length > 0 && 
                        <div className="flex flex-col gap-2">
                            <label>Mogged</label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {mogged.map((friend) => (
                                    <FriendCard key={friend.username} friend={friend} />
                                ))}
                            </div>
                        </div>
                    }
                    {equals.length > 0 && 
                        <div className="flex flex-col gap-2">
                            <label>Equals</label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {equals.map((friend) => (
                                    <FriendCard key={friend.username} friend={friend} />
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </section>
        </main>
    );
}
