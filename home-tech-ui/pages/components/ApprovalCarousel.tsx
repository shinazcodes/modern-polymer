import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ApiState,
  approveInvoice,
  completeTask,
  Customer,
  customerSlice,
  Service,
} from "../../api/Auth/customerSlice";
import { RootState, store } from "../../api/store";
import { EmailVerifyItems } from "../auth/signup";
import { StyleSheet } from "@react-pdf/renderer";
import { showErrorAlert } from "../../util/util";
import { confirmAlert } from "react-confirm-alert";
import { sendSms } from "../../api/Auth/authSlice";
import { getSMS, SMS } from "../../api/model";
var converter = require("number-to-words");

const styles = StyleSheet.create({
  table: {
    border: "1px solid",
  },
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  section: {
    minWidth: "45%",
    width: "45%",
    padding: 10,
  },
  bigSection: {
    minWidth: "55%",
    width: "55%",
    padding: 10,
  },
  smallSection: {
    minWidth: "35%",
    width: "35%",
    padding: 10,
  },
  rows: {
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    borderBottomWidth: 0,
  },
  columns: {
    borderWidth: 1,
    borderColor: "black",
    margin: "0.25%",
    minWidth: "16.1%",
    height: 40,
    lineHeight: "100%",
    marginVertical: "auto",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  bigColumns: {
    borderWidth: 1,
    borderColor: "black",
    margin: "0.25%",
    minWidth: "66%",
    textAlign: "center",
    minHeight: 40,

    backgroundColor: "lightgrey",
  },
  small: {
    fontSize: 16,
    lineHeight: 1.25,
  },
  smaller: {
    fontSize: 12,
    lineHeight: 1.25,
  },
});
export default function ApprovalCarousel({
  customers,
  technicians,
  approved,
  refresh,
  completed,
}: {
  customers: Customer[];
  technicians?: EmailVerifyItems[];
  refresh: () => void;
  approved: boolean;
  completed: boolean;
}) {
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems
  );
  const [selectedCustomer, setSelectedCustomer] = useState({} as Customer);
  const state = useSelector<RootState, RootState>((state) => state);
  const router = useRouter();
  useEffect(() => {}, [state]);
  function getGst(customer: Customer): ReactNode {
    let total: number = 0.0;
    customer?.invoiceDetails?.services.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    let gstA = (total * (customer?.invoiceDetails?.gst ?? 0.0)) / 100;
    return <>{gstA}</>;
  }

  function getTotalQuantity(services: Service[] | undefined): ReactNode {
    let total = 0;
    services?.map((item) => {
      total += Number(item.quantity);
    });
    return <>{total}</>;
  }

  function getTotalServiceCost(services: Service[] | undefined): ReactNode {
    let total = 0.0;
    services?.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    return <>{total}</>;
  }

  function getTotal(customer: Customer): ReactNode {
    let total: number = 0.0;
    customer?.invoiceDetails?.services.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    let gstA = (total * (customer?.invoiceDetails?.gst ?? 0.0)) / 100;
    return <>{total + gstA}</>;
  }
  function getTotalnum(customer: Customer) {
    let total: number = 0;
    customer?.invoiceDetails?.services.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    let gstA = (total * (customer?.invoiceDetails?.gst ?? 0.0)) / 100;
    return total + gstA;
  }
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSubmittedComplete, setHasSubmittedComplete] = useState(false);

  async function handleApproved(assignedTechnician: any, customer: any) {
    try {
      if (!!assignedTechnician)
        await store
          .dispatch(
            approveInvoice({
              _customerId: customer._customerId ?? "",
            })
          )
          .unwrap();

      setHasSubmitted(true);
    } catch (err: any) {
      setHasSubmitted(false);

      showErrorAlert(err?.message);
    }
  }

  async function handleCompleted(assignedTechnician: string, customer: any) {
    try {
      if (!!assignedTechnician)
        await store
          .dispatch(
            completeTask({
              _customerId: customer._customerId ?? "",
              technicianEmail: assignedTechnician,
            })
          )
          .unwrap();

      setHasSubmittedComplete(true);
    } catch (err: any) {
      setHasSubmittedComplete(false);

      showErrorAlert(err?.message);
    }
  }

  useEffect(() => {
    if (hasSubmitted && state.customer.status === ApiState.SUCCESS) {
      setHasSubmitted(false);

      confirmAlert({
        title: "invoice has been approved!",
        buttons: [
          {
            label: "ok",
            onClick: () => {},
          },
        ],
      });
    }
  }, [hasSubmitted, state.customer.status]);

  async function sms() {
    await store.dispatch(
      sendSms({
        mobileNumber: selectedCustomer.mobileNumber,
        sms: getSMS(SMS.WORK_COMPLETED, {
          billAmount: getTotalnum(selectedCustomer).toString(),
          technicianMob: selectedTechnician.phoneNumber,
          technicianName:
            selectedTechnician.firstName + " " + selectedTechnician.lastName,
          downloadLink:
            "https://www.hometechworld.co.in/external/" +
            selectedCustomer._customerId,
        }),
      })
    );
    await store.dispatch(
      sendSms({
        mobileNumber: selectedTechnician.phoneNumber ?? "",
        sms: getSMS(SMS.WORK_COMPLETED, {
          billAmount: getTotalnum(selectedCustomer).toString(),
          technicianMob: selectedTechnician.phoneNumber,
          technicianName:
            selectedTechnician.firstName + " " + selectedTechnician.lastName,
          downloadLink:
            "https://www.hometechworld.co.in/external/" +
            selectedCustomer._customerId,
        }),
      })
    );
  }

  useEffect(() => {
    if (hasSubmittedComplete && state.customer.status === ApiState.SUCCESS) {
      setHasSubmittedComplete(false);
      sms();
      confirmAlert({
        title: "the job is completed!",
        buttons: [
          {
            label: "ok",
            onClick: () => {},
          },
        ],
      });
    }
  }, [hasSubmittedComplete, state.customer.status]);

  return (
    <div className="w-full">
      <div className="mx-0 w-full rounded-2xl bg-white p-2">
        <div>
          {customers.map((customer: Customer, index) => {
            return (
              customer.invoiceDetails &&
              customer.invoiceDetails.services.length > 0 && (
                <Disclosure key={index}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex mt-2 w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
                        <span>
                          {customer.name} - {customer.machine} -{" "}
                          {customer.brand}
                        </span>
                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <p className="font-bold">name: {customer.name}</p>
                        <p className="font-bold">
                          phone number: {customer.mobileNumber}
                        </p>
                        <p className="font-bold">
                          address: {customer.fullAddress}
                        </p>
                        <p className="font-bold">machine: {customer.machine}</p>
                        <p className="font-bold">status: {customer.status}</p>
                        <p className="font-bold">brand: {customer.brand}</p>

                        <div
                          style={{
                            borderBottomWidth: 1,
                            borderColor: "black",
                            width: "100%",
                            flexDirection: "column",
                            flexWrap: "wrap",
                            display: "flex",
                            marginTop: 32,
                          }}
                        >
                          <div style={styles.rows}>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Sl No
                              </p>
                            </div>

                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Item
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Rate
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Quantity
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                GST%
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Total
                              </p>
                            </div>
                          </div>
                          {customer?.invoiceDetails?.services.map(
                            (service, index) => (
                              <div key={index} style={styles.rows}>
                                <div style={styles.columns}>
                                  <p
                                    style={{
                                      margin: "auto",
                                    }}
                                  >
                                    {index + 1}
                                  </p>
                                </div>
                                <div style={styles.columns}>
                                  <p
                                    style={{
                                      margin: "auto",
                                    }}
                                  >
                                    {service.name}
                                  </p>
                                </div>
                                <div style={styles.columns}>
                                  <p
                                    style={{
                                      margin: "auto",
                                    }}
                                  >
                                    {service.price}
                                  </p>
                                </div>
                                <div style={styles.columns}>
                                  <p
                                    style={{
                                      margin: "auto",
                                    }}
                                  >
                                    {service.quantity}
                                  </p>
                                </div>
                                <div style={styles.columns}>
                                  <p
                                    style={{
                                      margin: "auto",
                                    }}
                                  >
                                    {service.gst ?? 0}%
                                  </p>
                                </div>
                                <div style={styles.columns}>
                                  <p
                                    style={{
                                      margin: "auto",
                                    }}
                                  >
                                    {Number(service.price) *
                                      Number(service.quantity) +
                                      (Number(service.price) *
                                        Number(service.quantity) *
                                        (service.gst ?? 0)) /
                                        100}
                                  </p>
                                </div>
                              </div>
                            )
                          )}

                          <div style={styles.rows}>
                            <div style={styles.bigColumns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Total
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                {getTotalQuantity(
                                  customer.invoiceDetails?.services
                                )}
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                {getTotalServiceCost(
                                  customer.invoiceDetails?.services
                                )}
                              </p>
                            </div>
                          </div>

                          <div style={styles.rows}>
                            <div
                              style={{
                                borderWidth: 1,
                                borderColor: "black",
                                margin: "0.25%",
                                minWidth: "66%",
                                textAlign: "center",
                                minHeight: 20,
                                maxWidth: "66%",
                                backgroundColor: "lightgrey",
                              }}
                            >
                              <p
                                style={{
                                  margin: "auto",
                                  fontSize: 14,
                                }}
                              >
                                INR(
                                {converter.toWords(
                                  getTotalnum(customer) ?? 0.0
                                )}
                                )
                              </p>
                            </div>

                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                Grand Total
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                {getTotal(customer)}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!completed && (
                          <div className="mt-8">
                            <button
                              type="button"
                              disabled={!!!customer.assignedTo}
                              className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm p-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                              onClick={async (e: React.MouseEvent) => {
                                const assignedTechnician = customer.assignedTo;
                                console.log(!!assignedTechnician);
                                if (customer.status == "pending" && !approved) {
                                  handleApproved(assignedTechnician, customer);
                                } else {
                                  setSelectedTechnician(
                                    state.technician.data.filter(
                                      (tch) => tch.email === customer.assignedTo
                                    )[0]
                                  );
                                  setSelectedCustomer(customer);
                                  handleCompleted(assignedTechnician, customer);
                                }

                                e.preventDefault();
                              }}
                            >
                              {customer.status == "pending" && !approved ? (
                                <>Approve</>
                              ) : (
                                <>Complete Task</>
                              )}
                            </button>
                            <button
                              type="button"
                              className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm p-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                              onClick={async (e: React.MouseEvent) => {
                                const assignedTechnician = customer.assignedTo;
                                console.log(!!assignedTechnician);
                                console.log(customer);
                                try {
                                  store.dispatch(
                                    customerSlice.actions.custInvoice({
                                      customer: customer,
                                    })
                                  );
                                  router.push("/admin/invoice");
                                } catch (err) {
                                  console.log(err);
                                }
                                e.preventDefault();
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
