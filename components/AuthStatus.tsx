import { useAuth } from 'helpers/contexts/auth-context';

function AuthStatus() {
  const auth: any = useAuth();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user}! <button onClick={auth.signout}>Sign out</button>
    </p>
  );
}

export default AuthStatus;
