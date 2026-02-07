import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export type FriendData = {
    username: string;
    commits: number;
    avatar_url?: string;
    profile_url?: string;
};

export function FriendCard({ friend }: { friend: FriendData }) {
    return (
        <Card className="w-full">
            <CardHeader className="flex-row items-center gap-4">
                <Avatar size="lg">
                    <AvatarImage src={friend.avatar_url} alt={friend.username} />
                    <AvatarFallback>
                        {friend.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <CardTitle>
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
                    <span className="text-sm text-muted-foreground">Commits this year</span>
                    <span className="text-2xl font-bold">{friend.commits.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
