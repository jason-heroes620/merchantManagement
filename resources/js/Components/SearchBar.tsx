import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import debounce from "lodash.debounce";
import { CircleX, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SearchBar = ({ link, search, category }: any) => {
    const regionRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data, setData, get, processing, reset } = useForm({
        search: search || "",
    });
    console.log("link ", link);
    const fetchSuggestions = debounce(async (searchTerm) => {
        if (!searchTerm) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                route(link + ".autocomplete", { search: searchTerm })
            );
            setSuggestions(response.data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
        }
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData("search", e.target.value);
        fetchSuggestions(e.target.value);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setData("search", suggestion);
        setShowSuggestions(false);
    };

    const handleSearchSubmit = async (e: any) => {
        e.preventDefault();
        get(route(link, category), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (regionRef.current) {
                    (regionRef.current as HTMLElement).scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            },
        });
    };

    const handleClearSearch = (e: any) => {
        e.preventDefault();
        reset;
        router.get(route(link, category), {
            search: "",
        });
    };

    useEffect(() => {
        if (regionRef.current && window.location.hash === "#scrollHere") {
            (regionRef.current as HTMLElement).scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, []);

    return (
        <form
            onSubmit={handleSearchSubmit}
            ref={regionRef}
            id={"scrollHere"}
            className="flex flex-row items-center gap-2"
        >
            <div className="relative z-50">
                <input
                    type="text"
                    value={data.search}
                    onChange={handleSearchChange}
                    placeholder="Search ..."
                    className="h-10 rounded-md border px-2 py-1 md:w-80"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                    } // Hide suggestions after a delay
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute mt-1 w-60 border bg-white shadow-lg">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() =>
                                    handleSelectSuggestion(suggestion)
                                }
                                className="cursor-pointer p-2 hover:bg-gray-200"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Button disabled={processing} variant={"ghost"} size={"sm"}>
                <Search />
            </Button>

            {/* <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"ghost"}>
                        <Filter />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px] md:max-w-[600px]">
                    <DialogHeader className="flex-start flex">
                        <DialogTitle>Filter</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 overflow-y-scroll md:grid md:grid-cols-2">
                        {filters.map((f: any) => (
                            <div
                                className="flex items-center gap-2"
                                key={f.filter_id}
                            >
                                <Checkbox
                                    checked={data.filter?.some(
                                        (p: any) => p == f.filter_id
                                    )}
                                    onCheckedChange={(checked) =>
                                        handleFilterChange(checked, f.filter_id)
                                    }
                                />
                                <span>{f.filter_description}</span>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            onClick={(e) => handleSearchSubmit(e)}
                        >
                            Apply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
            {search !== null && search != undefined ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"ghost"}
                                onClick={(e) => handleClearSearch(e)}
                            >
                                <CircleX />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">Clear Search</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                ""
            )}
        </form>
    );
};

export default SearchBar;
