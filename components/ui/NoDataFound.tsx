import NoDataFoundIcon from "@/public/icons/nodatafound.svg";

interface Prop {
  className?: string;
  title?: string | React.ReactNode;
}

const NoDataFound = ({ className, title }: Prop) => {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <NoDataFoundIcon />

      <div className="mt-0 text-base font-normal text-center">
        {title || "No data found"}
      </div>
    </div>
  );
};

export default NoDataFound;
