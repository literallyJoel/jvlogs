import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import jdvLogo from "@/assets/images/jdvlogo.png";
import { Button } from "@/components/ui/button";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import LogTable from "@/components/LogTable";
const ViewApp = () => {
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;
  const app = api.apps.getApps.useQuery({ appId: id as string });
  const logs = api.logs.getLogs.useQuery({ appId: id as string });
  const clerk = useClerk();
  //It's making me do this manually for some reason
  if (!user?.isSignedIn) {
    clerk.openSignIn();
  }

  if (user.isSignedIn && user.user?.id !== "user_2e2gEtDqxdu3Xx6YIGxZH9jYzbE") {
    if (typeof window !== "undefined") {
      window.location.href = "https://google.com";
    }
  }
  return (
    <>
      <Head>
        <title>JV Logs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`relative flex min-h-screen flex-col items-center  bg-gradient-to-b from-red-800 to-red-400 ${!user?.isSignedIn ? "blur" : ""}`}
      >
        <Link href="https://jdvivian.co.uk">
          <Image
            src={jdvLogo}
            width={50}
            height={50}
            alt="logo"
            className="transition-delay-100 absolute left-4 top-4 rounded-full rounded-full border-2 border-white p-1 transition-colors hover:border-black hover:bg-black hover:invert"
          />
        </Link>
        {user?.isSignedIn && (
          <div className="absolute right-4 top-4">
            <SignOutButton>
              <Button className="border-2 border-white bg-transparent font-bold text-white hover:bg-white hover:text-black">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        )}
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            {app.data?.[0]?.name} Logs
          </h1>

          <div className="flex w-full flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
            <h3 className="text-center text-2xl font-bold">Logs</h3>
            <div className=" flex w-full flex-col items-center justify-center">
              <LogTable logs={logs.data ? logs.data : []} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ViewApp;
