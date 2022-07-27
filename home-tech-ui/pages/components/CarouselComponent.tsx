import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  assignJob,
  Customer,
  customerSlice,
} from "../../api/Auth/customerSlice";
import { store } from "../../api/store";
import { EmailVerifyItems } from "../auth/signup";
import AssignedTechnician from "./AssignedTechnician";
import ListBoxComponent from "./ListBox";

export default function CarouselComponent({
  customers,
  technicians,
  refresh,
}: {
  customers: Customer[];
  technicians?: EmailVerifyItems[];
  refresh: () => void;
}) {
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems
  );

  const router = useRouter();
  useEffect(() => {
    console.log(customers);
    console.log("technicians", technicians);
  }, []);

  return (
    <div className="w-full">
      <div className="mx-0 w-full rounded-2xl bg-white p-2">
        <div>
          {customers.map((customer: Customer) => {
            return (
              <Disclosure>
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
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      <p>name: {customer.name}</p>
                      <p>phone number: {customer.mobileNumber}</p>
                      <p>address: {customer.fullAddress}</p>
                      <p>machine: {customer.machine}</p>
                      <p>status: {customer.status}</p>
                      <p>brand: {customer.brand}</p>
                      {technicians && (
                        <p>
                          <>
                            assigned to:{" "}
                            <AssignedTechnician
                              customer={customer}
                              technicians={technicians}
                            />
                            <button
                              type="button"
                              disabled={!!!customer.assignedTo}
                              className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={async (e: React.MouseEvent) => {
                                console.log(selectedTechnician);
                                const assignedTechnician = customer.assignedTo;
                                console.log(!!assignedTechnician);
                                if (!!assignedTechnician)
                                  await store.dispatch(
                                    assignJob({
                                      technicianEmail:
                                        technicians.filter(
                                          (tech) =>
                                            tech.email === customer.assignedTo
                                        )[0]?.email ?? "",
                                      customer: customer,
                                      remove: true,
                                    })
                                  );
                                refresh();

                                e.preventDefault();
                              }}
                            >
                              unAssign
                            </button>
                            {!!customer.assignedTo && (
                              <button
                                type="button"
                                disabled={!!!customer.assignedTo}
                                className="inline-flex ml-10 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                        <div className="flex">
                          <div className="min-w-fit m-auto"> assign to:</div>
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
                              onClick={(e: React.MouseEvent) => {
                                console.log(selectedTechnician);
                                store.dispatch(
                                  assignJob({
                                    technicianEmail:
                                      selectedTechnician.email ?? "",
                                    customer: customer,
                                    remove: false,
                                  })
                                );
                                refresh();
                                e.preventDefault();
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                      {!!!technicians && (
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={(e: React.MouseEvent) => {
                            console.log(selectedTechnician);
                            store.dispatch(
                              assignJob({
                                technicianEmail: selectedTechnician.email ?? "",
                                customer: customer,
                                remove: false,
                              })
                            );

                            e.preventDefault();
                          }}
                        >
                          cancel
                        </button>
                      )}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
