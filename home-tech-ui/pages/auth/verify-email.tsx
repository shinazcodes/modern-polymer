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
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ApiState, verifyOtp } from "../../api/Auth/authSlice";
import { RootState, store } from "../../api/store";

export default function VerifyEmailPage() {
  const router = useRouter();

  const email = useSelector<RootState, string>(
    (state) => state.auth.data.email
  );
  const state = useSelector<RootState, RootState>((state) => state);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  useEffect(() => {
    if (state.auth.status === ApiState.SUCCESS && hasSubmitted) {
      router.replace("/auth/password");
    }
  }, [state, hasSubmitted]);
  return (
    <>
      <div className="mt-10 sm:mt-0">
        {/* <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
            </div>
          </div> */}
        <div className="mt-5 md:mt-0 md:col-span-2 justify-centers">
          <Formik
            initialValues={{ otp: "" }}
            validate={(values) => {
              const errors = {} as { otp: string };
              if (!values.otp) {
                errors.otp = "Required";
              }
              return errors;
            }}
            onSubmit={async (
              values,
              { setSubmitting, setFieldValue, resetForm }
            ) => {
              console.log("otp data sending:", values.otp + " " + email);
              try {
                const res = await store.dispatch(
                  verifyOtp({
                    otp: values.otp,
                    email,
                  })
                );
                if (res) {
                  setHasSubmitted(true);
                }
              } catch (err) {
                resetForm();
                console.log(err);
              }
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
              <form onSubmit={handleSubmit}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div>please enter the otp sent to your email id</div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700"
                        >
                          otp
                        </label>
                        <input
                          type="text"
                          name="otp"
                          id="otp"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.otp}
                          autoComplete="email"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        handleSubmit(undefined);
                      }}
                    >
                      verify
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
