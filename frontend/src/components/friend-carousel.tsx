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
}

export function FriendCarousel({ friends, title, description }: FriendCarouselProps) {
    return (
        <Card className="px-10">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
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
