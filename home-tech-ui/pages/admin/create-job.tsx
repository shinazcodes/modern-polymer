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
import { createCustomer } from "../../api/Auth/customerSlice";
import { getTechnicianList } from "../../api/Auth/techniciansSlice";
import { RootState, store } from "../../api/store";
import { EmailVerifyItems } from "../auth/signup";
import ListBoxComponent from "../components/ListBox";
import { confirmAlert } from "react-confirm-alert";
export interface CreateJobItems {
  name: string;
  fullAddress: string;
  mobileNumber: string;
  altMobileNumber: string;
  machine: string;
  email: string;
  brand: string;
}
export enum JobStatus {
  UNASSIGNED = "unassigned",
  PENDING = "pending",
  COMPLETED = "completed",
}
export const Machines = ["Washing Machine", "Fridge", "AC"];
export default function CreateJobPage() {
  //   const { state } = useSelector<RootState, string>((state) =>
  //     state.counter.value.toString()
  //   );

  const router = useRouter();
  const state = useSelector<RootState, RootState>((state) => state);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [gotTechnicians, setgotTechnicians] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const onNext = (e: React.MouseEvent) => {
    e.preventDefault();
    // router.replace("/auth/verify-email");
    // dispatch(verifyEmail({}));
  };

  const getTechnicians = async () => {
    try {
      const res = await store.dispatch(getTechnicianList("partial"));
      setgotTechnicians(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!gotTechnicians) {
      getTechnicians();
    }
  }, [gotTechnicians]);
  useEffect(() => {
    if (state.technician.status === ApiState.SUCCESS && gotTechnicians) {
      console.log(state.technician.data);
    }
    if (state.customer.status === ApiState.SUCCESS && hasSubmitted) {
      //   router.replace("/auth/verify-email");

      confirmAlert({
        title: "Job Created Successfully",
      });
    } else if (state.customer.status === ApiState.ERROR && hasSubmitted) {
      confirmAlert({
        title: "something went wrong",
      });
    }
  }, [state, hasSubmitted]);

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
            initialValues={
              {
                name: "",
                fullAddress: "",
                mobileNumber: "",
                altMobileNumber: "",
                machine: "",
                brand: "",
                email: "",
              } as CreateJobItems
            }
            validate={(values) => {
              const errors = {} as CreateJobItems;
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
              console.log(JSON.stringify({ ...values }));
              try {
                const res = await store.dispatch(
                  createCustomer({
                    ...values,
                    status: selectedTechnician ? "pending" : "unassigned",
                    assignedTo: selectedTechnician ?? "",
                  })
                );
                setHasSubmitted(true);
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
                <div className="shadow  sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="mb-4">
                      please enter the customer/job details
                    </div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="fullAddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          full address
                        </label>
                        <input
                          type="text"
                          name="fullAddress"
                          id="fullAddress"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fullAddress}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="fullAddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          email
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="fullAddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          mobile Number
                        </label>
                        <input
                          type="text"
                          name="mobileNumber"
                          id="mobileNumber"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.mobileNumber}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="fullAddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          alternate mobile Number
                        </label>
                        <input
                          type="text"
                          name="altMobileNumber"
                          id="altMobileNumber"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.altMobileNumber}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Machine
                        </label>
                        <select
                          name="machine"
                          id="machine"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.machine}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {Machines.map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          id="brand"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.brand}
                          autoComplete="email"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label className="block text-sm font-medium text-gray-700">
                          assign to
                        </label>

                        {state.technician.data && (
                          <ListBoxComponent
                            technicians={state.technician.data}
                            selectedTechnician={(
                              technician: EmailVerifyItems
                            ) => {
                              console.log(technician);
                              setSelectedTechnician(technician.email ?? "");
                            }}
                          />
                        )}
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
                      Submit
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
