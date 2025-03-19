/*
 * This is the ...Ratings... filter
 */
import Radio from '@/components/forms/Radio';
import { RATINGS_FILTER_ENUM } from '@/helpers/const/constants';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';

const RatingsFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();
  const onSelectItem = (item: string) => {
    updateFilterHandler('rating', [item]);
  };

  return (
    <div>
      {Object.entries(RATINGS_FILTER_ENUM).map(([value, label]) => {
        return (
          <div key={value} className="filter__checkbox__row d-flex align-items-center">
            <Radio
              value={value}
              checked={filters?.rating?.includes(value)}
              toggle={() => onSelectItem(value)}
              label={label}
              className="d-flex align-items-center"
            />
          </div>
        );
      })}
    </div>
  );
};

export default RatingsFilter;
