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
import {
  ApiState,
  otpVerification,
  sendOtp,
  verifyOtp,
} from "../../api/Auth/authSlice";
import { RootState, store } from "../../api/store";
import { showErrorAlert } from "../../util/util";

export default function VerifyEmailPage() {
  const router = useRouter();

  const phoneNumber = useSelector<RootState, string | undefined>(
    (state) => state.auth.data.phoneNumber
  );
  const state = useSelector<RootState, RootState>((state) => state);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSubmittedOtp, setHasSubmittedOtp] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (state.auth.status === ApiState.SUCCESS && hasSubmittedOtp) {
      router.replace("/auth/password");
    }
  }, [state, hasSubmittedOtp]);

  const otpverified = async () => {
    try {
      setHasSubmitted(false);
      const res = await store
        .dispatch(
          otpVerification({
            otpVerified: true,
            phoneNumber: phoneNumber ?? "",
          })
        )
        .unwrap();
      setHasSubmittedOtp(true);
    } catch (err) {
      setHasSubmitted(false);

      showErrorAlert();
      setHasSubmittedOtp(false);
    }
  };

  useEffect(() => {
    // todo change this
    if (state.auth.otpState === ApiState.SUCCESS && hasSubmitted) {
      otpverified();
    } else if (state.auth.otpState === ApiState.ERROR && hasSubmitted) {
      setHasSubmitted(false);
      showErrorAlert();
    }
  }, [state.auth.otpState, hasSubmitted]);

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
          <Formik
            initialValues={{ otp: "", agree: undefined }}
            validate={(values) => {
              const errors = {} as { otp: string; agree: string };
              if (!values.otp) {
                errors.otp = "Required";
              }
              if (!values.agree) {
                errors.agree = "Required";
              }
              return errors;
            }}
            onSubmit={async (
              values,
              { setSubmitting, setFieldValue, resetForm }
            ) => {
              console.log("otp data sending:", values.otp + " " + phoneNumber);
              try {
                const res = await store
                  .dispatch(
                    verifyOtp({
                      otp: values.otp,
                      phoneNumber: phoneNumber ?? "",
                    })
                  )
                  .unwrap();
                if (res) {
                  setHasSubmitted(true);
                }
              } catch (err) {
                resetForm();
                setHasSubmitted(false);

                console.log(err);
                showErrorAlert();
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
                    <div>please enter the otp sent to your mobile number</div>
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
                          autoComplete="one-time-code"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.otp}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.otp ? (
                          <p className="text-red-600">please enter otp</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-right">
                      <p>didn&apos;t receive an otp? </p>
                      <span
                        className="text-blue-600 underline"
                        onClick={async () => {
                          if (count < 5) {
                            const otpRes = await store
                              .dispatch(
                                sendOtp(state.auth.data.phoneNumber ?? "")
                              )
                              .unwrap();
                            setCount(count + 1);
                          } else {
                            showErrorAlert("Maximum otp retries reached!");
                          }
                        }}
                      >
                        click here to resend
                      </span>
                      {count > 0 ? <>retries left: + {5 - count}</> : <></>}
                    </div>
                  </div>
                  <h1 className="font-bold text-lg px-4">
                    Please read and agree to the terms and conditions below
                    before continuing
                  </h1>
                  <div className="m-4 p-4 rounded-md border flex flex-row flex-wrap relative">
                    <h1 className="font-bold text-2xl underline pb-1 ">
                      Terms And Conditions
                    </h1>
                    <p>
                      This is to acknowledge that I , Mr ,{" "}
                      {state.auth.data.firstName +
                        " " +
                        state.auth.data.lastName}{" "}
                      ( Service Partner ) is a part of Home Tech World Home
                      Appliance Service Center All Kerala , which services home
                      appliances . I work as a service partner for home
                      appliances repair and services . I hereby acknowledge that
                      the home appliances provided to me by the company will be
                      completed with full responsibility and will assure to give
                      the company .50 % of the profit margin on completion of
                      each work without any interruption . I also agree to a
                      30day warranty on repairing machines and I will bear full
                      responsibility for it . If I have to leave the company for
                      any reason , I agree that I will work for a 30day notice
                      period after giving a written resignation letter to the
                      company before 30 days in advance . I assure that I will
                      clear the pending works the pending amount during this
                      period . I hereby agree that the Company can charge me
                      against any loss of the company from my side . I assure
                      that I will use full potential and will work hard for the
                      success of the HOME TECH WORLD company
                    </p>
                    <div className="flex flex-row flex-wrap place-content-end w-full">
                      <div className="p-4 right-0 relative  ">
                        <input
                          type="checkbox"
                          name="agree"
                          id="agree"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.agree}
                        />
                        &ensp; <label htmlFor="account-option">I AGREE</label>
                      </div>
                      {errors.agree ? (
                        <p className="text-red-600">
                          please agree to the terms and conditions
                        </p>
                      ) : (
                        <></>
                      )}
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
                      Verify
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
