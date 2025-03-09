import { useState } from 'react';
import { ReactComponent as UnfilledStarIcon } from 'assets/icons/unfilled-star.svg';
import { ReactComponent as FilledStarIcon } from 'assets/icons/starYellow.svg';
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
      stroke={isHovered ? '#da853c' : 'transparent'}
      onMouseEnter={() => setIsHovered(!isHovered)}
      onMouseLeave={() => setIsHovered(!isHovered)}
      onClick={onChange}
    />
  ) : (
    <FilledStarIcon
      onClick={onChange}
      stroke={isHovered ? '#da853c' : 'transparent'}
      onMouseEnter={() => setIsHovered(!isHovered)}
      onMouseLeave={() => setIsHovered(!isHovered)}
    />
  );
};

export default AnimatedStar;
