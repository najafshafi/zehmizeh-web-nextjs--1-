import PageTitle from "@/components/styled/PageTitle";
import { Container } from "react-bootstrap";
import * as M from "./styled";
import Tabs from "@/components/ui/Tabs";
import useResponsive from "@/helpers/hooks/useResponsive";
import ChatSection from "./ChatSection";
import { useEffect } from "react";
// Next.js imports
import { useRouter, useSearchParams } from "next/navigation";

const NewMessaging = () => {
  const { isDesktop } = useResponsive();
  const activeChat = null;
  // Next.js router
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("NewMessaging component mounted");

    // Example of getting query parameters
    const someParam = searchParams?.get("someParam");
    if (someParam) {
      console.log("Query parameter:", someParam);
    }
  }, [searchParams]);

  // Example of a navigation function using Next.js
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Container className="mb-5 content-hfill">
      <PageTitle className="mt-4">Messages (New)</PageTitle>
      <M.TabsContainer className="tabs mt-3">
        <Tabs
          tabs={[]}
          activeTab={""}
          onTabChange={(tb) => console.log("selected tabL ", tb)}
          breakPoint="1200px"
          className="tabs-container"
        />
      </M.TabsContainer>

      <M.MessageContainer>
        {!isDesktop ? (
          <div className="m-userlist--wrapper">
            This is mobile user list component
            {/* <UserList /> */}
          </div>
        ) : (
          <></>
        )}
        {isDesktop ? (
          <div className="m-userlist--wrapper">
            This is desktop user list component
          </div>
        ) : null}
        {isDesktop || (!isDesktop && activeChat !== null) ? (
          // <ChatPanel />
          <ChatSection />
        ) : null}
      </M.MessageContainer>
    </Container>
  );
};

export default NewMessaging;
