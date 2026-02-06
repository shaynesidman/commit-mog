import { useState } from "react";
import { Input } from "./components/ui/input";
import { Field } from "./components/ui/field";
import { Button } from "./components/ui/button";

export default function App() {
    const [username, setUsername] = useState("");

    return (
        <main className="h-screen w-full">
            <section className="h-full flex justify-center items-center">
                <div className="">
                    <Field orientation="horizontal">
                        <Input 
                            type="search" 
                            placeholder="Enter your GitHub username" 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <Button>Mog</Button>
                    </Field>
                </div>
            </section>
        </main>
    );
}
