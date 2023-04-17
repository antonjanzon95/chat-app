import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginBtn = () => {
  const { loginWithRedirect, logout, user, isLoading, isAuthenticated } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <p className="font-bold">{user?.name}</p>{" "}
            <img
              src={user?.picture}
              alt={user?.name}
              className="rounded-full w-10"
            />
          </div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </>
  );
};

export default LoginBtn;
