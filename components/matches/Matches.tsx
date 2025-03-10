import { matchesData } from "@/lib/matchesData";
import MatchCard from "../matchcard/MatchCard";

const Matches = () => {
  return (
    <div className="gap-7 w-full flex flex-col items-center justify-center py-16 bg-secondary bg-[url('/about-bg.jpg')]">
      <div className="w-full max-w-[1320px] flex flex-col items-center justify-center h-fit md:px-14 px-6 mt-0 mb-0 xl:px-0">
        <p className="sm:text-[32px] text-[30px] font-bold">Meet Your Match</p>
        <p className="text-center w-full max-w-[950px] text-[24px]">
          From concept to completion, we have the talent to transform your
          vision into reality. Explore our categories and find your ideal match
          today!
        </p>
        <div className="w-full mt-10 xl:px-0">
          <div className="max-w-[1400px] flex flex-wrap justify-center gap-6  px-4 xl:px-0">
            {matchesData.map((match) => (
              <MatchCard
                key={match.title}
                title={match.title}
                count={match.count}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Matches;
