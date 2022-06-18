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

// passport size photo, full name , full address, fathers mothers name, mobile, city state pincode, adhar id, adhar photo,
// biodata, certificate, license, passbook, pancard

import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authSlice, { ApiState, verifyEmail } from "../../api/Auth/authSlice";
import { RootState, store } from "../../api/store";

export interface EmailVerifyItems {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  id?: string | number | string[] | undefined;
  adhar?: string | number | string[] | undefined;
  biodata?: string | number | string[] | undefined;
  certificate?: string | number | string[] | undefined;
  license?: string | number | string[] | undefined;
  passbook?: string | number | string[] | undefined;
  pancard?: string | number | string[] | undefined;
}
export default function SignUpPage() {
  //   const { state } = useSelector<RootState, string>((state) =>
  //     state.counter.value.toString()
  //   );

  const [file, setFile] = useState<any>();
  const [adharFile, setAdharFile] = useState<any>();
  const [photoFile, setPhotoFile] = useState<any>();
  const [passbookfile, setpassbookFile] = useState<any>();
  const [pancardfile, setpancardFile] = useState<any>();
  const [certificatefile, setcertificateFile] = useState<any>();
  const [biodatafile, setbiodataFile] = useState<any>();
  const [licensefile, setlicenseFile] = useState<any>();

  const router = useRouter();
  const state = useSelector<RootState, RootState>((state) => state);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onNext = (e: React.MouseEvent) => {
    e.preventDefault();
    // router.replace("/auth/verify-email");
    // dispatch(verifyEmail({}));
  };

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  useEffect(() => {
    if (state.auth.status === ApiState.SUCCESS && hasSubmitted) {
      router.replace("/auth/verify-email");
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
            initialValues={
              {
                firstName: "",
                lastName: "",
                streetAddress: "",
                city: "",
                state: "",
                zipCode: "",
                email: "",
                id: "",
                certificate: "",
                adhar: "",
                biodata: "",
                license: "",
                passbook: "",
                pancard: "",
              } as EmailVerifyItems
            }
            validate={(values) => {
              const errors = {} as EmailVerifyItems;
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
              console.log(JSON.stringify({ ...values, id: file }));
              try {
                const res = await store.dispatch(
                  verifyEmail({ ...values, id: file })
                );
                setFile(undefined);
                setFieldValue("id", "");
                setHasSubmitted(true);
                console.log(res);
              } catch (err) {
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
              <form onSubmit={handleSubmit}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="mb-4">
                      please enter the details below to get started. we will
                      send you an otp to the email address provided
                    </div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload passport size photo
                        </label>
                        <input
                          type="file"
                          name="photo"
                          id="photo"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.id = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          autoComplete="email"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      {/* <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>India</option>
                      </select>
                    </div> */}

                      <div className="col-span-6">
                        <label
                          htmlFor="streetAddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Street address
                        </label>
                        <input
                          type="text"
                          name="streetAddress"
                          id="streetAddress"
                          autoComplete="street-address"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.streetAddress}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.city}
                          autoComplete="address-level2"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.state}
                          autoComplete="address-level1"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ZIP / Postal code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.zipCode}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload id
                        </label>
                        <input
                          type="file"
                          name="id"
                          id="id"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.id = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload pancard
                        </label>
                        <input
                          type="file"
                          name="pancard"
                          id="pancard"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.pancard = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setpancardFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload passbook
                        </label>
                        <input
                          type="file"
                          name="passbook"
                          id="passbook"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.passbook = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setpassbookFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload certificate
                        </label>
                        <input
                          type="file"
                          name="certificate"
                          id="certificate"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.certificate = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setcertificateFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload license
                        </label>
                        <input
                          type="file"
                          name="license"
                          id="license"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.license = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setlicenseFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload biodata
                        </label>
                        <input
                          type="file"
                          name="biodata"
                          id="biodata"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.id = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          upload adhar card
                        </label>
                        <input
                          type="file"
                          name="adhar"
                          id="adhar"
                          onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                              alert("File is too big!");
                              values.adhar = undefined;
                            } else {
                              handleChange(e);

                              var file = e.target.files[0];
                              if (file)
                                getBase64(file).then((data) => {
                                  setAdharFile(data);
                                  console.log(data);
                                });
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.id}
                          autoComplete="postal-code"
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
                      Save
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
//  adhar photo,
// biodata, certificate, license, passbook, pancard
