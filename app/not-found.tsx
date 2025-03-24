"use client";
import { Image } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/custombutton/CustomButton";

const Page404: React.FC = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <Image
        src="/images/notFound.png"
        width="250px"
        height="200px"
        alt="no-page-found"
      />

      <div className="text-yellow-500 text-5xl font-bold mt-10">404</div>
      <div className="font-bold text-2xl mt-5 opacity-90">Page not found!</div>
      <div className="text-black text-center text-lg mb-10">
        The page you are looking for doesn&apos;t exist or is unavailable.
      </div>
      <CustomButton
        text="Go back"
        className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
        onClick={goBack}
      />
    </div>
  );
};

export default Page404;
