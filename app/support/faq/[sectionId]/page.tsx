import FaqClientWrapper from "../FaqClientWrapper";

export default function SupportFaqSection() {
  return <FaqClientWrapper />;
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
