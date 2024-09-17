import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import SearchHistory from "./history";

export const SearchPage = () => {
  const [searchTerm, SetSearchTerm] = useState("");
  const navigator = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    // Retrieve existing history from local storage
    const existingHistory =
      JSON.parse(localStorage.getItem("searchHistory")!) || [];

    // Add the new search term if it's not already in the history
    if (!existingHistory.includes(searchTerm)) {
      const updatedHistory = [...existingHistory, searchTerm];
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }

    navigator("/search/" + searchTerm);
  };

  return (
    <section>
      <div className="container space-y-8">
        <div className="gap-2 grid grid-cols-12">
          <div className="col-span-10">
            <IconInput
              type="search"
              className="border"
              icon={Search}
              onChange={(e) => SetSearchTerm(e.target.value)}
              onKeyUp={handleKeyPress}
              autoFocus={true}
              placeholder="Search by Name or Category"
            />
          </div>
          <Button
            size={"icon"}
            className="h-11 w-12 col-span-1"
            onClick={handleSearch}
          >
            <Search />
          </Button>
        </div>
        <div>
          <p>Lastest search</p>
          <SearchHistory />
        </div>
      </div>
    </section>
  );
};
