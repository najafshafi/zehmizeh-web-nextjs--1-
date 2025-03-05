"use client";
import Image from "next/image";

const WhyUs = () => {
  return (
    <div className="w-full bg-primaryLight flex items-center justify-center xl:py-[120px] py-[70px]">
      <div className="w-full max-w-[1200px]">
        <div className="grid xl:grid-cols-2 gap-2 xl:px-0 sm:px-16 px-3">
          <div className="flex flex-col gap-8 order-2 xl:order-1 xl:items-start items-center">
            <p className="font-semibold sm:text-[37px] text-[28px]">
              Why us? Because we get it.
            </p>
            <div className="flex flex-col gap-1 xl:items-start items-center">
              <p className="text-black font-bold sm:text-[24px] text-[21px]">
                Community-Crafted
              </p>
              <p className="text-black sm:text-[24px] text-[20px] xl:text-start text-center">
                ZehMizeh was born from the needs of our community. We understand
                the intricacies of your projects and the importance of finding
                the perfect collaborator.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-black font-bold sm:text-[24px] text-[21px] xl:text-start text-center">
                Safe and Secure Transactions
              </p>
              <p className="text-black sm:text-[24px] text-[20px] xl:text-start text-center">
                Say goodbye to payment woes. Enjoy seamless transactions that
                keep your focus where it belongs — on your project&apos;s
                success.
              </p>
            </div>
            <div className="flex flex-col gap-1 xl:text-start text-center">
              <p className="text-black font-bold sm:text-[24px] text-[21px]">
                A World of Expertise
              </p>
              <p className="text-black sm:text-[24px] text-[20px] xl:text-start text-center">
                Access an unparalleled array of industry experts spanning every
                sector and niche. Your project deserves nothing less than the
                best.
              </p>
            </div>
            <div className="flex flex-col gap-1 xl:text-start text-center">
              <p className="text-black font-bold sm:text-[24px] text-[21px]">
                Flexible Hiring Options
              </p>
              <p className="text-black sm:text-[24px] text-[20px] xl:text-start text-center">
                Choose the hiring model that works best for you. Whether you
                prefer to hire by project or by the hour, ZehMizeh offers the
                flexibility to meet your needs.
              </p>
            </div>
          </div>
          <div className="flex order-1 xl:order-2 items-center justify-center">
            <Image
              src={"/aboutus-explore.svg"}
              alt={"logo"}
              width={600}
              height={600}
              quality={100}
              loading="lazy"
              className=" xl:h-[600px] xl:w-[600px] w-[400px] h-[400px] "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
