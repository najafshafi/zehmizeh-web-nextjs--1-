"use client";
import Image from "next/image";

const WhyUs = () => {
  return (
      
      <div className="w-full bg-primaryLight flex flex-col items-center justify-center xl:py-[120px] py-[70px] xl:h-[90vh]">
        <div className="w-full max-w-[1320px] h-fit  px-6 md:px-0 ">
          <div className="grid xl:grid-cols-2 gap-2 xl:px-0  px-3 ">
            <div className="flex flex-col gap-9 order-2 xl:order-1 xl:my-6  ">
              

              <ul className="list-decimal list-inside sm:text-[20px] text-[22px] flex flex-col gap-5 xl:pr-10 md:pr-10">
              <div className="flex flex-col xl:items-start items-center gap-2 ">
                <p className="font-semibold sm:text-[32px] text-[30px] xl:text-start text-center">
                  Why us? Because we get it.
                </p>
              </div>
                <div className="flex flex-col gap-2 xl:items-start items-center">
                  <p className="font-bold">Community-Crafted</p>
                  <p className=" font-normal sm:text-[18px] text-[18px] xl:text-start text-center ">
                    ZehMizeh was born from the needs of our community. We
                    understand the intricacies of your projects and the
                    importance of finding the perfect collaborator.
                  </p>
                </div>
                <div className="flex flex-col gap-2 xl:items-start items-center">
                  <p className="font-bold">Safe and Secure Transactions</p>
                  <p className=" font-normal sm:text-[18px] text-[18px] xl:text-start text-center ">
                    Say goodbye to payment woes. Enjoy seamless transactions
                    that keep your focus where it belongs — on your
                    project&apos;s success.
                  </p>
                </div>
                <div className="flex flex-col gap-2 xl:items-start items-center">
                  <p className="font-bold">A World of Expertise</p>
                  <p className=" font-normal sm:text-[18px] text-[18px] xl:text-start text-center ">
                    Access an unparalleled array of industry experts spanning
                    every sector and niche. Your project deserves nothing less
                    than the best.
                  </p>
                </div>
                <div className="flex flex-col gap-2 xl:items-start items-center">
                  <p className="font-bold">Flexible Hiring Options</p>
                  <p className=" font-normal sm:text-[18px] text-[18px] xl:text-start text-center ">
                    Choose the hiring model that works best for you. Whether you
                    prefer to hire by project or by the hour, ZehMizeh offers
                    the flexibility to meet your needs.
                  </p>
                </div>
              </ul>
            </div>
            <div className="flex order-1 xl:order-2 items-center justify-center ">
              <Image
                src={"/aboutus-explore.svg"}
                alt={"logo"}
                width={600}
                height={600}
                quality={100}
                loading="lazy"
                className=" xl:h-[550px] xl:w-[550px] w-[400px] h-[400px] "
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default WhyUs;
