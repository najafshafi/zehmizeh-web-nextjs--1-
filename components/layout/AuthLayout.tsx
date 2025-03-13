import logo from '@/public/icons/logo.svg';
import { Card, CardWrapper } from '@/components/styled/Auth.styled';
import BackButton from '@/components/ui/BackButton';
import { Link } from 'react-router-dom';
import Image from 'next/image';

export default function AuthLayout({
  children,
  center,
  small,
  logoClass,
  showNavigationHeader,
  onlyhomebtn,
}: {
  children?: React.ReactNode;
  center?: boolean;
  small?: any;
  logoClass?: string;
  showNavigationHeader?: boolean;
  onlyhomebtn?: boolean;
}) {
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
          <div className="header mb-2 d-flex align-items-center justify-content-between">
            <BackButton />
            <Link to="/" className="yellow-link">
              Go to Home
            </Link>
          </div>
        )}

        {onlyhomebtn && (
          <div className="header mb-2 d-flex align-items-center justify-content-start">
            <Link to="/" className="yellow-link">
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
      <Image src={logo} alt="logo" width={70}  height={70}/>
    </div>
  );
};
