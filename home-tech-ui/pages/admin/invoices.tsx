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

import { Listbox } from "@headlessui/react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authSlice, { ApiState, verifyEmail } from "../../api/Auth/authSlice";
import { createCustomer, getCustomers } from "../../api/Auth/customerSlice";
import {
  getInvoices,
  getTechnicianList,
} from "../../api/Auth/techniciansSlice";
import { RootState, store } from "../../api/store";
import ApprovalTabs from "../components/ApprovalTabs";
import CarouselComponent from "../components/CarouselComponent";
import InvoicesTab from "../components/InvoicesTab";
import ListBoxComponent from "../components/ListBox";
import TabComponent from "../components/TabComponent";
import { JobStatus } from "./create-job";

export interface CreateJobItems {
  name: string;
  fullAddress: string;
  mobileNumber: string;
  altMobileNumber: string;
  machine: string;
  email: string;
  brand: string;
}

export const Machines = ["Washing Machine", "Fridge", "AC"];
export default function CustomerList() {
  //   const { state } = useSelector<RootState, string>((state) =>
  //     state.counter.value.toString()
  //   );

  const state = useSelector<RootState, RootState>((state) => state);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [gotTechnicians, setgotTechnicians] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getCust();
  }, [hasSubmitted]);

  const getCust = async () => {
    if (!hasSubmitted) {
      try {
        const res = await store.dispatch(getInvoices()).unwrap();
        setHasSubmitted(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getTechnicians = async () => {
    try {
      const res = await store.dispatch(getTechnicianList("partial"));
      setgotTechnicians(true);
    } catch (err) {
      console.log(err);
    }
  };
  const filteredInvoice = useMemo(() => {
    return query === ""
      ? state.technician.invoiceDetails
      : state.technician.invoiceDetails?.filter(
          (invoice) =>
            invoice?.email
              ?.toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, "")) ||
            invoice?.name
              ?.toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, "")) ||
            invoice?.mobileNumber
              .toString()
              .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [query]);

  const getCustomerSorted = useCallback(() => {
    return {
      pending: filteredInvoice?.filter((customer) => !customer?.approved),
      approved: filteredInvoice?.filter((customer) => customer?.approved),
    };
  }, [state]);

  useEffect(() => {
    if (!gotTechnicians) {
      getTechnicians();
    }
  }, [gotTechnicians]);

  useEffect(() => {
    if (state.technician.status === ApiState.SUCCESS && gotTechnicians) {
      console.log(state.technician.data);
    }
    if (state.auth.status === ApiState.SUCCESS && hasSubmitted) {
      //   router.replace("/auth/verify-email");
    }
  }, [state, hasSubmitted]);

  useEffect(() => {
    if (state.auth.status === ApiState.SUCCESS && hasSubmitted) {
      //   router.replace("/auth/verify-email");
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
            initialValues={{} as CreateJobItems}
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
                const res = await store.dispatch(getCustomers()).unwrap();
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
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white overflow-scroll h-screen sm:p-6">
                    <div className="max-w-full bg-white shadow mx-auto py-6 px-4 h-auto sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-gray-900">
                        Invoice List
                      </h1>
                      <input
                        className="  py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 w-1/2 border
          rounded-md"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="search by email, name or mobile number"
                      />
                      {filteredInvoice && filteredInvoice.length > 0 ? (
                        <InvoicesTab
                          customers={getCustomerSorted()}
                          refresh={() => {
                            setHasSubmitted(false);
                            setgotTechnicians(false);
                          }}
                        />
                      ) : (
                        <div className="w-full mt-10">no invoices found!</div>
                      )}
                    </div>
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
