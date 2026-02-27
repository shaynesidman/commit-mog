import { Input } from "./ui/input";
import { Field } from "./ui/field";
import { Button } from "./ui/button";

interface SearchBarProps {
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function SearchBar({ onChange, onSubmit }: SearchBarProps) {
    return (
        <Field orientation="horizontal" className="animate-in fade-in slide-in-from-top-6 duration-500">
            <Input
                type="search"
                placeholder="Enter your GitHub username"
                onChange={(e) => onChange(e.target.value)}
            />
            <Button onClick={onSubmit}>Mog</Button>
        </Field>
    );
}
