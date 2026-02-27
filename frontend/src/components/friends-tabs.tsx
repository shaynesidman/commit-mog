import { ArrowLeft } from "lucide-react";
import { type FriendData } from "./friend-card";
import { FriendCarousel } from "./friend-carousel";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface FriendsTabsProps {
    moggers: FriendData[];
    mogged: FriendData[];
    equals: FriendData[];
    userCommits: number;
    onBack: () => void;
}

const TAB_CONFIG = [
    { value: "moggers", label: "Moggers", title: "Moggers", description: "Here is who mogged you" },
    { value: "mogged",  label: "Mogged",  title: "Mogged",  description: "Here is who you mogged" },
    { value: "equals",  label: "Equals",  title: "Equals",  description: "Here is who is even with you" },
] as const;

export function FriendsTabs({ moggers, mogged, equals, userCommits, onBack }: FriendsTabsProps) {
    const friendMap = { moggers, mogged, equals };

    const activeTabs = TAB_CONFIG.filter(tab => friendMap[tab.value].length > 0);

    if (activeTabs.length === 0) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 flex flex-col gap-4 max-w-xl">
            <Tabs defaultValue={activeTabs[0].value}>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <TabsList>
                        {activeTabs.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                {activeTabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="animate-in fade-in duration-500">
                        <FriendCarousel
                            friends={friendMap[tab.value]}
                            title={tab.title}
                            description={tab.description}
                            userCommits={userCommits}
                            tab={tab.value}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
