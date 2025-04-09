import { useSearchFilters } from '@/helpers/contexts/search-filter-context';
import Checkbox from '@/components/forms/FilterCheckBox2';
import * as S from './Filters.styled';

type Status = 'prospects' | 'closed';
const JobStatusFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const filterHander = (key: Status, checked: boolean) => {
    let status = [...filters.job_status];

    if (checked === true && !status.includes(key)) status.push(key);

    if (checked === false && status.includes(key)) status = status.filter((st) => st !== key);

    updateFilterHandler('job_status', status);
  };

  return (
    <S.JobStatusFilter>
      <div className="d-block">
        <Checkbox
          key={`job-status-prospects`}
          className="check-filter"
          checked={filters.job_status.includes('prospects')}
          label={'Open'}
          toggle={(e) => filterHander('prospects', e.target.checked)}
        />
      </div>
      <div className="d-block mt-2">
        <Checkbox
          key={`job-status-closed`}
          className="check-filter"
          checked={filters.job_status.includes('closed')}
          label={'Closed'}
          toggle={(e) => filterHander('closed', e.target.checked)}
        />
      </div>
    </S.JobStatusFilter>
  );
};

export default JobStatusFilter;
