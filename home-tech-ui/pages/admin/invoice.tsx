import { LockClosedIcon } from "@heroicons/react/solid";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useSelector } from "react-redux";
import { ApiState, login } from "../../api/Auth/authSlice";
import { RootState, store } from "../../api/store";

export default function Invoice() {
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const state = useSelector<RootState, RootState>((state) => state);

  useEffect(() => {});

  useEffect(() => {
    if (hasSubmitted && state.auth.status === ApiState.SUCCESS) {
      console.log(localStorage.getItem("userType"));
      if (localStorage.getItem("userType") === "admin") {
        router.push("/admin/create-job");
      } else {
        router.replace("/home");
      }
    }
  }, [hasSubmitted]);

  const openServiceDialog = () => {
    confirmAlert({
      customUI: () => (
        <>
          <div className="rounded-md bg-white w-96 py-6  shadow-lg -space-y-px">
            <h1 className="m-6 mb-0">Add Service</h1>
            <div className="p-6">
              <label htmlFor="serviceName" className="sr-only">
                Service Name
              </label>
              <input
                id="serviceName"
                name="serviceName"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="service name"
              />
            </div>
            <div className="p-6">
              <label htmlFor="quantity" className="sr-only">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="quantity"
              />
            </div>
            <div className="p-6">
              <label htmlFor="price" className="sr-only">
                Price
              </label>
              <input
                id="price"
                name="price"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="price"
              />
            </div>
            <button
              type="submit"
              className="group m-6 relative mx-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                //   router.push("/auth/signup");
              }}
            >
              ADD
            </button>
          </div>
        </>
      ),
    });
  };

  return (
    <>
      <div className="mt-16">
        <div className="rounded-md bg-white p-6 mx-6 shadow-lg -space-y-px">
          <Formik
            initialValues={{
              custName: "",
              custMob: "",
              technicianName: "",
              custAddress: "",
              custEmail: "",
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
              try {
                // const res = await store.dispatch(login(values));
                // console.log(res);
                // if (res) {
                //   setHasSubmitted(true);
                // }
              } catch (err) {
                setHasSubmitted(false);

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
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6 flex flex-row flex-wrap align-middle justify-center m-auto w-full"
              >
                <div className="rounded-md shadow-sm z-0 w-1/3">
                  <div className="pb-6 ">
                    <label htmlFor="custName" className="sr-only">
                      Customer Name
                    </label>
                    <input
                      id="custName"
                      name="custName"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.custName}
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="customer name"
                    />
                  </div>
                  <div className="pb-6 ">
                    <label htmlFor="technicianName" className="sr-only">
                      Serviced By
                    </label>
                    <input
                      id="technicianName"
                      name="technicianName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.technicianName}
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="serviced by"
                    />
                  </div>
                  <div className="pb-6 ">
                    <label htmlFor="custMob" className="sr-only">
                      Customer Phone Number
                    </label>
                    <input
                      id="custMob"
                      name="custMob"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.custMob}
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="customer phone number"
                    />
                  </div>
                  <div className="pb-6 ">
                    <label htmlFor="custEmail" className="sr-only">
                      Customer Email
                    </label>
                    <input
                      id="custEmail"
                      name="custEmail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.custEmail}
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="customer email"
                    />
                  </div>
                  <div className="pb-6  h-28">
                    <label htmlFor="password" className="sr-only">
                      Customer Address
                    </label>
                    <textarea
                      id="custAddress"
                      name="custAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.custAddress}
                      required
                      className="appearance-none h-full rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="customer address"
                    />
                  </div>
                  <button
                    onClick={() => {
                      openServiceDialog();
                    }}
                    className="group m-auto relative mb-4  w-44 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Service
                  </button>
                  <button
                    type="submit"
                    className="group m-auto relative w-44 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      //   router.push("/auth/signup");
                    }}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Submit
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
