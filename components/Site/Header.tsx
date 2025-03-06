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
        await createUser(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="site-header">
      <div className="wrapper">
        <Link href="/">
          <h1 className="font-bold">Tasks App</h1>
        </Link>

        {user ? (
          <div className="user-btn ">
            <figure className="img-cont">
              <Image
                src={user.photoURL || "/images/avatar.png"}
                alt="avatar"
                width={32}
                height={32}
                className=""
              />
            </figure>
            <button
              className="btn primary sm"
              onClick={() => {
                auth.signOut();
                router.refresh();
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
