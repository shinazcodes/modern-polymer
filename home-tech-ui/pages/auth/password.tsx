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
    await store.dispatch(login({ password, email: state.auth.data.email }));
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
      router.replace("/home");
    }
  }, [state, hasSubmitted, hasSubmittedLogin]);
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
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors = {} as {
                confirmPassword: string;
                password: string;
              };
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
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
              console.log(JSON.stringify({ ...values }));
              if (emailToken)
                try {
                  const res = await store.dispatch(
                    register({ password: values.password, emailToken })
                  );
                  setHasSubmitted(true);
                  setPassword(values.password);
                  console.log(res);
                } catch (err) {
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
                    <div>please create a password for your account</div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          password
                        </label>
                        <input
                          type="text"
                          name="password"
                          id="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          autoComplete="email"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          confirm password
                        </label>
                        <input
                          type="text"
                          name="confirmPassword"
                          id="confirmPassword"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.confirmPassword}
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
                      submit
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
