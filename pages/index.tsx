import { useState, useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

const Home = () => {
  const { data: session } = useSession();
  const [authStatus, setAuthStatus] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const router = useRouter();

  const DOMAIN_WHITELIST = process.env.NEXT_PUBLIC_DOMAIN_WHITELIST;

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (session?.user?.email) {
        try {
          const redirectUrl = new URLSearchParams(window.location.search).get(
            "redirect"
          );
          const response = await fetch("/api/auth/isAuthenticated");

          const data = await response.json();

          if (
            data.isAuthenticated &&
            (DOMAIN_WHITELIST || "betaque.com").split(',').map(domain => domain.trim()).some(domain => data.user.user.email.endsWith(domain))
          ) {
            setAuthStatus("granted");

            Cookies.set("next-auth.session-token", data.user, {
              path: "/",
              domain: `.${(DOMAIN_WHITELIST || "betaque.com").split(',')[0].trim()}`,
              secure: true,
            });

            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              router.push("/");
            }
          } else {
            setAuthStatus("denied");
          }
        } catch (error) {
          console.error("Error checking authentication status:", error);
          setAuthStatus("denied");
          signOut({ callbackUrl: "/" });
        }
      } else {
        setAuthStatus("pending");
      }
    };
    checkAuthStatus();
  }, [session]);

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-full h-screen relative [background:linear-gradient(180deg,_#df8bbb,_#7fa1f9)] overflow-hidden flex flex-row items-start justify-center py-[131px] px-5 box-border leading-[normal] tracking-[normal]">
      <div className="h-[750px] w-[750px] absolute !m-[0] right-[-57px] bottom-[-663.33px] rounded-141xl bg-thistle [transform:_rotate(-45deg)] [transform-origin:0_0]" />
      <div className="h-[750px] w-[750px] absolute !m-[0] top-[79.33px] left-[-411px] rounded-141xl bg-thistle [transform:_rotate(-45deg)] [transform-origin:0_0]" />
      <div className="w-[698px] rounded-[49.09px] bg-form-bg flex flex-col items-start justify-start pt-[89px] pb-[150px] pr-24 pl-[107px] box-border max-w-full z-[1] text-center text-36xl-2 text-heading  mq450:gap-[26px] mq450:pl-5 mq450:pr-5 mq450:box-border mq750:gap-[51px] mq750:pt-[58px] mq750:pb-[170px] mq750:pr-12 mq750:pl-[53px] mq750:box-border self-center">
        <Link href="/" passHref>
          <img
            className="absolute top-[66.8px] left-[10%] w-[63px] h-[58.1px]"
            alt=""
            src="/logo.svg"
          />
        </Link>
        <div className="self-stretch flex flex-col items-start justify-start gap-[21.7px] max-w-full">
          <b className="self-stretch relative leading-[73px] z-[1] mq450:text-14xl mq450:leading-[43px] mq750:text-25xl mq750:leading-[57px] flex text-nowrap gap-3">
            {authStatus === "pending" && <p>Sign-in with Google</p>}
            {authStatus === "granted" && (
              <>
                <p>Sign-in Successful</p>
                <img
                  src="/success.png"
                  alt="Success"
                  className="mt-4 w-12 h-12"
                />
              </>
            )}
            {authStatus === "denied" && (
              <>
                <p>Sign-in Failed</p>
                <img src="/fail.png" alt="Failed" className="mt-4 w-12 h-12" />
              </>
            )}
          </b>
          <div className="w-[482.5px] flex flex-row items-start justify-start py-0 px-[5px] box-border max-w-full text-4xl text-paragraph">
            <div className="flex-1 relative leading-[29.91px] inline-block max-w-full z-[1] mq450:text-lg mq450:leading-[24px]">
              {authStatus === "pending" && (
                <p>
                  Sign in with Google to access all our services while
                  maintaining your privacy!
                </p>
              )}
              {authStatus === "granted" && (
                <p>You now have access to all our services!</p>
              )}
              {authStatus === "denied" && (
                <p>
                  Access denied. Please ensure you are signing in with a Betaque
                  account!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-[484px] flex flex-row items-center justify-center box-border max-w-full">
          <div
            className="relative text-lg"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "50px",
            }}
          >
            {!session && (
              <div className="flex items-center justify-center h-[150px]">
                <button
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                >
                  <img
                    className="w-6 h-6"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    loading="lazy"
                    alt="google logo"
                  />
                  <span className="text-black">Login with Google</span>
                </button>
              </div>
            )}
            {authStatus === "pending" && (
              <p>Please sign in with Google to continue.</p>
            )}
            {authStatus === "granted" && (
              <div className="flex flex-col gap-5 items-center justify-center h-[150px]">
                <p>Access granted!</p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                >
                  <span className="text-black">Logout</span>
                </button>
              </div>
            )}
            {authStatus === "denied" && (
              <div className="flex flex-col gap-5 items-center justify-center h-[150px]">
                <p>Access denied. You are not authorized.</p>{" "}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                >
                  <span className="text-black">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
