import { type FriendData } from "./friend-card";
import { FriendCarousel } from "./friend-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface FriendsTabsProps {
    moggers: FriendData[];
    mogged: FriendData[];
    equals: FriendData[];
}

export function FriendsTabs({ moggers, mogged, equals }: FriendsTabsProps) {
    if (moggers.length === 0 && mogged.length === 0 && equals.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
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
                    />
                </TabsContent>
                <TabsContent value="mogged" />
                <TabsContent value="equals" />
            </Tabs>
        </div>
    );
}
