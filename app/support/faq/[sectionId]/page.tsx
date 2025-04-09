import Support from "../../Support";

export default function SupportFaqSection() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Support />
    </div>
  );
}

export async function generateStaticParams() {
  // Pre-render these section paths at build time
  return [
    { sectionId: "basics" },
    { sectionId: "signing_up_as_a_freelancer" },
    { sectionId: "stripe" },
    { sectionId: "getting_hired" },
    { sectionId: "working_a_project" },
  ];
}
