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
  const onHover = () => {
    setIsHovered((prev) => !prev);
  };
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return !isFilled ? (
    <UnfilledStarIcon
      stroke={isHovered ? '#F2B420' : 'transparent'}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      onClick={onChange}
    />
  ) : (
    <FilledStarIcon
      onClick={onChange}
      stroke={isHovered ? '#F2B420' : 'transparent'}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
    />
  );
};

export default AnimatedStar;
