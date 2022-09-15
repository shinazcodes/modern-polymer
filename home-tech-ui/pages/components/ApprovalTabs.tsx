import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import CarouselComponent from "./CarouselComponent";
import { Customer } from "../../api/Auth/customerSlice";
import { EmailVerifyItems } from "../auth/signup";
import ApprovalCarousel from "./ApprovalCarousel";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ApprovalTabs({
  customers,
  technicians,
  refresh,
}: {
  customers: {
    pending?: Customer[];
    approved?: Customer[];
    completed?: Customer[];
  };
  technicians: EmailVerifyItems[];
  refresh: () => void;
}) {
  let [categories] = useState({
    Pending: [],
    Approved: [],
    Completed: [],
  });

  useEffect(() => {
    console.log(customers);
    console.log("technicians", technicians);
  }, []);

  return (
    <div className="w-full px-2 py-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-[#e3efff] p-1">
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
          {Object.values(customers).flatMap((customer, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl  p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <ApprovalCarousel
                customers={customer}
                approved={idx === 1}
                completed={idx === 2}
                technicians={technicians}
                refresh={refresh}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
