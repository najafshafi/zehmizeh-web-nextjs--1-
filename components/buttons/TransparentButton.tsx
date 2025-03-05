export const TransparentButton = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <button className="border-none text-[#283eff] font-medium mb-2 hover:opacity-70">
      {children}
    </button>
  );