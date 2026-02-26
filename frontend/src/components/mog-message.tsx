type Tab = "moggers" | "mogged" | "equals";

interface MessageProps {
    friend: string;
    tab: Tab;
}

const MESSAGES: Record<Tab, (friend: string) => string> = {
    moggers: (friend) => `${friend} mogged you. Embarrassing.`,
    mogged:  (friend) => `You mogged ${friend}. Stay humble.`,
    equals:  (friend) => `${friend} is on your level. Respect.`,
};

export function MogMessage({ friend, tab }: MessageProps) {
    return (
        <p className="text-sm text-muted-foreground text-center italic">
            {MESSAGES[tab](friend)}
        </p>
    );
}
