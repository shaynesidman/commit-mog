import { useMemo } from "react";

type Tab = "moggers" | "mogged" | "equals";

interface MessageProps {
    friend: string;
    tab: Tab;
}

const MESSAGES: Record<Tab, Array<(name: string) => string>> = {
    moggers: [
        (name) => `${name} mogged you. Embarrassing.`,
    ],
    mogged: [
        (name) => `You mogged ${name}. Stay humble.`,
    ],
    equals: [
        (name) => `${name} is on your level. Respect.`,
    ],
};

const generateMessage = (friend: string, bank: Array<(name: string) => string>) => {
    return bank[Math.floor(Math.random() * bank.length)](friend);
};

export function MogMessage({ friend, tab }: MessageProps) {
    const message = useMemo(() => generateMessage(friend, MESSAGES[tab]), [friend, tab]);

    return (
        <p className="text-sm text-muted-foreground text-center italic">
            {message}
        </p>
    );
}
