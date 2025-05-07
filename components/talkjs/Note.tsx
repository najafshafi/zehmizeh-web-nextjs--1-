import Link from "next/link";
import useResponsive from "@/helpers/hooks/useResponsive";

export default function Note() {
  const { isMobile } = useResponsive();

  return (
    <div
      className={`
      fixed bottom-0 left-0 w-full p-2 text-center font-bold z-[1000]
      ${isMobile ? "text-sm bg-white" : "text-[0.9rem] bg-[#f8f9fa] rounded"}
      text-[#0000FF]
    `}
    >
      Payments must be made through Zehmizeh. Paying outside violates our Terms
      and is against Halacha.{" "}
      <Link href="/terms-of-service#13" className="text-[#f2b420]">
        View Terms
      </Link>
    </div>
  );
}
