import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export type FriendData = {
    username: string;
    commits: number;
    avatar_url?: string;
    profile_url?: string;
};

export function FriendCard({
    friend,
    variant = "default",
}: {
    friend: FriendData;
    variant?: "default" | "featured";
}) {
    const isFeatured = variant === "featured";

    return (
        <Card className={isFeatured ? "w-full col-span-full" : "w-full"}>
            <CardHeader className="flex-row items-center gap-4">
                <Avatar
                    size="lg"
                    className={isFeatured ? "!size-16" : undefined}
                >
                    <AvatarImage src={friend.avatar_url} alt={friend.username} />
                    <AvatarFallback>
                        {friend.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <CardTitle className={isFeatured ? "text-xl" : undefined}>
                        {friend.profile_url ? (
                            <a
                                href={friend.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {friend.username}
                            </a>
                        ) : (
                            friend.username
                        )}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span className={isFeatured ? "text-base text-muted-foreground" : "text-sm text-muted-foreground"}>
                        Commits this year
                    </span>
                    <span className={isFeatured ? "text-4xl font-bold" : "text-2xl font-bold"}>
                        {friend.commits.toLocaleString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
