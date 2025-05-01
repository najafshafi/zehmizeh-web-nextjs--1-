import Spinner from "@/components/forms/Spin/Spinner";

type LoaderProps = {
  height?: number;
};

function Loader({ height = 50 }: LoaderProps) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: `${height}px` }}
    >
      <Spinner className="w-16 h-16 text-gray-700" />
    </div>
  );
}

export default Loader;
