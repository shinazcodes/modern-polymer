import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ApiState,
  assignJob,
  Customer,
  customerSlice,
  startJob,
} from "../../api/Auth/customerSlice";
import { RootState, store } from "../../api/store";
import { EmailVerifyItems } from "../auth/signup";
import AssignedTechnician from "./AssignedTechnician";
import ListBoxComponent from "./ListBox";
import jwt_decode from "jwt-decode";
import { sendSms } from "../../api/Auth/authSlice";
import { getSMS, SMS } from "../../api/model";
import { showErrorAlert } from "../../util/util";
import { confirmAlert } from "react-confirm-alert";
import { Formik } from "formik";

export default function CarouselComponent({
  customers,
  technicians,
  refresh,
}: {
  customers: Customer[];
  technicians?: EmailVerifyItems[];
  refresh: () => void;
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [assignedTechnician, setAssignedTechnician] =
    useState<EmailVerifyItems>();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(
    {} as Customer
  );
  const [cancelReason, setcancelReason] = useState("");
  const [isJobRemoved, setIsJobRemoved] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems
  );
  const [assignedJob, setHasAssignedJob] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);
  const state = useSelector<RootState, RootState>((state) => state);

  useEffect(() => {
    if (state.customer.status === ApiState.SUCCESS && assignedJob) {
      refresh();
      setHasAssignedJob(false);
    }
  }, [state, assignedJob]);

  const router = useRouter();
  useEffect(() => {
    if (assignedJob && state.customer.status === ApiState.SUCCESS) {
      if (!isJobRemoved) {
        store.dispatch(
          sendSms({
            mobileNumber: selectedCustomer.mobileNumber,
            sms: getSMS(SMS.WORK_ASSIGNED_CUSTOMER, {
              machineType: selectedCustomer.machine,
              technicianMob: assignedTechnician?.phoneNumber,
              technicianName:
                assignedTechnician?.firstName +
                " " +
                assignedTechnician?.lastName,
            }),
          })
        );
        setHasAssignedJob(false);

        store.dispatch(
          sendSms({
            mobileNumber: assignedTechnician?.phoneNumber!,
            sms: getSMS(SMS.WORK_ASSIGNED_TECHNICIAN, {
              machineType: selectedCustomer.machine,
              custName: selectedCustomer?.name,
              brand: selectedCustomer.brand,
              custEmail: selectedCustomer.email,
            }),
          })
        );
        setHasAssignedJob(false);
      } else {
        store.dispatch(
          sendSms({
            mobileNumber: selectedCustomer?.mobileNumber!,
            sms: getSMS(SMS.CANCELLATION, {
              machineType: selectedCustomer.machine,
            }),
          })
        );
        confirmAlert({
          title: "Success",
          message: "job unassigned!",
          buttons: [
            {
              label: "ok",
              onClick: () => {
                router.push("/home");
              },
            },
          ],
        });

        setIsJobRemoved(false);
      }
      setHasAssignedJob(false);
    }
  }, [state, assignedJob, isJobRemoved]);

  useEffect(() => {
    if (jobStarted && state.customer.status === ApiState.SUCCESS) {
      confirmAlert({
        title: "Job Started",
        message: "The job has started successfully...",
      });
      router.push("/home");
    }
  }, [jobStarted, state]);

  return (
    <div className="w-full">
      <div className="mx-0 w-full rounded-2xl  p-2">
        <div>
          {customers.map((customer: Customer, index) => {
            return (
              <Disclosure key={index}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex mt-2 w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
                      <span>
                        {customer.name} - {customer.machine} - {customer.brand}
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-black">
                      <p className="font-bold">
                        name:{" "}
                        <span className="font-normal">{customer.name}</span>
                      </p>
                      <p className="font-bold ">
                        phone number:{" "}
                        <span className="font-normal">
                          {customer.mobileNumber}
                        </span>
                      </p>
                      <p className="font-bold">
                        address:{" "}
                        <span className="font-normal">
                          {customer.fullAddress}
                        </span>
                      </p>
                      <p className="font-bold">
                        machine:{" "}
                        <span className="font-normal">{customer.machine}</span>
                      </p>
                      <p className="font-bold">
                        status:{" "}
                        <span className="font-normal">{customer.status}</span>
                      </p>
                      <p className="font-bold">
                        brand:{" "}
                        <span className="font-normal">{customer.brand}</span>
                      </p>
                      <p className="font-bold">
                        created date:{" "}
                        <span className="font-normal">
                          {customer.dateCreated}
                        </span>
                      </p>
                      <p className="font-bold">
                        assigned date:{" "}
                        <span className="font-normal">
                          {customer.dateAssigned}
                        </span>
                      </p>
                      <p className="font-bold">
                        started date:{" "}
                        <span className="font-normal">
                          {customer.dateStarted}
                        </span>
                      </p>
                      <p className="font-bold">
                        completion date:{" "}
                        <span className="font-normal">
                          {customer.dateCompleted}
                        </span>
                      </p>
                      {customer.cancelReason ? (
                        <p className="font-bold text-red-700">
                          cancelled :
                          <span className="font-normal">
                            {customer.cancelReason}
                          </span>
                        </p>
                      ) : (
                        <></>
                      )}

                      {technicians && (
                        <p className="font-bold">
                          <>
                            assigned to:{" "}
                            <AssignedTechnician
                              customer={customer}
                              technicians={technicians}
                            />
                            {!!customer.assignedTo &&
                              customer.status !== "completed" && (
                                <button
                                  type="button"
                                  className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  onClick={async (e: React.MouseEvent) => {
                                    confirmAlert({
                                      customUI: ({
                                        title,
                                        message,
                                        onClose,
                                      }) => (
                                        <>
                                          <Formik
                                            initialValues={{
                                              cancelReason: "",
                                            }}
                                            validate={(values) => {
                                              const errors = {};
                                              return errors;
                                            }}
                                            onSubmit={async (
                                              values,
                                              {
                                                setSubmitting,
                                                setFieldValue,
                                                resetForm,
                                              }
                                            ) => {}}
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
                                                <div className="rounded-md bg-white w-96 py-6  shadow-lg ">
                                                  <h1 className="px-4 mb-0 font-bold">
                                                    Please Confirm Cancellation
                                                  </h1>
                                                  <p className="px-4 pb-4">
                                                    Are you sure you want to
                                                    unassign this job? Please
                                                    provide a reason to proceed
                                                    with the cancellation. Click
                                                    on NO to abort cancellation.
                                                  </p>
                                                  <div className="p-6">
                                                    <label htmlFor="serviceName">
                                                      Cancellation Reason
                                                    </label>
                                                    <input
                                                      id="cancelReason"
                                                      name="cancelReason"
                                                      required
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      className="appearance-none rounded-none relative block 
                                                w-full px-3 py-2 border border-gray-300 placeholder-gray-500
                                                 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500
                                                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                      placeholder="reason for cancellation"
                                                    />
                                                  </div>

                                                  <button
                                                    type="button"
                                                    disabled={
                                                      values.cancelReason
                                                        ?.length < 1
                                                    }
                                                    className="group  disabled:bg-gray-200
                                               relative mx-auto flex justify-center py-2 px-4 border
                                                border-transparent text-sm font-medium rounded-md
                                                 text-white bg-indigo-600 hover:bg-indigo-700 
                                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    onClick={async () => {
                                                      const assignedTechnician =
                                                        customer.assignedTo;
                                                      console.log(
                                                        values.cancelReason
                                                      );
                                                      if (
                                                        !!assignedTechnician &&
                                                        values.cancelReason
                                                          ?.length > 1
                                                      ) {
                                                        setSelectedCustomer(
                                                          customer
                                                        );
                                                        try {
                                                          await store
                                                            .dispatch(
                                                              assignJob({
                                                                technicianEmail:
                                                                  technicians.filter(
                                                                    (tech) =>
                                                                      tech.email ===
                                                                      customer.assignedTo
                                                                  )[0]?.email ??
                                                                  "",
                                                                customer:
                                                                  customer,
                                                                remove: true,
                                                                cancelReason:
                                                                  values.cancelReason,
                                                              })
                                                            )
                                                            .unwrap();
                                                          setIsJobRemoved(true);
                                                          setHasAssignedJob(
                                                            true
                                                          );
                                                        } catch (err: any) {
                                                          setHasAssignedJob(
                                                            false
                                                          );
                                                          showErrorAlert(
                                                            err?.message
                                                          );
                                                        }
                                                      }
                                                    }}
                                                  >
                                                    YES
                                                  </button>

                                                  <button
                                                    type="button"
                                                    className=" mt-4 relative mx-auto flex 
                                              justify-center py-2 px-4 border border-transparent 
                                              text-sm font-medium rounded-md text-white bg-indigo-600
                                               hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    onClick={() => {
                                                      setcancelReason("");
                                                      onClose();
                                                    }}
                                                  >
                                                    NO
                                                  </button>
                                                </div>
                                              </form>
                                            )}
                                          </Formik>
                                        </>
                                      ),
                                    });
                                  }}
                                >
                                  cancel
                                </button>
                              )}
                            {!!customer.assignedTo &&
                              customer.status !== "completed" && (
                                <button
                                  type="button"
                                  disabled={!!!customer.assignedTo}
                                  className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                  onClick={async (e: React.MouseEvent) => {
                                    const assignedTechnician =
                                      customer.assignedTo;
                                    console.log(!!assignedTechnician);
                                    if (!!assignedTechnician)
                                      await store.dispatch(
                                        customerSlice.actions.custInvoice({
                                          customer: customer,
                                        })
                                      );
                                    router.push("/admin/invoice");
                                    e.preventDefault();
                                  }}
                                >
                                  generate invoice
                                </button>
                              )}
                          </>
                        </p>
                      )}

                      {technicians && (
                        // if this is admin console
                        <div className="flex mt-6">
                          <div className="min-w-fit m-auto font-bold">
                            {" "}
                            assign to:
                          </div>
                          <ListBoxComponent
                            technicians={technicians}
                            selectedTechnician={(technicians) => {
                              setSelectedTechnician(technicians);
                            }}
                          />
                          <div className="px-4  bg-gray-50 text-right sm:px-6">
                            <button
                              type="button"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={async (e: React.MouseEvent) => {
                                console.log(selectedTechnician);
                                setSelectedCustomer(customer);
                                setAssignedTechnician(selectedTechnician);
                                try {
                                  await store
                                    .dispatch(
                                      assignJob({
                                        technicianEmail:
                                          selectedTechnician.email ?? "",
                                        customer: {
                                          ...customer,
                                          assignedTo:
                                            selectedTechnician.email ?? "",
                                        },
                                        remove: false,
                                      })
                                    )
                                    .unwrap();
                                  setHasAssignedJob(true);
                                } catch (err: any) {
                                  setHasAssignedJob(false);
                                  showErrorAlert(err?.message);
                                }
                                e.preventDefault();
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}

                      {technicians && (
                        <>
                          {customer.status === "completed" && (
                            <div className="mt-8">
                              <button
                                type="button"
                                disabled={!!!customer.assignedTo}
                                className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                onClick={async (e: React.MouseEvent) => {
                                  router.push(
                                    "/admin/report/" + customer._customerId
                                  );
                                }}
                              >
                                donwload invoice
                              </button>
                            </div>
                          )}
                        </>
                      )}
                      {!!!technicians && customer.status !== "completed" && (
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={async (e: React.MouseEvent) => {
                              confirmAlert({
                                customUI: ({ title, message, onClose }) => (
                                  <>
                                    <Formik
                                      initialValues={{
                                        cancelReason: "",
                                      }}
                                      validate={(values) => {
                                        const errors = {};
                                        return errors;
                                      }}
                                      onSubmit={async (
                                        values,
                                        {
                                          setSubmitting,
                                          setFieldValue,
                                          resetForm,
                                        }
                                      ) => {}}
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
                                          <div className="rounded-md bg-white w-96 py-6  shadow-lg ">
                                            <h1 className="px-4 mb-0 font-bold">
                                              Please Confirm Cancellation
                                            </h1>
                                            <p className="px-4 pb-4">
                                              Are you sure you want to unassign
                                              this job? Please provide a reason
                                              to proceed with the cancellation.
                                              Click on NO to abort cancellation.
                                            </p>
                                            <div className="p-6">
                                              <label htmlFor="serviceName">
                                                Cancellation Reason
                                              </label>
                                              <input
                                                id="cancelReason"
                                                name="cancelReason"
                                                required
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="appearance-none rounded-none relative block 
                                                w-full px-3 py-2 border border-gray-300 placeholder-gray-500
                                                 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500
                                                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="reason for cancellation"
                                              />
                                            </div>

                                            <button
                                              type="button"
                                              disabled={
                                                values.cancelReason?.length < 1
                                              }
                                              className="group  disabled:bg-gray-200
                                               relative mx-auto flex justify-center py-2 px-4 border
                                                border-transparent text-sm font-medium rounded-md
                                                 text-white bg-indigo-600 hover:bg-indigo-700 
                                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                              onClick={async () => {
                                                if (
                                                  values.cancelReason?.length >
                                                  1
                                                ) {
                                                  try {
                                                    await store
                                                      .dispatch(
                                                        assignJob({
                                                          technicianEmail:
                                                            customer.assignedTo ??
                                                            "",
                                                          customer: customer,
                                                          remove: true,
                                                          cancelReason:
                                                            values.cancelReason,
                                                        })
                                                      )
                                                      .unwrap();
                                                    setIsJobRemoved(true);
                                                    setHasAssignedJob(true);
                                                  } catch (err: any) {
                                                    setHasAssignedJob(false);
                                                    showErrorAlert(
                                                      err?.message
                                                    );
                                                  }
                                                }
                                              }}
                                            >
                                              YES
                                            </button>
                                            <button
                                              type="submit"
                                              className="group mt-4 relative mx-auto flex justify-center 
                                        py-2 px-4 border border-transparent text-sm font-medium r
                                        ounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                              onClick={() => {
                                                setcancelReason("");
                                                onClose();
                                              }}
                                            >
                                              NO
                                            </button>
                                          </div>
                                        </form>
                                      )}
                                    </Formik>
                                  </>
                                ),
                              });

                              e.preventDefault();
                            }}
                          >
                            cancel
                          </button>
                          {customer.status === "assigned" && (
                            <button
                              type="button"
                              className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              onClick={async (e: React.MouseEvent) => {
                                console.log(customer);
                                try {
                                  await store
                                    .dispatch(
                                      startJob({
                                        technicianEmail: customer.assignedTo,
                                        customer: customer,
                                        remove: false,
                                      })
                                    )
                                    .unwrap();
                                  setJobStarted(true);
                                } catch (err: any) {
                                  setJobStarted(false);
                                  showErrorAlert(err?.message);
                                }
                              }}
                            >
                              start job
                            </button>
                          )}
                          {customer.status !== "assigned" && (
                            <button
                              type="button"
                              disabled={!!!customer.assignedTo}
                              className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                              onClick={async (e: React.MouseEvent) => {
                                const assignedTechnician = customer.assignedTo;
                                console.log(!!assignedTechnician);
                                if (!!assignedTechnician)
                                  await store.dispatch(
                                    customerSlice.actions.custInvoice({
                                      customer: customer,
                                    })
                                  );
                                router.push("/invoice");
                                e.preventDefault();
                              }}
                            >
                              generate invoice
                            </button>
                          )}
                        </div>
                      )}
                      {!!!technicians && customer.status === "completed" && (
                        <div className="pt-8">
                          <button
                            type="button"
                            disabled={!!!customer.assignedTo}
                            className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            onClick={async (e: React.MouseEvent) => {
                              router.push("/external/" + customer._customerId);
                            }}
                          >
                            donwload invoice
                          </button>
                        </div>
                      )}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </div>
      {customers.length < 1 && <>no records</>}
    </div>
  );
}
