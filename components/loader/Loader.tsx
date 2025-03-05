import { Spinner } from "react-bootstrap";

type LoaderProps = {
  height?: number;
};

function Loader({ height = 50 }: LoaderProps) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: `${height}px` }}
    >
      <Spinner animation="border" className="w-16 h-16 text-gray-700" />
    </div>
  );
}

export default Loader;