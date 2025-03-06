"use client";
import Image from "next/image";
import CustomButton from "../custombutton/CustomButton";

const Vision = () => {
  const onLoginClick = () => {
    console.log("Login Clicked");
  };
  return (
    <div className="w-full bg-primaryLight flex flex-col items-center justify-center xl:py-[120px] py-[70px] xl:h-[90vh] ">
      <div className="w-full max-w-[1320px] h-fit md:px-14 px-6 mt-0 xl:mt-20 mb-0 xl:mb-6 xl:px-0">
        <div className="grid xl:grid-cols-2 gap-2 xl:px-0">
          <div className="flex flex-col gap-6 order-2 xl:order-1 ">
            <div className="flex flex-col xl:items-start items-center gap-2 ">
              <p className="font-semibold sm:text-[27px] md:text-[32px] text-[25px] xl:text-start text-center">
                You have a vision. We have the talent.
              </p>
              <p className= "italic sm:text-[20px] text-[22px] font-semibold xl:text-start text-center">
                That&apos;s what we call a shidduch!
              </p>
            </div>
            <p className="text-black sm:text-[20px] text-[20px] text-center xl:text-start">
              In the world of freelancing, finding talent that truly understands
              your needs is paramount. That&apos;s where we step in.
            </p>
            <p className="text-black sm:text-[20px] text-[20px] text-center xl:text-start">
              ZehMizeh is not just another freelance marketplace; it&apos;s a
              dedicated platform crafted by the Jewish community, for the Jewish
              community. Whether you need a writer, designer, software
              developer, or accountant, ZehMizeh connects you with top-notch
              talent ready to bring your vision to life.
            </p>
            <p className="sm:text-[20px] text-[20px] font-semibold text-center xl:text-start">
              Ready to get started? Dive right in.
            </p>
            <div className="flex sm:flex-row flex-col items-center justify-center xl:justify-start xl:items-start mb:gap-6 gap-2">
              <CustomButton
                text="I'm looking for talent!"
                className="mb:px-9 px-12 py-4 mb-4 md:mb-0 mx-0 md:mx-3 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                onClick={onLoginClick}
              />
              <CustomButton
                text="I'm looking for work!"
                className="mb:px-9 px-12 py-4 mb-4 md:mb-0 mx-0 md:mx-3 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                onClick={onLoginClick}
              />
            </div>
          </div>
          <div className="flex order-1 xl:order-2 items-center justify-center">
            <Image
              src={"/vision.svg"}
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

export default Vision;
