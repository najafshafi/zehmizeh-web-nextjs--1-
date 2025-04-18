import { useState } from "react";
import UnfilledStarIcon from "@/public/icons/unfilled-star.svg";
import FilledStarIcon from "@/public/icons/star-38.svg";

const AnimatedStar = ({
  isFilled,
  onChange,
}: {
  isFilled: boolean;
  onChange: any;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return !isFilled ? (
    <UnfilledStarIcon
      stroke={isHovered ? "#da853c" : "transparent"}
      onMouseEnter={() => setIsHovered(!isHovered)}
      onMouseLeave={() => setIsHovered(!isHovered)}
      onClick={onChange}
    />
  ) : (
    <FilledStarIcon
      onClick={onChange}
      stroke={isHovered ? "#da853c" : "transparent"}
      onMouseEnter={() => setIsHovered(!isHovered)}
      onMouseLeave={() => setIsHovered(!isHovered)}
    />
  );
};

export default AnimatedStar;
