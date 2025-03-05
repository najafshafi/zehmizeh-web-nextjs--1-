import { Image, Button } from "react-bootstrap";
// import { useRouter } from "next/router";

const Page404: React.FC = () => {
//   const router = useRouter();

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
        The page you are looking for doesn’t exist or is unavailable.
      </div>
      <Button>Go back</Button>
    </div>
  );
};

export default Page404;