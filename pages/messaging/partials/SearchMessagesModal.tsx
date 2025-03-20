// SearchedResults

/*
 * This is a prompt modal for deleting..
 */
import { useEffect, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { StyledModal } from "@/components/styled/StyledModal";
import SearchBox from "@/components/ui/SearchBox";
import useDebounce from "@/helpers/hooks/useDebounce";
import messageService from "@/helpers/http/message";
import { getUtcDate } from "@/helpers/utils/misc";
import { MessageProps } from "../messaging.types";
import { useAuth } from "@/helpers/contexts/auth-context";

const StyledWrapper = styled(StyledModal)`
  word-break: break-word;
  .title {
    margin: 0.5rem;
  }
  .modal-dialog {
    top: 10%;
  }
  .modal-body {
    border-radius: 12px;
    padding: 1.5rem;
    min-height: 400px;
  }
  .search-results {
    max-height: 300px;
    overflow-y: scroll;
  }
  .msg-item {
    border: 1px solid ${(props) => props.theme.colors.gray6};
    border-radius: 0.5rem;
    margin: 1rem 0.5rem;
    :hover {
      background-color: ${(props) => props.theme.colors.body2};
    }
  }
  .user-img {
    height: 1.875rem;
    width: 1.875rem;
    border-radius: 100%;
    border: 1px solid rgba(242, 180, 32, 0.2);
  }
  .loadmore-btn {
    text-align: center;
  }
`;

type Props = {
  show: boolean;
  toggle: () => void;
  searchTerm: string;
  onChange: (text: string) => void;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  remoteUserId: string;
  onSelectMessage: (chat: MessageProps) => void;
};

const LIMIT = 10;

const SearchMessagesModal = ({
  show,
  toggle,
  searchTerm,
  onChange,
  onClose,
  jobId,
  jobTitle,
  remoteUserId,
  onSelectMessage,
}: Props) => {
  const deboubcedSearch = useDebounce(searchTerm, 500);
  const { user } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(
      ["search-messages", deboubcedSearch],
      ({ pageParam = 1 }) =>
        messageService.searchMessages({
          job_id: jobId,
          remote_user_id: remoteUserId,
          page: pageParam,
          limit: LIMIT,
          text: deboubcedSearch,
        }),
      {
        getNextPageParam: (lastPage, allPages) => {
          const currentDataCount = allPages.reduce(
            (sum, item) => (sum += item?.data?.chatResult?.length),
            0
          );
          const total = allPages[0]?.data?.total;
          const hasNext =
            Number(currentDataCount) < Number(total)
              ? Math.ceil(Number(currentDataCount) / LIMIT) + 1
              : false;
          return hasNext;
        },
        enabled: !!deboubcedSearch,
        select: (data) => ({
          pages: data.pages.flatMap((x) => x?.data?.chatResult),
          pageParams: data.pageParams,
        }),
      }
    );

  const searchResults = useMemo(() => {
    return data?.pages || [];
  }, [data?.pages]);

  const isRemote = (message: MessageProps) => {
    return message._from_user_id !== user.user_id;
  };

  const onSelect = (chat) => () => {
    onSelectMessage(chat);
    toggle();
  };

  /** @funciton This will will autofocus input when this modal will be opened */
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const elem = document.getElementById("search-msg-input");
        if (elem) {
          elem.focus();
        }
      }, 500);
    }
  }, [show]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const onClear = () => {
    onChange("");
  };

  return (
    <StyledWrapper
      maxwidth={718}
      show={show}
      size="lg"
      onHide={onClose}
      autoFocus={true}
      animation={false}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <div className="title fs-28 font-normal mb-3">Search messages</div>
        <SearchBox
          placeholder="Search messages"
          value={searchTerm}
          onChange={onSearch}
          isLoading={isFetching}
          id="search-msg-input"
          onClear={onClear}
          maxLength={100}
          enableBorder={true}
        />

        {!isFetching && searchTerm === "" && searchResults?.length === 0 && (
          <div className="flex justify-center mt-4">
            <span className="text-center fs-18 opacity-50 mx-5">
              Search for messages within message thread of "{jobTitle}" project.
            </span>
          </div>
        )}

        {searchResults?.length > 0 && (
          <div className="search-results">
            {searchResults?.map((msg: MessageProps) => (
              <div
                className="msg-item p-3 pointer flex gap-2"
                key={msg.chat_id}
                onClick={onSelect(msg)}
              >
                {isRemote(msg) ? (
                  <img src={msg.user_image} className="user-img" />
                ) : null}
                <div>
                  {/* <div className="msg fs-18 font-normal mb-1">
                    {highlightSearch(msg.message_text)}
                  </div> */}
                  <MessageText msg={msg} searchTerm={searchTerm} />
                  <span className="msg-by fs-sm font-normal opacity-50 capitalize">
                    {isRemote(msg)
                      ? `${msg.first_name} ${msg.last_name}`
                      : "You"}
                  </span>
                  <span className="msg-date fs-sm font-normal opacity-50 flex-2">
                    {" "}
                    on{" "}
                    {getUtcDate(
                      msg.date_created.replace(/-/g, "/") || "",
                      "MMM DD[,] YYYY [|] hh:mm A"
                    )}
                  </span>
                </div>
              </div>
            ))}
            {searchResults?.length > 0 && hasNextPage ? (
              <div className="loadmore-btn p-2">
                <LoadMoreButton
                  onClick={fetchNextPage}
                  disabled={isFetchingNextPage}
                />
              </div>
            ) : null}
          </div>
        )}

        {!isFetching &&
          searchResults?.length === 0 &&
          deboubcedSearch !== "" && (
            <div className="mt-4 fs-18 text-center">
              No messages found with "{deboubcedSearch}"
            </div>
          )}
      </Modal.Body>
    </StyledWrapper>
  );
};

export default SearchMessagesModal;

const MessageText = ({
  msg,
  searchTerm,
}: {
  msg: MessageProps;
  searchTerm: string;
}) => {
  useEffect(() => {
    const result = msg.message_text;
    const reg = new RegExp(searchTerm, "gi");
    const final_str = result.replace(reg, function (str) {
      return "<b>" + str + "</b>";
    });
    const msgElem = document.getElementById(`search_msg_item_${msg.chat_id}`);
    if (msgElem) {
      msgElem.innerHTML = String(final_str);
    }
  }, [msg, searchTerm]);
  return (
    <div
      id={`search_msg_item_${msg.chat_id}`}
      className="msg fs-18 font-normal mb-1"
    />
  );
};

const LoadMoreButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <Button disabled={disabled} onClick={onClick}>
      Load More
    </Button>
  );
};
