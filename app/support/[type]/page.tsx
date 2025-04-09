import Support from "../Support";

export default function SupportTypePage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Support />
    </div>
  );
}

export async function generateStaticParams() {
  // Pre-render these paths at build time
  return [
    { type: "faq" },
    { type: "submit_dispute" },
    { type: "general_inquiry" },
    { type: "technical_support" },
    { type: "payment_issues" },
    { type: "account_issues" },
    { type: "other" },
    // Uncomment if you want to enable general inquiry
    // { type: 'gen_inquiry' },
  ];
}
