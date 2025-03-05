import Image from "next/image";

type MatchCardProps = {
  title: string;
  count: number;
};

const MatchCard: React.FC<MatchCardProps> = ({ title, count }) => {
  return (
    <div className="flex bg-white flex-col items-center justify-between rounded-md shadow-md">
      <div className="flex mt-10 flex-col items-center justify-center gap-3">
        <Image
          src={"/match.png"}
          alt={title}
          width={80}
          height={80}
          quality={100}
          loading="lazy"
        />
        <p className="text-[28px] pb-3 text-center">{title}</p>
      </div>
      <div className="w-full text-[20px] font-normal bg-lightYellow text-orangeYellow rounded-md py-2 flex items-center justify-center">
        {count} Freelancers
      </div>
    </div>
  );
};

export default MatchCard;
