import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import jdvLogo from "@/assets/images/jdvlogo.png";
export default function Home() {
  const user = useUser();
  const apps = api.apps.getApps.useQuery({});
  const clerk = useClerk();

  //It's making me do this manually for some reason
  if (!user?.isSignedIn) {
    clerk.openSignIn();
  }
  return (
    <>
      <Head>
        <title>JV Logs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-800 to-red-400 ${!user?.isSignedIn ? "blur" : ""}`}
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
            Your apps
          </h1>
          {(!apps.data || apps.data.length === 0) && (
            <Link
              href="/apps/create"
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">You have no apps.</h3>
              <div className="text-center">Create one to get started</div>
            </Link>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {apps.data?.map((app) => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-center text-2xl font-bold">{app.name}</h3>
                ID: {app.id}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
