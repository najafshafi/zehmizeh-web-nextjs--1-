"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import SearchBox from "@/components/ui/SearchBox";
import useDebounce from "@/helpers/hooks/useDebounce";
import messageService from "@/helpers/http/message";
import { getUtcDate } from "@/helpers/utils/misc";
import { MessageProps } from "../messaging.types";
import { useAuth } from "@/helpers/contexts/auth-context";
import Image from "next/image";
import { VscClose } from "react-icons/vsc";

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

  const onSelect = (chat: MessageProps) => () => {
    onSelectMessage(chat);
    toggle();
  };

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[718px] transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400  focus:outline-none"
            >
              <VscClose className="h-6 w-6" />
            </button>

            <div className="text-2xl font-normal mb-3">Search messages</div>

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

            {!isFetching &&
              searchTerm === "" &&
              searchResults?.length === 0 && (
                <div className="flex justify-center mt-4">
                  <span className="text-center text-lg text-gray-500 mx-5">
                    Search for messages within message thread of &quot;
                    {jobTitle}
                    &quot; project.
                  </span>
                </div>
              )}

            {searchResults?.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto mt-4">
                {searchResults?.map((msg: MessageProps) => (
                  <div
                    className="p-3 cursor-pointer flex gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    key={msg.chat_id}
                    onClick={onSelect(msg)}
                  >
                    {isRemote(msg) ? (
                      <Image
                        src={msg.user_image}
                        className="h-8 w-8 rounded-full border border-amber-200"
                        width={32}
                        height={32}
                        alt={`${msg.first_name} ${msg.last_name}`}
                      />
                    ) : null}
                    <div>
                      <MessageText msg={msg} searchTerm={searchTerm} />
                      <span className="text-sm text-gray-500 capitalize">
                        {isRemote(msg)
                          ? `${msg.first_name} ${msg.last_name}`
                          : "You"}
                      </span>
                      <span className="text-sm text-gray-500">
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
                  <div className="text-center p-2">
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
                <div className="mt-4 text-lg text-center">
                  No messages found with &quot;{deboubcedSearch}&quot;
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
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
    const final_str = result.replace(reg, function (str: string) {
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
      className="text-lg font-normal mb-1"
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
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-[0.9rem] text-lg bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Load More
    </button>
  );
};
