import { FriendCard, type FriendData } from "./friend-card";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./ui/card";
import {
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
}

export function FriendCarousel({ friends, title, description, userCommits }: FriendCarouselProps) {
    return (
        <Card className="px-10">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
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
            <CardContent>
                <Carousel>
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
            </CardContent>
        </Card>
    );
}
