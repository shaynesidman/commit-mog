import { useFriends } from "./hooks/useFriends";
import { SearchBar } from "./components/search-bar";
import { FriendCard } from "./components/friend-card";
import { FriendsTabs } from "./components/friends-tabs";
import { Spinner } from "./components/ui/spinner";

export default function App() {
    const { setUsername, isLoading, userData, moggers, mogged, equals, fetchFriends } = useFriends();

    return (
        <main className="w-full pt-8">
            {!isLoading && (
                <section className="min-h-screen mx-auto max-w-4xl flex flex-col justify-center items-center gap-8">
                    <SearchBar onChange={setUsername} onSubmit={fetchFriends} />
                    {userData && <FriendCard friend={userData} variant="featured" />}
                    <FriendsTabs moggers={moggers} mogged={mogged} equals={equals} />
                </section>
            )}
            {isLoading && (
                <section className="min-h-screen mx-auto max-w-4xl flex flex-col justify-center items-center gap-8">
                    <Spinner />
                </section>
            )}
        </main>
    );
}
