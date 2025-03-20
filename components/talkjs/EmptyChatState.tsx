import MessageIcon from "@/public/icons/MessageIcon.svg";

export const EmptyChatState = ({ isDesktop }: { isDesktop: boolean }) => (
  <section
    className="text-center flex items-center justify-center"
    style={{ height: "100%" }}
  >
    <div>
      <MessageIcon />
      <h5 className="my-4">
        Click on the chat you want to see from the list on the{" "}
        {!isDesktop ? "top" : "left"}…
      </h5>
    </div>
  </section>
);
