import SearchIcon from "@/assets/icons/search.svg";

interface SearchProps {
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  containerClassName?: string;
  fetching?: boolean;
  searchIcon?: React.ReactNode;
}

const Search = ({
  placeholder = "Search",
  onChange,
  value,
  containerClassName,
  fetching,
  searchIcon,
}: SearchProps) => {
  return (
    <div
      className={`max-w-[574px] h-[50px] flex items-center px-3 border border-gray-300 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:border-black ${containerClassName}`}
    >
      {searchIcon || <SearchIcon />}
      <input
        type="text"
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className="flex-1 h-10 border-none text-base font-normal focus:ring-0 outline-none"
      />
      {fetching && (
        <div className="ml-2">
          <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Search;