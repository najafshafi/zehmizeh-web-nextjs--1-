import SearchMessagesModal from "@/pages/messaging-page/partials/SearchMessagesModal";
import * as M from "./styled";
import useResponsive from "@/helpers/hooks/useResponsive";
import BackArrow from "@/public/icons/back-arrow.svg";
import SearchMessages from "./searchMessages";
import moment from "moment";
import Clock from "@/public/icons/clock.svg";

const ChatSection = () => {
  const { isDesktop } = useResponsive();

  return (
    <M.ChatPanelWrapper className="m--chatpanel">
      <header
        className={
          !isDesktop
            ? "m-panel--header m--chatpanel-header d-flex flex-col justify-content-between items-start my-2"
            : "m-panel--header m--chatpanel-header d-flex justify-content-between items-center"
        }
      >
        <div className="m--chatpanel-activeUser">
          {!isDesktop ? (
            <BackArrow onClick={() => console.log("click back arrow icon")} />
          ) : null}
          <h5 className="text-capitalize">
            {/* {getUserName(activeChat.remoteUser)}&nbsp;:&nbsp;
            {activeChat?.job_title || ''} */}
            Username{"  "}Job Title
          </h5>
        </div>
        <div className="flex items-center">
          <div className="hidden lg:block">
            <SearchMessages
              value={"searchTerm"}
              onClick={() => console.log("toggle search message")}
              onClear={() => console.log("on clear seach term")}
            />
          </div>
          <div>
            <div className="m--chatpanel-clock flex items-center g-1">
              <Clock stroke="#F2B420" />
              <span>
                {/* {getRemoteUser(activeChat)?.user_type === 'freelancer'
                  ? 'Freelancer'
                  : 'Client'} */}
                Freelancer 's timezone:{" "}
                {/* {moment()
                  .tz(getRemoteUser(activeChat).timezone)
                  .format('hh:mm A')} */}
                {moment().tz()}
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="block lg:hidden">
        <SearchMessages
          value={"searchTerm"}
          onClick={() => console.log("toggle search message")}
          onClear={() => console.log("on clear seach term")}
        />
      </div>
      <section className="m--chatpanel-body">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus
        aliquam voluptatem veritatis earum recusandae, numquam ipsa molestiae
        cupiditate inventore, aut dolores. Corrupti in cupiditate neque corporis
        porro et cum quasi!
      </section>
    </M.ChatPanelWrapper>
  );
};

export default ChatSection;
