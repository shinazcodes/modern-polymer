import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import CarouselComponent from "./CarouselComponent";
import { Customer } from "../../api/Auth/customerSlice";
import { EmailVerifyItems } from "../auth/signup";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TechnicianTabComponent({
  customers,
  refresh,
}: {
  customers?: Customer[];
  refresh: () => void;
}) {
  let [categories] = useState({
    Jobs: [],
    Pending: [],
    Completed: [],
  });
  useEffect(() => {
    console.log(customers);
  }, []);

  return (
    <div className="w-full px-2 py-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-200 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
                  "ring-blue-400 ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-blue-300 shadow"
                    : "text-blue-500 hover:bg-white/[0.12] hover:text-blue-900"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {customers?.flatMap((customer, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <CarouselComponent
                customers={
                  customer.status === "assigned"
                    ? customers?.filter(
                        (customer) => customer.status === "assigned"
                      )
                    : customer.status === "completed"
                    ? customers?.filter(
                        (customer) => customer.status === "completed"
                      )
                    : customers?.filter(
                        (customer) => customer.status === "completed"
                      )
                }
                refresh={() => {}}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
