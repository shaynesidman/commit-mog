import { useFriends } from "./hooks/useFriends";
import { SearchBar } from "./components/search-bar";
import { FriendsTabs } from "./components/friends-tabs";
import { PeriodSelector } from "./components/period-selector";
import { Spinner } from "./components/ui/spinner";

export default function App() {
    const { setUsername, period, setPeriod, isLoading, userData, moggers, mogged, equals, fetchFriends, reset } = useFriends();

    return (
        <main className="w-full">
            {!isLoading && (
                <section className="min-h-screen mx-auto max-w-xl flex flex-col justify-center items-center gap-8">
                    {!userData && (
                        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-top-6 duration-500">
                            <PeriodSelector value={period} onChange={setPeriod} />
                            <SearchBar onChange={setUsername} onSubmit={fetchFriends} />
                        </div>
                    )}
                    {userData && (
                        <FriendsTabs
                            moggers={moggers}
                            mogged={mogged}
                            equals={equals}
                            userCommits={userData.commits}
                            period={period}
                            onBack={reset}
                        />
                    )}
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
