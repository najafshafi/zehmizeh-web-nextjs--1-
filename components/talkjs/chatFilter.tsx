import { useCallback, useEffect, useMemo, useState } from 'react';
import * as T from './style';
import { AppDispatch, RootState } from '@/store/redux/store';
import { useDispatch } from 'react-redux';
import { filterHandler } from '@/store/redux/slices/talkjsSlice';
import { useSelector } from 'react-redux';
import { removeDuplicateValues } from '@/helpers/utils/helper';
import { ChatFilterAction, SelectOption } from '@/store/redux/slices/talkjs.interface';

const typeOptions = [
  { value: 'job', label: 'Projects' },
  { value: 'proposal', label: 'Proposals' },
  { value: 'invite', label: 'Invites' },
];

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

const ChatFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { chatlist, isFilterApplied, filters } = useSelector((state: RootState) => state.talkJsChat);

  const [job, setJob] = useState<SelectOption>();
  const [chatStatus, setChatStatus] = useState<SelectOption>();
  const [type, setType] = useState<SelectOption>();

  const jobFilterDropdown = useMemo(() => {
    let options = chatlist.map((chat) => {
      return {
        label: chat.custom.projectName,
        value: chat.custom.jobPostId,
      };
    });

    options = removeDuplicateValues(options, 'value');
    return options;
  }, [chatlist]);

  const selectStyles = {
    container: (base) => {
      return { ...base, width: '250px', fontSize: '14px' };
    },
    option: (base) => {
      return { ...base, fontSize: '14px', cursor: 'pointer' };
    },
  };

  const applyFilter = (action: ChatFilterAction, selectedOption?: SelectOption) => {
    if (action === 'job') setJob(selectedOption);
    if (action === 'status') setChatStatus(selectedOption);
    if (action === 'type') setType(selectedOption);

    dispatch(filterHandler({ action, selectedOption }));
  };

  const resetFilter = () => {
    setJob(null);
    setChatStatus(null);
    setType(null);
    applyFilter('reset');
  };

  const handler = () => {
    const selected_job = jobFilterDropdown.find((jb) => jb.value === filters.job);
    if (selected_job) setJob(selected_job);

    const selected_type = typeOptions.find((jb) => jb.value === filters.type);
    if (selected_type) setType(selected_type);

    const selected_status = statusOptions.find((jb) => jb.value === filters.status);
    if (selected_status) setChatStatus(selected_status);
  };

  useEffect(() => {
    handler();
  }, [filters]);

  return (
    <T.Filters>
      <T.Select
        options={jobFilterDropdown}
        value={job}
        onChange={(value: SelectOption) => applyFilter('job', value)}
        placeholder="Filter by Project"
        components={{
          IndicatorSeparator: () => null,
        }}
        styles={selectStyles}
      />

      <T.Select
        onChange={(value: SelectOption) => applyFilter('status', value)}
        value={chatStatus}
        components={{ IndicatorSeparator: () => null }}
        options={statusOptions}
        placeholder="Status"
      />

      <T.Select
        components={{ IndicatorSeparator: () => null }}
        value={type}
        onChange={(value: SelectOption) => applyFilter('type', value)}
        options={typeOptions}
        placeholder="Type"
      />
      {isFilterApplied && <T.ResetButton onClick={() => resetFilter()}>Reset</T.ResetButton>}
    </T.Filters>
  );
};

export default ChatFilter;
