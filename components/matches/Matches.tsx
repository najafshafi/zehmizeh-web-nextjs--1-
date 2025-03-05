import { matchesData } from "@/lib/matchesData";
import MatchCard from "../matchcard/MatchCard";

const Matches = () => {
  return (
    <div className="gap-7 w-full flex flex-col items-center justify-center py-16 bg-secondary bg-[url('/about-bg.jpg')]">
      <p className="sm:text-[40px] text-[30px] font-bold">Meet Your Match</p>
      <p className="text-center w-full max-w-[1200px] text-[26px]">
        From concept to completion, we have the talent to transform your vision
        into reality. Explore our categories and find your ideal match today!
      </p>
      <div className="w-full max-w-[1200px] mt-10">
        <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-6 xl:px-0 px-8">
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
  );
};
export default Matches;
