import { Trash2, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { getCountryName, getCountryFlagUrl } from "../utils/countryUtils";

const MAX_ITEMS = 6;

export default function Sidebar({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  countries,
  selectedCountry,
  setSelectedCountry,
  favorites,
  recentlyWatched,
  onPlay,
  onRemoveFav,
  onRemoveRecent,
}) {
  const [expandedCategory, setExpandedCategory] = useState(true);
  const [expandedCountry, setExpandedCountry] = useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const debouncedCategorySearch = useDebounce(categorySearch, 300);
  const debouncedCountrySearch = useDebounce(countrySearch, 300);

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(debouncedCategorySearch.toLowerCase())
  );

  const filteredCountries = countries.filter((code) =>
    getCountryName(code)
      .toLowerCase()
      .includes(debouncedCountrySearch.toLowerCase())
  );

  return (
    <aside className="w-full md:w-80 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex flex-col shadow-sm">
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 flex-1">
        {/* Search Box */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search channels..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
            />
          </div>
        </div>

        {/* Favorites */}
        <Section title="Favorites" count={favorites.length}>
          {favorites.length === 0 ? (
            <Muted>No favorites yet</Muted>
          ) : (
            <div className="space-y-2">
              {favorites.slice(0, MAX_ITEMS).map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center justify-between group bg-gradient-to-r from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 p-2 rounded-lg"
                >
                  <button
                    onClick={() => onPlay(ch)}
                    className="flex-1 text-left text-xs sm:text-sm truncate font-medium hover:text-red-600 dark:hover:text-red-400"
                  >
                    {ch.name}
                  </button>
                  <button
                    onClick={() => onRemoveFav(ch.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 transition ml-2 flex-shrink-0"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Recently Watched */}
        <Section title="Recently Watched" count={recentlyWatched.length}>
          {recentlyWatched.length === 0 ? (
            <Muted>No watch history yet</Muted>
          ) : (
            <div className="space-y-2">
              {recentlyWatched.slice(0, MAX_ITEMS).map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center justify-between group bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-2 rounded-lg"
                >
                  <button
                    onClick={() => onPlay(ch)}
                    className="flex-1 text-left text-xs sm:text-sm truncate font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    title={ch.name}
                  >
                    {ch.name}
                  </button>

                  <button
                    onClick={() => onRemoveRecent(ch.id)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                    title="Remove from recently watched"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Categories */}
        <FilterSection
          title="Categories"
          count={categories.length}
          expanded={expandedCategory}
          setExpanded={setExpandedCategory}
          searchValue={categorySearch}
          setSearchValue={setCategorySearch}
          items={filteredCategories}
          selectedItem={selectedCategory}
          onSelectItem={setSelectedCategory}
        />

        {/* Countries */}
        <FilterSection
          title="Countries"
          count={countries.length}
          expanded={expandedCountry}
          setExpanded={setExpandedCountry}
          searchValue={countrySearch}
          setSearchValue={setCountrySearch}
          items={filteredCountries}
          selectedItem={selectedCountry}
          onSelectItem={setSelectedCountry}
          renderItemLabel={(code) => (
            <div className="flex items-center gap-2 truncate">
              <img
                src={getCountryFlagUrl(code)}
                alt={code}
                loading="lazy"
                className="w-4 h-auto sm:w-5 rounded-sm flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="truncate text-xs sm:text-sm">
                {getCountryName(code)}
                <span className="ml-1 text-xs opacity-60">({code})</span>
              </span>
            </div>
          )}
        />
      </div>
    </aside>
  );
}

const Section = ({ title, children, count }) => (
  <div>
    <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
      <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
      <span className="text-xs bg-red-100 dark:bg-red-900 px-2 py-0.5 sm:py-1 rounded-full font-bold">
        {count}
      </span>
    </div>
    {children}
  </div>
);

const FilterSection = ({
  title,
  count,
  expanded,
  setExpanded,
  searchValue,
  setSearchValue,
  items,
  selectedItem,
  onSelectItem,
  renderItemLabel,
}) => (
  <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full flex justify-between p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      <span className="font-semibold text-sm sm:text-base">{title}</span>
      <ChevronRight
        className={`w-4 h-4 sm:w-5 sm:h-5 transition ${
          expanded ? "rotate-90" : ""
        }`}
      />
    </button>

    {expanded && (
      <div className="p-2 sm:p-3 space-y-2 max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelectItem(item)}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-left transition ${
              selectedItem === item
                ? "bg-red-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {renderItemLabel ? renderItemLabel(item) : item}
          </button>
        ))}

        {items.length === 0 && <Muted>No matches found</Muted>}
      </div>
    )}
  </div>
);

const Muted = ({ children }) => (
  <p className="text-xs sm:text-sm text-gray-500 text-center">{children}</p>
);
