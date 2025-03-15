"use client"
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StyledButton } from '@/components/forms/Buttons';
import GradientText from '@/components/styled/GradientText';
import { Card } from '@/components/styled/Auth.styled';
import CheckMark from '@/public/icons/check-mark.svg';
import logo from '@/public/icons/logo.svg';
import Image from 'next/image';

const Wrapper = styled.div`
  height: 100vh;
  .success-icon {
    background: #34a853;
    box-shadow: 0px 13px 26px -4px rgba(52, 168, 83, 0.31);
    width: 104px;
    height: 104px;
    border-radius: 50%;
    display: inlinflex;
    justent: center;
    align-items: center;
  }
  h2 {
    opacity: 1;
  }
`;

export default function Terms() {
  const [isAccepted, setIsAccepted] = React.useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   if (!user?.email_id) {
  //     navigate('/register');
  //     return;
  //   }
  // });

  const onAccept = () => setIsAccepted(true);
  const onLeave = () => router.push('/');

  if (isAccepted) {
    return (
      <Wrapper className="flex justify-center items-center">
        <Card small={true}>
          <div className="text-center">
            <span className="success-icon">
              <CheckMark className="success-icon" />
            </span>
            <h2 className="mt-4">Mazal tov - your account has been created successfully!</h2>
            <Link 
              href="/complete-profile"
              className="block"
            >
              <StyledButton className="mt-4" height={56}>
                {/* {user.user_type == 'client'
                  ? 'Go to Profile'
                  : 'Start Setting Profile'} */}
                Continue to Set Profile
              </StyledButton>
            </Link>
          </div>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="flex justify-center items-center">
      <Card small={true}>
        <div className="logo">
          <Image src={logo} alt="logo" width={70} height={70}/>
        </div>
        <h1>Accept Terms</h1>
        <p className="terms-description">
          You understand that it is against Jewish law and our <GradientText>terms and conditions</GradientText> to
          leave outside the ZehMizeh platform to acquire a freelancer whom you found on the platform.
        </p>
        <footer className="flex justify-end gap-1 mt-4">
          <StyledButton padding="0 2rem" variant="outline-primary" height={56} onClick={onLeave}>
            Leave Platform
          </StyledButton>
          <StyledButton padding="0 2rem" height={56} onClick={onAccept}>
            Accept
          </StyledButton>
        </footer>
      </Card>
    </Wrapper>
  );
}
