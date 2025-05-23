import Link from "next/link";
import MatchCard from "../matchcard/MatchCard";
import { StyledButton } from "../forms/Buttons";

interface MatchData {
  name: string;
  freelancer_count: number;
}

interface MatchesProps {
  data: MatchData[];
  user: Record<string, unknown> | null;
}

const Matches = ({ data, user }: MatchesProps) => {
  // Check if user has valid data indicating they're logged in
  const isLoggedIn = user !== null && Object.keys(user).length > 0;

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
            {data && data.length > 0 ? (
              data
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((match) => {
                  return (
                    <MatchCard
                      key={match.name}
                      title={match.name}
                      count={match.freelancer_count}
                    />
                  );
                })
            ) : (
              <p>No category data available</p>
            )}
          </div>
        </div>
        {isLoggedIn && (
          <div className="flex justify-center mt-10">
            <Link href="/search?type=freelancers">
              <div className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white rounded-full">
                <StyledButton variant="outline-dark">
                  Search for Freelancers
                </StyledButton>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default Matches;
