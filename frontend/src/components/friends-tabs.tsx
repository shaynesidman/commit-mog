import { type FriendData } from "./friend-card";
import { FriendCarousel } from "./friend-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface FriendsTabsProps {
    moggers: FriendData[];
    mogged: FriendData[];
    equals: FriendData[];
    userCommits: number;
}

export function FriendsTabs({ moggers, mogged, equals, userCommits }: FriendsTabsProps) {
    if (moggers.length === 0 && mogged.length === 0 && equals.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl">
            <Tabs>
                <TabsList>
                    <TabsTrigger value="moggers">Moggers</TabsTrigger>
                    <TabsTrigger value="mogged">Mogged</TabsTrigger>
                    <TabsTrigger value="equals">Equals</TabsTrigger>
                </TabsList>
                <TabsContent value="moggers">
                    <FriendCarousel
                        friends={moggers}
                        title="Moggers"
                        description="Here is who mogged you"
                        userCommits={userCommits}
                    />
                </TabsContent>
                <TabsContent value="mogged">
                    <FriendCarousel
                        friends={mogged}
                        title="Mogged"
                        description="Here is who you mogged"
                        userCommits={userCommits}
                    />
                </TabsContent>
                <TabsContent value="equals">
                    <FriendCarousel
                        friends={equals}
                        title="Equals"
                        description="Here is who is even with you"
                        userCommits={userCommits}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
