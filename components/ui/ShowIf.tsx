function ShowIf({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: show ? 'block' : 'none',
      }}
    >
      {children}
    </div>
  );
}

export default ShowIf;
