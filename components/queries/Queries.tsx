"use client";
import Image from "next/image";
import CustomButton from "../custombutton/CustomButton";
import Link from "next/link";

const Queries = () => {
  const onLoginClick = () => {
    console.log("Login Clicked");
  };
  return (
    <div className="w-full bg-primaryLight flex items-center justify-center xl:py-[120px] py-[70px] xl:h-[50vh]">
      <div className="w-full max-w-[1320px]">
        <div className="grid xl:grid-cols-2 gap-10   h-full ">
          <div className="flex flex-col gap-6 order-2 justify-center xl:order-1 xl:items-start items-center">
            <p className="font-semibold sm:text-start text-center sm:text-[37px] text-[25px]">
              We love questions. Ask away!
            </p>
            <Link href="/customer-support">
              <CustomButton
                text="Submit an Inquiry"
                className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                onClick={onLoginClick}
              />
            </Link>
            <div className="flex flex-row gap-4 mt-5">
              <Link
                href={
                  "https://www.linkedin.com/company/zehmizeh/about/?viewAsMember=true"
                }
                className="text-black text-[18px] hover:text-blue-500"
              >
                LinkedIn
              </Link>
              <Link
                href={"/terms"}
                className="text-black text-[18px] hover:text-blue-500"
              >
                Terms of Service
              </Link>
              <Link
                href={
                  "https://app.termly.io/document/privacy-policy/82c240f5-fcef-4182-8a8b-e62b1fa9141a"
                }
                className="text-black text-[18px] hover:text-blue-500"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="flex order-1 xl:order-2 items-center justify-center">
            <Image
              src={"/support.svg"}
              alt={"logo"}
              width={300}
              height={300}
              quality={100}
              loading="lazy"
              className=" xl:h-[300px] xl:w-[300px] w-[300px] h-[300px] "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queries;
