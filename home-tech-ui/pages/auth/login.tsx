/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { LockClosedIcon } from "@heroicons/react/solid";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useSelector } from "react-redux";
import { ApiState, login } from "../../api/Auth/authSlice";
import { persistor, RootState, store } from "../../api/store";
import { showErrorAlert } from "../../util/util";
import { EmailVerifyItems } from "./signup";
import verifyEmail from "./verify-email";
declare var navigator: any;
export default function Example() {
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const state = useSelector<RootState, RootState>((state) => state);
  useEffect(() => {
    localStorage.removeItem("accessToken");
    persistor.purge();
  }, []);
  useEffect(() => {
    if (typeof window !== undefined) {
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/sw.js").then(
            function (registration: any) {
              // Registration was successful
              console.log(
                "ServiceWorker registration successful with scope: ",
                registration.scope
              );
            },
            function (err: any) {
              // registration failed :(
              console.log("ServiceWorker registration failed: ", err);
            }
          );
        });
      }

      window.addEventListener("beforeinstallprompt", (e) => {
        setShowPrompt(true);
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // div.style.display = 'block';
      });
    }
  });

  let deferredPrompt: any;
  // div.style.display = 'none';

  const clicked = (e: any) => {
    // hide our user interface that shows our A2HS button
    // div.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  };

  useEffect(() => {
    if (hasSubmitted && state.auth.status === ApiState.SUCCESS) {
      console.log(localStorage.getItem("userType"));
      if (localStorage.getItem("userType") === "admin") {
        router.push("/admin/customer-list");
      } else {
        router.push("/home");
      }
    }
  }, [hasSubmitted]);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      {showPrompt && (
        <div
          className="absolute w-full flex flex-row flex-wrap justify-center
        transition ease-in-out delay-1000 duration-1000 top-16 border-2 border-solid bg-slate-200 p-4 h-auto
      "
        >
          <button className="rounded-2xl bg-blue-300 p-4 " onClick={clicked}>
            Download App/Add to Home Screen
          </button>
        </div>
      )}
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-32 w-auto"
              src="/newlogo.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validate={(values) => {
              const errors = {};
              //   console.log(values);
              //   if (!values.email) {
              //     console.log(values.email);
              //     errors.email = "Required";
              //   } else if (
              //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              //   ) {
              //     console.log(values.email);

              //     errors.email = "Invalid email address";
              //   }
              return errors;
            }}
            onSubmit={async (
              values,
              { setSubmitting, setFieldValue, resetForm }
            ) => {
              console.log(values);
              try {
                const res = await store.dispatch(login(values)).unwrap();
                console.log(res);
                setHasSubmitted(true);
              } catch (err: any) {
                setHasSubmitted(false);
                showErrorAlert(err?.message ?? undefined);
                console.log(err);
                resetForm();
              }
              //   setTimeout(() => {
              //     alert(JSON.stringify({ ...values, id: file }, null, 2));
              //     setSubmitting(false);
              //   }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div> */}

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Sign in
                  </button>
                  <button
                    className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      router.push("/auth/signup");
                    }}
                    type="button"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
