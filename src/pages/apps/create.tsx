import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import jdvLogo from "@/assets/images/jdvlogo.png";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export default function Home() {
  const user = useUser();
  const createApp = api.apps.createApp.useMutation();
  const clerk = useClerk();
  const [appName, setAppName] = useState("");
  const [view, setView] = useState<"create" | "success" | "failure">("create");
  const [id, setID] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [clipboardSuccess, setClipboardSuccess] = useState(false);
  //It's making me do this manually for some reason
  if (!user?.isSignedIn) {
    clerk.openSignIn();
  }

  if (user.isSignedIn && user.user?.id !== "user_2e2gEtDqxdu3Xx6YIGxZH9jYzbE") {
    if (typeof window !== undefined) {
      window.location.href = "https://jdvivian.co.uk/message/unready";
    }
  }
  const validateInput = (): void => {
    const isValid = appName.length >= 3;
    setIsInputValid(isValid);
    if (isValid) {
      createApp.mutate(
        { appName },
        {
          onSuccess: (data) => {
            setID(data.id);
            setView("success");
          },
          onError: (err) => {
            console.error(err);
            setView("failure");
          },
        },
      );
    }
  };

  if (view === "create") {
    return (
      <>
        <Head>
          <title>JV Logs</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={`relative flex min-h-screen flex-col items-center bg-gradient-to-b from-red-800 to-red-400 p-4 ${!user?.isSignedIn ? "blur" : ""}`}
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
              Create App
            </h1>

            <div className="flex w-3/12 flex-col gap-2">
              <Label
                className="text-left font-bold text-white"
                htmlFor="appName"
              >
                App Name
              </Label>
              {!isInputValid && (
                <Label className="font-bold text-yellow-300">
                  App name must be at least 3 characters
                </Label>
              )}
              <Input
                type="text"
                value={appName}
                className={`${isInputValid ? "" : "border-4 border-yellow-300"}`}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <Button
              className="w-3/12 border-2 border-white bg-transparent font-bold hover:bg-white hover:text-black"
              onClick={() => validateInput()}
            >
              Create App
            </Button>
          </div>
        </main>
      </>
    );
  }

  if (view === "success") {
    return (
      <>
        <Head>
          <title>JV Logs</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={`relative flex min-h-screen flex-col items-center  bg-gradient-to-b from-red-800 to-red-400 p-4 ${!user?.isSignedIn ? "blur" : ""}`}
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
            <div className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              App Created
            </div>

            <div className="grid w-1/2 grid-cols-2 gap-4">
              <div
                className="group relative flex max-w-xs cursor-pointer flex-col flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                onClick={() => {
                  navigator.clipboard
                    .writeText(appName)
                    .then(() => {
                      setClipboardSuccess(true);
                      setTimeout(() => {
                        setClipboardSuccess(false);
                      }, 2000);
                    })
                    .catch((err) => console.log(err));
                }}
              >
                <h3 className="text-2xl font-bold">Name</h3>
                <div className="invisible absolute -bottom-9 rounded-md bg-white/10 p-1 tracking-tight group-hover:visible ">
                  {clipboardSuccess
                    ? "Name copied succesfully"
                    : "Copy name to clipboard"}
                </div>
                {appName}
              </div>

              <div
                className="group relative flex max-w-xs cursor-pointer flex-col flex-col  items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                //Add the id to clipboard onclick
                onClick={() => {
                  navigator.clipboard
                    .writeText(id)
                    .then(() => {
                      setClipboardSuccess(true);
                      setTimeout(() => {
                        setClipboardSuccess(false);
                      }, 2000);
                    })
                    .catch((e) => console.log(e));
                }}
              >
                <div className="invisible absolute -bottom-9 rounded-md bg-white/10 p-1 tracking-tight group-hover:visible ">
                  {clipboardSuccess
                    ? "ID copied succesfully"
                    : "Copy ID to clipboard"}
                </div>
                <h3 className="text-2xl font-bold">ID</h3>
                <span className="text-xs">{id}</span>
              </div>
            </div>

            <div className="flex w-1/2 flex-col items-center justify-center">
              <div
                className="group relative flex w-full cursor-pointer flex-col flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                onClick={() => {
                  navigator.clipboard
                    .writeText(`https://logs.jdvivian.co.uk/api/logs`)
                    .then(() => {
                      setClipboardSuccess(true);
                      setTimeout(() => {
                        setClipboardSuccess(false);
                      }, 2000);
                    });
                }}
              >
                <div className="invisible absolute -bottom-9 rounded-md bg-white/10 p-1 tracking-tight group-hover:visible ">
                  {clipboardSuccess
                    ? "URL copied succesfully"
                    : "Copy URL to clipboard"}
                </div>
                <h3 className="text-2xl font-bold">Getting log info</h3>
                <div className="flex flex-col">
                  <div className="text-center">Send a POST Request to:</div>
                  <code className="boder-white border p-1">
                    https://logs.jdvivian.co.uk/api/logs
                  </code>
                  <div>with the following request body format</div>
                  <div>{"{"}</div>
                  <div>&nbsp; appID: &quot;{id}&quot;</div>
                  <div>&nbsp; log: {"{"}</div>
                  <div>&nbsp;&nbsp; date: [string]</div>
                  <div>
                    &nbsp;&nbsp; type: [&quot;log&quot; | &quot;error&quot; |
                    &quot;debug&quot; | &quot;warning&quot;]
                  </div>
                  <div>&nbsp;&nbsp; route: [string]</div>
                  <div>&nbsp;&nbsp; message: [string]</div>
                  <div>&nbsp; {"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
            <Link href="/">
              <Button className="border-2 border-white bg-transparent font-bold hover:bg-white hover:text-black">
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (view === "failure") {
    return (
      <>
        <Head>
          <title>JV Logs</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={`relative flex min-h-screen flex-col items-center bg-gradient-to-b from-red-800 to-red-400 p-4 ${!user?.isSignedIn ? "blur" : ""}`}
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
            <div className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Something went wrong
            </div>

            <div className="flex w-1/2 flex-col items-center justify-center">
              <div className="group relative flex w-full cursor-pointer flex-col flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white">
                <h3 className="text-2xl font-bold">
                  Your app couldn&apos;t be created
                </h3>
                <div className="flex flex-col gap-12">
                  <div className="text-center">Please try again later.</div>
                  <Button
                    className="border-2 border-white bg-transparent font-bold hover:bg-white hover:text-black"
                    onClick={() => setView("create")}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
