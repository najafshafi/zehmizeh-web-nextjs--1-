import { useEffect, useMemo, useState } from "react";
import * as T from "./style";
import { AppDispatch, RootState } from "@/store/redux/store";
import { useDispatch } from "react-redux";
import { filterHandler } from "@/store/redux/slices/talkjsSlice";
import { useSelector } from "react-redux";
import { removeDuplicateValues } from "@/helpers/utils/helper";
import {
  ChatFilterAction,
  ChatUser,
  SelectOption,
} from "@/store/redux/slices/talkjs.interface";
import { GroupBase, StylesConfig } from "react-select";

// Define TalkJsChat state interface
interface TalkJsChatState {
  chatlist: ChatUser[];
  isFilterApplied: boolean;
  filters: {
    job?: string;
    status?: string;
    type?: string;
  };
}

const typeOptions = [
  { value: "job", label: "Projects" },
  { value: "proposal", label: "Proposals" },
  { value: "invite", label: "Invites" },
];

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

const ChatFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { chatlist, isFilterApplied, filters } = useSelector(
    (state: RootState) =>
      (state as unknown as { talkJsChat: TalkJsChatState }).talkJsChat
  );

  const [job, setJob] = useState<SelectOption | undefined>(undefined);
  const [chatStatus, setChatStatus] = useState<SelectOption | undefined>(
    undefined
  );
  const [type, setType] = useState<SelectOption | undefined>(undefined);

  const jobFilterDropdown = useMemo(() => {
    let options = chatlist.map((chat: ChatUser) => {
      return {
        label: chat.custom.projectName || "",
        value: chat.custom.jobPostId || "",
      };
    });

    options = removeDuplicateValues(options, "value");
    return options;
  }, [chatlist]);

  const selectStyles: StylesConfig<unknown, boolean, GroupBase<unknown>> = {
    container: (base) => {
      return { ...base, width: "250px", fontSize: "14px" };
    },
    option: (base) => {
      return { ...base, fontSize: "14px", cursor: "pointer" };
    },
  };

  const applyFilter = (
    action: ChatFilterAction,
    selectedOption?: SelectOption
  ) => {
    if (action === "job") setJob(selectedOption);
    if (action === "status") setChatStatus(selectedOption);
    if (action === "type") setType(selectedOption);

    dispatch(filterHandler({ action, selectedOption }));
  };

  const resetFilter = () => {
    setJob(undefined);
    setChatStatus(undefined);
    setType(undefined);
    applyFilter("reset");
  };

  const handler = () => {
    const selected_job = jobFilterDropdown.find(
      (jb: SelectOption) => jb.value === filters.job
    );
    if (selected_job) setJob(selected_job);

    const selected_type = typeOptions.find(
      (jb: SelectOption) => jb.value === filters.type
    );
    if (selected_type) setType(selected_type);

    const selected_status = statusOptions.find(
      (jb: SelectOption) => jb.value === filters.status
    );
    if (selected_status) setChatStatus(selected_status);
  };

  useEffect(() => {
    handler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <T.Filters>
      <T.Select
        options={jobFilterDropdown}
        value={job}
        onChange={(value) => applyFilter("job", value as SelectOption)}
        placeholder="Filter by Project"
        components={{
          IndicatorSeparator: () => null,
        }}
        styles={selectStyles}
      />

      <T.Select
        onChange={(value) => applyFilter("status", value as SelectOption)}
        value={chatStatus}
        components={{ IndicatorSeparator: () => null }}
        options={statusOptions}
        placeholder="Status"
      />

      <T.Select
        components={{ IndicatorSeparator: () => null }}
        value={type}
        onChange={(value) => applyFilter("type", value as SelectOption)}
        options={typeOptions}
        placeholder="Type"
      />
      {isFilterApplied && (
        <T.ResetButton onClick={() => resetFilter()}>Reset</T.ResetButton>
      )}
    </T.Filters>
  );
};

export default ChatFilter;
