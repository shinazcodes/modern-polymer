import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Customer } from "../../api/Auth/customerSlice";
import { EmailVerifyItems } from "../auth/signup";
import ListBoxComponent from "./ListBox";

export default function CarouselComponent({
  customers,
  technicians,
}: {
  customers: Customer[];
  technicians: EmailVerifyItems[];
}) {
  return (
    <div className="w-full px-4">
      <div className="mx-0 w-full rounded-2xl bg-white p-2">
        <div>
          {customers.map((customer: Customer) => {
            return (
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex mt-2 w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
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
                      <p>phone number: {customer.brand}</p>
                      <p>address: {customer.fullAddress}</p>
                      <p>machine: {customer.machine}</p>
                      <p>brand: {customer.brand}</p>
                      <p>assigned to: {customer.assignedTo ?? "none"}</p>
                      <div className="flex">
                        <div className="min-w-fit m-auto"> assign to:</div>
                        <ListBoxComponent technicians={technicians} />
                        <div className="px-4  bg-gray-50 text-right sm:px-6">
                          <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                            }}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
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
