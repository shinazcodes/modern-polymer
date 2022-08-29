import { LockClosedIcon } from "@heroicons/react/solid";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useSelector } from "react-redux";
import { ApiState, login } from "../../api/Auth/authSlice";
import { generateInvoice, Service } from "../../api/Auth/customerSlice";
import { RootState, store } from "../../api/store";
import { showErrorAlert } from "../../util/util";

export interface Services {
  name: string;
  quantity: number | string;
  price: number | string;
}
export default function Invoice() {
  const router = useRouter();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const state = useSelector<RootState, RootState>((state) => state);
  const [service, setService] = useState<Services[]>([] as Services[]);
  const [serviceName, setServiceName] = useState<any>("");
  const [serviceQuanity, setServiceQuantity] = useState<any>("");
  const [servicePrice, setServicePrice] = useState<any>("");
  const [hasCreatedService, setHasCreatedService] = useState<any>(false);
  const [editService, setEditedService] = useState<Services[]>(
    [] as Services[]
  );

  useEffect(() => {
    console.log(state.customer.selectedForInvoice);
    setService(
      state.customer.selectedForInvoice?.invoiceDetails?.services ?? []
    );
  }, []);

  useEffect(() => {
    if (hasSubmitted && state.customer.status === ApiState.SUCCESS) {
      router.replace(
        "/admin/report/" + state.customer.selectedForInvoice?._customerId
      );
    }
  }, [hasSubmitted, state]);

  useEffect(() => {
    console.log(serviceName);
    if (hasCreatedService && serviceName && servicePrice && serviceQuanity) {
      setService([
        ...service,
        {
          name: serviceName,
          quantity: serviceQuanity,
          price: servicePrice,
        },
      ]);
      setEditedService([
        ...service,
        {
          name: serviceName,
          quantity: serviceQuanity,
          price: servicePrice,
        },
      ]);
      setHasCreatedService(false);
    }
  }, [serviceName, serviceQuanity, servicePrice, hasCreatedService]);

  const openServiceDialog = () => {
    confirmAlert({
      customUI: ({ title, message, onClose }) => (
        <>
          <div className="rounded-md bg-white w-96 py-6  shadow-lg -space-y-px">
            <h1 className="m-6 mb-0">Add Service</h1>
            <div className="p-6">
              <label htmlFor="serviceName">Service Name</label>
              <input
                id="serviceName"
                name="serviceName"
                required
                onChange={(e: any) => {
                  e.preventDefault();

                  setServiceName(e.target.value);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="service name"
              />
            </div>
            <div className="p-6">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                required
                onChange={(e: any) => {
                  e.preventDefault();
                  setServiceQuantity(e.target.value);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="quantity"
              />
            </div>
            <div className="p-6">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                required
                onChange={(e: any) => {
                  e.preventDefault();

                  console.log(e.target.value);
                  setServicePrice(e.target.value);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="price"
              />
            </div>
            <button
              type="submit"
              className="group m-6 relative mx-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setHasCreatedService(true);
                onClose();
              }}
            >
              ADD
            </button>
          </div>
        </>
      ),
    });
  };

  const handleEditChange = (
    field: "name" | "price" | "quantity",
    index: number,
    value: string
  ) => {
    let serv: Services[] = [];
    service.forEach((item, i) => {
      serv.push({ ...item });
    });
    serv[index][field] = value;
    setService(serv);
    setEditedService(serv);
    console.log(value);
  };

  useEffect(() => {
    console.log(service);
    setEditedService(service);
  }, [service]);

  return (
    <>
      <div className="mt-16">
        <div className="rounded-md bg-white p-6 mx-6 shadow-lg -space-y-px">
          <Formik
            initialValues={{
              name: state.customer.selectedForInvoice?.name,
              mobileNumber: state.customer.selectedForInvoice?.mobileNumber,
              technicianName: state.customer.selectedForInvoice?.assignedTo,
              custAddress: state.customer.selectedForInvoice?.fullAddress,
              custEmail: state.customer.selectedForInvoice?.email,
              invoiceDate:
                state.customer.selectedForInvoice?.invoiceDetails
                  ?.invoiceDate ?? new Date().toISOString().slice(0, 10),
              gst: state.customer.selectedForInvoice?.invoiceDetails?.gst ?? 0,
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
                const customer = state.customer.selectedForInvoice;
                if (
                  customer?._customerId &&
                  values.mobileNumber &&
                  customer?.assignedTo &&
                  values.custEmail &&
                  values?.custAddress &&
                  values?.name
                ) {
                  try {
                    const res = await store
                      .dispatch(
                        generateInvoice({
                          _customerId: customer?._customerId,
                          mobileNumber: values.mobileNumber,
                          assignedTo: customer?.assignedTo,
                          services: service,
                          email: values.custEmail,
                          fullAddress: values?.custAddress,
                          name: values.name,
                          gst: values.gst,
                          invoiceDate: values.invoiceDate,
                        })
                      )
                      .unwrap();

                    console.log(res);
                    if (res) {
                      setHasSubmitted(true);
                    }
                  } catch (err: any) {
                    showErrorAlert(err?.message);
                  }
                }
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
                    <label htmlFor="name">Customer Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="customer name"
                    />
                  </div>
                  <div className="pb-6 ">
                    <label htmlFor="technicianName">Serviced By</label>
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
                    <label htmlFor="mobileNumber">Customer Phone Number</label>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.mobileNumber}
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="customer phone number"
                    />
                  </div>
                  <div className="pb-6 ">
                    <label htmlFor="custEmail">Customer Email</label>
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
                  <div className="pb-6 min-h-28">
                    <label htmlFor="password">Customer Address</label>
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
                  <div className="pb-6">
                    <label htmlFor="gst">GST%</label>
                    <input
                      id="gst"
                      name="gst"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.gst}
                      required
                      className="appearance-none h-full rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="gst"
                    />
                  </div>
                  <div className="pb-6 ">
                    <label htmlFor="invoiceDate">Date</label>
                    <input
                      id="invoiceDate"
                      name="invoiceDate"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.invoiceDate}
                      required
                      className="appearance-none h-full rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="invoice dateFservF"
                    />
                  </div>
                  <button
                    onClick={() => {
                      openServiceDialog();
                    }}
                    type="button"
                    className="group m-auto relative mb-4  w-44 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Service
                  </button>
                </div>
                {!!service?.length && (
                  <div className="w-full">
                    <div className="flex flex-col w-1/2 m-auto mt-10">
                      <div className="flex flex-row flex-wrap w-full m-auto align-middle justify-around">
                        <h1 className="w-1/3 text-center">Name</h1>
                        <h1 className="w-1/3 text-center">Quantity</h1>
                        <h1 className="w-1/3 text-center">Price</h1>
                      </div>
                      {service.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-row flex-wrap  w-full m-auto align-middle justify-around"
                        >
                          <div className="pb-6 w-1/3 text-center h-28">
                            <input
                              id="name"
                              name="name"
                              required
                              defaultValue={item.name}
                              onChange={(e) => {
                                handleEditChange("name", index, e.target.value);
                              }}
                              className="appearance-none h-50 rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              placeholder="customer address"
                            />
                          </div>
                          <div className="pb-6 w-1/3 text-center h-28">
                            <input
                              id="quantity"
                              name="quantity"
                              required
                              defaultValue={item.quantity}
                              onChange={(e) => {
                                handleEditChange(
                                  "quantity",
                                  index,
                                  e.target.value
                                );
                              }}
                              className="appearance-none h-50 rounded-none relative block  px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              placeholder="customer address"
                            />
                          </div>
                          <div className="pb-6 w-1/3 text-center h-28">
                            <input
                              id="price"
                              name="price"
                              defaultValue={item.price}
                              required
                              onChange={(e) => {
                                handleEditChange(
                                  "price",
                                  index,
                                  e.target.value
                                );
                              }}
                              className="appearance-none h-50 rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              placeholder="customer address"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={async () => {
                          // openServiceDialog();
                          try {
                            const customer = state.customer.selectedForInvoice;
                            if (
                              customer?._customerId &&
                              values.mobileNumber &&
                              customer?.assignedTo &&
                              values.custEmail &&
                              values?.custAddress &&
                              values?.name
                            ) {
                              const res = await store.dispatch(
                                generateInvoice({
                                  _customerId: customer?._customerId,
                                  mobileNumber: values.mobileNumber,
                                  assignedTo: customer?.assignedTo,
                                  services: service,
                                  email: values.custEmail,
                                  fullAddress: values?.custAddress,
                                  name: values.name,
                                  gst: values.gst,
                                  invoiceDate: values.invoiceDate,
                                })
                              );

                              console.log(res);
                              if (res) {
                                setHasSubmitted(true);
                              }
                            }
                          } catch (err) {
                            setHasSubmitted(false);

                            console.log(err);
                            // resetForm();
                          }
                        }}
                        type="button"
                        className="group m-auto relative mb-4  w-44 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        confirm changes
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
