import { useState } from "react";
import UnfilledStarIcon from "../../public/icons/unfilled-star.svg";
import FilledStarIcon from "../../public/icons/starYellow.svg";
const AnimatedStar = ({
  isFilled,
  onChange,
}: {
  isFilled: boolean;
  onChange: () => void;
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
