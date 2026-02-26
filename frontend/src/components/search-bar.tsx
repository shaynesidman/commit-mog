import { Input } from "./ui/input";
import { Field } from "./ui/field";
import { Button } from "./ui/button";

interface SearchBarProps {
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function SearchBar({ onChange, onSubmit }: SearchBarProps) {
    return (
        <Field orientation="horizontal">
            <Input
                type="search"
                placeholder="Enter your GitHub username"
                onChange={(e) => onChange(e.target.value)}
            />
            <Button onClick={onSubmit}>Mog</Button>
        </Field>
    );
}
