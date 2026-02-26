import { useEffect, useState } from "react";
import { FriendCard, type FriendData } from "./friend-card";
import { MogMessage } from "./mog-message";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./ui/card";
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel";

interface FriendCarouselProps {
    friends: FriendData[];
    title: string;
    description: string;
    userCommits?: number;
    tab: "moggers" | "mogged" | "equals";
}

export function FriendCarousel({ friends, title, description, userCommits, tab }: FriendCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => { api.off("select", onSelect); };
    }, [api]);

    const currentFriend = friends[currentIndex];

    return (
        <Card className="px-10">
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-2">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                {userCommits !== undefined && (
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Your commits</p>
                        <p className="text-2xl font-bold">{userCommits.toLocaleString()}</p>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Carousel setApi={setApi}>
                    <CarouselContent>
                        {friends.map((friend) => (
                            <CarouselItem key={friend.username}>
                                <FriendCard friend={friend} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                {currentFriend && <MogMessage friend={currentFriend.username} tab={tab} />}
            </CardContent>
        </Card>
    );
}
