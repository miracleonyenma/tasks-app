"use client";

import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "@/components/Loader";

const SiteHeader = () => {
  const [user, loading] = useAuthState(auth);
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider).then((result) =>
        console.log(result)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="site-header sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow-sm shadow-gray-200 dark:bg-gray-900 dark:shadow-gray-700">
      <div className="wrapper w-full flex items-center gap-4 justify-between mx-auto max-w-5xl">
        <h1 className="font-bold">Tasks App</h1>

        {user ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Welcome back,{" "}
              <span className="font-bold">{user.displayName}</span>
            </p>
            <button className="btn primary sm" onClick={() => auth.signOut()}>
              Sign Out
            </button>
          </div>
        ) : loading ? (
          <Loader loading={loading} className="h-8 w-8" />
        ) : (
          <button className="btn primary sm" onClick={() => googleSignIn()}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
