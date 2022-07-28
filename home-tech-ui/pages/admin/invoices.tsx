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
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApiState, login, register } from "../../api/Auth/authSlice";
import { RootState, store } from "../../api/store";

export default function PasswordPage() {
  const router = useRouter();
  const emailToken = useSelector<RootState, string | undefined>(
    (state) => state.auth.emailToken
  );
  const state = useSelector<RootState, RootState>((state) => state);
  const [password, setPassword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSubmittedLogin, setHasSubmittedLogin] = useState(false);

  async function callLogin() {
    await store.dispatch(
      login({ password, email: state.auth.data.email ?? "" })
    );
  }
  useEffect(() => {
    if (
      state.auth.status === ApiState.SUCCESS &&
      hasSubmitted &&
      !hasSubmittedLogin
    ) {
      callLogin();
      setHasSubmittedLogin(true);
    }
    if (state.auth.status === ApiState.SUCCESS && hasSubmittedLogin) {
      if (localStorage.getItem("userType") === "admin") {
        router.push("/admin/create-job");
      } else {
        router.replace("/home");
      }
    }
  }, [state, hasSubmitted, hasSubmittedLogin]);
  return (
    <>
      <div className="mt-16">
        {/* <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
            </div>
          </div> */}
        <div className="mt-5 md:mt-0 md:col-span-2 justify-centers">
          <div></div>
        </div>
      </div>
    </>
  );
}
