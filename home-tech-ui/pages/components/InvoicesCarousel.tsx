import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  approveInvoice,
  Customer,
  customerSlice,
  InvoiceDetails,
  Service,
} from "../../api/Auth/customerSlice";
import { RootState, store } from "../../api/store";
import { EmailVerifyItems } from "../auth/signup";
import { StyleSheet } from "@react-pdf/renderer";
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
    minWidth: "66 %",
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
export default function InvoicesCarousel({
  invoices,
  refresh,
}: {
  invoices?: InvoiceDetails[];
  refresh: () => void;
}) {
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems
  );
  const state = useSelector<RootState, RootState>((state) => state);
  const router = useRouter();
  useEffect(() => {}, [state]);

  function getGst(customer: InvoiceDetails): ReactNode {
    let total: number = 0.0;
    customer?.services.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    let gstA = (total * (customer?.gst ?? 0.0)) / 100;
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

  function getTotal(customer: InvoiceDetails): ReactNode {
    let total: number = 0.0;
    customer?.services.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    let gstA = (total * (customer?.gst ?? 0.0)) / 100;
    return <>{total + gstA}</>;
  }

  function getTotalnum(customer: InvoiceDetails) {
    let total: number = 0;
    customer?.services.map((item) => {
      total += Number(item.price) * Number(item.quantity);
    });
    let gstA = (total * (customer?.gst ?? 0.0)) / 100;
    return total + gstA;
  }
  return (
    <div className="w-full">
      <div className="mx-0 w-full rounded-2xl bg-white p-2">
        <div>
          {invoices?.map((customer: InvoiceDetails, index) => {
            return (
              customer &&
              customer.services.length > 0 && (
                <Disclosure key={index}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex mt-2 w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
                        <span>
                          {customer.name} - {customer.email} -{" "}
                          {customer.invoiceId}
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
                          {customer?.services.map((service, index) => (
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
                          ))}

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
                                {getTotalQuantity(customer?.services)}
                              </p>
                            </div>
                            <div style={styles.columns}>
                              <p
                                style={{
                                  margin: "auto",
                                }}
                              >
                                {getTotalServiceCost(customer?.services)}
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
                                  isNaN(getTotalnum(customer))
                                    ? 0.0
                                    : getTotalnum(customer)
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
                        <div className="mt-8">
                          <button
                            type="button"
                            className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm p-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            onClick={async (e: React.MouseEvent) => {
                              const assignedTechnician = customer.assignedTo;
                              console.log(!!assignedTechnician);
                              console.log(customer);
                              try {
                                router.push("/admin/report/" + customer.custId);
                              } catch (err) {
                                console.log(err);
                              }
                              e.preventDefault();
                            }}
                          >
                            Download
                          </button>
                        </div>
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
