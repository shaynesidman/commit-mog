import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { type Period } from "../hooks/useFriends";

export function PeriodSelector({
    value,
    onChange,
}: {
    value: Period;
    onChange: (period: Period) => void;
}) {
    return (
        <Tabs value={value} onValueChange={(v) => onChange(v as Period)}>
            <TabsList>
                <TabsTrigger value="week">Last week</TabsTrigger>
                <TabsTrigger value="month">Last month</TabsTrigger>
                <TabsTrigger value="year">Last year</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
