// import logo from '@/public/logo.png';
// import { Card, CardWrapper } from '@/components/styled/Auth.styled';
// import BackButton from '@/components/ui/BackButton';
// import { Link } from 'react-router-dom';
// import Image from 'next/image';

// export default function AuthLayout({
//   children,
//   center,
//   small,
//   logoClass,
//   showNavigationHeader,
//   onlyhomebtn,
// }: {
//   children?: React.ReactNode;
//   center?: boolean;
//   small?: boolean;
//   logoClass?: string;
//   showNavigationHeader?: boolean;
//   onlyhomebtn?: boolean;
// }) {
//   return (
//     <div
//       style={{
//         height: '100%',
//         display: 'grid',
//         textAlign: center ? 'center' : 'initial',
//       }}
//     >
//       <CardWrapper>
//         {showNavigationHeader && (
//           <div className=" mb-2 flex items-center justify-between">
//             <BackButton />
//             <Link to="/" className="yellow-link">
//               Go to Home
//             </Link>
//           </div>
//         )}

//         {onlyhomebtn && (
//           <div className=" mb-2 flex items-center justify-start">
//             <Link to="/" className="yellow-link">
//               Go to Home
//             </Link>
//           </div>
//         )}

//         <Card small={small}>
//           <Logo className={logoClass} />
//           {children}
//         </Card>
//       </CardWrapper>
//     </div>
//   );
// }

// const Logo = ({ className }: { className?: string }) => {
//   return (
//     <div
//       className={className || ''}
//       style={{ display: 'flex', justifyContent: 'center' }}
//     >
//       <Image src={logo} alt="logo" width={70}  height={70}/>
//     </div>
//   );
// };


// Assuming this file is named AuthLayout.tsx
import { Card, CardWrapper } from '@/components/styled/Auth.styled'; // Ensure this is correctly typed
import BackButton from '@/components/ui/BackButton';
import Link from 'next/link'; // Use Next.js Link instead of react-router-dom
import Image from 'next/image';

// Define props type
interface AuthLayoutProps {
  children?: React.ReactNode;
  center?: boolean;
  small?: boolean;
  logoClass?: string;
  showNavigationHeader?: boolean;
  onlyhomebtn?: boolean;
}

export default function AuthLayout({
  children,
  center,
  small,
  logoClass,
  showNavigationHeader,
  onlyhomebtn,
}: AuthLayoutProps) {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        textAlign: center ? 'center' : 'initial',
      }}
    >
      <CardWrapper>
        {showNavigationHeader && (
          <div className="mb-2 flex items-center justify-between">
            <BackButton />
            <Link href="/" className="yellow-link">
              Go to Home
            </Link>
          </div>
        )}

        {onlyhomebtn && (
          <div className="mb-2 flex items-center justify-start">
            <Link href="/" className="yellow-link">
              Go to Home
            </Link>
          </div>
        )}

        <Card small={small}>
          <Logo className={logoClass} />
          {children}
        </Card>
      </CardWrapper>
    </div>
  );
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={className || ''}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Image src="/zehmizeh-logo.svg" alt="logo" width={70} height={70} priority />
    </div>
  );
};

