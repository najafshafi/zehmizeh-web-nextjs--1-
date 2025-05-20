import Image from "next/image";
import match from "@/public/match.png";

type MatchCardProps = {
  title: string;
  count: number;
};

const MatchCard: React.FC<MatchCardProps> = ({ title, count }) => {
  return (
    <div className="w-[306px] flex bg-white flex-col items-center justify-between rounded-2xl shadow-md">
      <div className="flex mt-10 flex-col items-center justify-center gap-2">
        <Image
          src={match}
          alt={title}
          width={100}
          height={100}
          quality={100}
          loading="lazy"
        />
        <p className="text-[24px] pb-3 text-center xl:px-8">{title}</p>
      </div>
      <div className="w-full text-[16px] font-normal bg-lightYellow text-orangeYellow rounded-md py-2 flex items-center justify-center">
        <span data-testid="freelancer-count">
          {count} Freelancer{count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default MatchCard;
