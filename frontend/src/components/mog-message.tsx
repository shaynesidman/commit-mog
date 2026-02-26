import { useMemo } from "react";

type Tab = "moggers" | "mogged" | "equals";

interface MessageProps {
    friend: string;
    tab: Tab;
}

const MESSAGES: Record<Tab, Array<(name: string) => string>> = {
    moggers: [
        (name) => `${name} mogged you worse than ASU frat leader frame mogged Clav.`,
        (name) => `${name} prime Dillon Latham'd you. Do the dance with the pants.`,
        (name) => `Cortisol spike incoming. ${name} commit-mogged you.`,
        (name) => `You have to be jestermaxxing because ${name} mogged you.`,
        (name) => `${name} mogged you. h00pify is making a video on this as we speak. Cue the bells.`,
        (name) => `Call #2 ranked chad to avenge you because you got mogged by ${name}.`,
        (name) => `You're a mid-tier normie. Mogged by ${name}.`
    ],
    mogged: [
        (name) => `This is prime Marlon-level mogging. You ruined ${name}.`,
        (name) => `You're swe-maxxing. Tell ${name} to make some more contributions.`,
        (name) => `Tell ${name} to get to bonesmashing.`,
        (name) => `You're a gigachad. ${name} is a sub-5 committer.`
    ],
    equals: [
        (name) => `You and ${name} are in a mog-off. Make a contribution to mog.`,
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
