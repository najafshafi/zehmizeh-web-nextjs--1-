"use client";
import Image from "next/image";

const HiringProcess = () => {
  return (
    <div className="w-full bg-[url('/about-bg.jpg')] bg-white flex items-center justify-center xl:py-[120px] py-[70px]">
      <div className="w-full max-w-[1200px] ">
        <div className="grid xl:grid-cols-2 gap-2 xl:px-0 sm:px-16 px-6 ">
          <div className="flex order-1 xl:order-1 items-center justify-center">
            <Image
              src={"/about-us.svg"}
              alt={"logo"}
              width={700}
              height={700}
              quality={100}
              loading="lazy"
              className=" xl:h-[700px] xl:w-[700px] sm:w-[500px] sm:h-[500px] "
            />
          </div>
          <div className="flex flex-col gap-9 xl:order-2 order-2">
            <div className="flex flex-col xl:items-start items-center gap-2">
              <p className="font-semibold sm:text-[35px] text-[30px] xl:text-start text-center">
                Hiring talent has never been simpler.
              </p>
              <p className="sm:text-[28px]  xl:text-start text-center text-[24px]">We&apos;ve made it easy.</p>
            </div>

            <ul className="list-decimal list-inside sm:text-[25px] text-[22px] flex flex-col gap-5">
              <div className="flex flex-col gap-2 xl:items-start items-center">
                <p className="font-bold">
                  <span className="font-bold mr-2">1.</span>Post Your Project:
                </p>
                <p className="ml-4 font-light sm:text-[24px] text-[20px] xl:text-start text-center">
                  Outline your project details and requirements. Let freelancers
                  apply to work with you.
                </p>
              </div>
              <div className="flex flex-col gap-2 xl:items-start items-center">
                <p className="font-bold">
                  <span className="font-bold mr-2">2.</span>Choose Your
                  Freelancer
                </p>
                <p className="ml-4 font-light sm:text-[24px] text-[20px] xl:text-start text-center">
                  Compare their rates, training, previous reviews, or any other
                  factor that&apos;s important for finding the right pick for
                  you.
                </p>
              </div>
              <div className="flex flex-col gap-2 xl:items-start items-center">
                <p className="font-bold">
                  <span className="font-bold mr-2">3.</span>Bring Your Vision to
                  Life
                </p>
                <p className="ml-4 font-light sm:text-[24px] text-[20px] xl:text-start text-center">
                  Collaborate with your chosen freelancer to turn your ideas
                  into reality. Communicate, revise, and pay all in one
                  efficient workspace.
                </p>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringProcess;
