import CrossIcon from "@/public/icons/cross-black.svg";
import Search from "@/public/icons/searchIcon.svg";

const SearchMessages = ({
  onClick,
  onClear,
  value,
}: {
  onClick: () => void;
  onClear: () => void;
  value: string;
}) => {
  return (
    <div className="search-messages">
      <Search />
      <input
        placeholder={"Search messages"}
        value={value}
        onMouseDown={onClick}
      />
      {value !== "" && (
        <CrossIcon className="cursor-pointer" onClick={onClear} />
      )}
    </div>
  );
};

export default SearchMessages;
