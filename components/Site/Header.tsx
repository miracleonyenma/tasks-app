// ./components/Site/Header.tsx

"use client";

import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "@/components/Loader";
import createUser from "@/utils/firebase/user/createUser";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SiteHeader = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider).then(async (result) => {
        const savedUser = await createUser(result);
        console.log({ savedUser });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="site-header sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow-sm shadow-gray-200 dark:bg-gray-900 dark:shadow-gray-700">
      <div className="wrapper w-full flex items-center gap-4 justify-between mx-auto max-w-5xl">
        <Link href="/">
          <h1 className="font-bold">Tasks App</h1>
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <p className="text-sm flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Image
                src={user.photoURL || "/images/avatar.png"}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full shadow border border-gray-200 dark:border-gray-700"
              />
            </p>
            <button
              className="btn primary sm"
              onClick={() => {
                auth.signOut();
                router.push("/");
              }}
            >
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
