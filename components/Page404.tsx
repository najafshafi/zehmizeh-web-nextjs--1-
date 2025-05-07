import Image from "next/image";
import { useRouter } from "next/router";
import { StyledButton } from "./forms/Buttons";

function Page404() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <Image
        src="images/notFound.png"
        width={250}
        height={200}
        alt="no-page-found"
      />

      <div className="text-[3.25rem] mt-10 text-yellow font-bold">40s4</div>
      <div className="opacity-90 mb-[0.938rem] mt-5 text-4xl font-bold">
        Page not found!
      </div>
      <div className="text-black mb-9 font-medium text-base text-center">
        The page you are looking for doesn&apos;t exist or is unavailable.
      </div>
      <StyledButton onClick={goBack}>Go back</StyledButton>
    </div>
  );
}

export default Page404;
