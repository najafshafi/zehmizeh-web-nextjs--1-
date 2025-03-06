import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#fefbf4] w-full flex flex-col justify-center items-center">
      <div className="px-[1rem] lg:px-0 min-h-[70vh] ">
        <div
          className="flex flex-col gap-12 max-w-[746px] container text-[#212529] py-16 px-[0.75rem] lg:px-0"
          style={{ letterSpacing: "0.25px", lineHeight: "1.2" }}
        >
          <h1 className="text-[2rem] font-bold">Customer Support</h1>

          <div className="flex items-center justify-center w-full border border-gray-300 rounded-[16px]">
            <Image
              src="/images/support.png"
              width={400}
              height={400}
              className="max-w-[50%]"
              alt="support"
            />
          </div>

          <div className="flex flex-col">
            <div className="text-2xl font-bold" style={{ lineHeight: "36px" }}>
              We&apos;d love to hear from you!
            </div>
            <p className="text-lg mt-2">
              Please don&apos;t hesitate to reach out to{" "}
              <a
                className="text-[#f2b420]"
                href="mailto:info@zehmizeh.com"
                target="blank"
              >
                info@zehmizeh.com
              </a>{" "}
              with any questions.
            </p>
            <p className="text-lg mt-4">
              If you already have an account, you can contact the staff by
              submitting a general inquiry. Just sign in and navigate to the
              “Help” page from the menu at the top of the page. Submit the
              details of your question on the “General Inquiry” page… ZMZ staff
              should get back to you soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
