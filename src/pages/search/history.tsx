import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Retrieve the search history from local storage when the component mounts
    const history = JSON.parse(localStorage.getItem("searchHistory")!) || [];
    setSearchHistory(history);

    return () => {};
  }, []);

  // Function to remove a history item
  const removeHistoryItem = (item: string) => {
    const updatedHistory = searchHistory.filter(
      (historyItem) => historyItem !== item
    );
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  return (
    <ul className="gap-2 flex flex-col">
      {searchHistory.map((item, i) => (
        <li key={i} className="flex justify-between cursor-pointer">
          <div className="gap-2 flex items-center">
            <Clock size={14} />
            <Link to={`/search/${item}`}>{item}</Link>
          </div>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="w-6 h-6 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
            onClick={() => removeHistoryItem(item)}
          >
            <Trash2 size={16} />
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default SearchHistory;
