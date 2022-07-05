/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useMemo } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Customer } from "../../api/Auth/customerSlice";
import { EmailVerifyItems } from "../auth/signup";

export default function AssignedTechnician({
  customer,
  technicians,
}: {
  customer: Customer;
  technicians: EmailVerifyItems[];
}) {
  const assignedTechnician = useMemo(() => {
    return technicians.filter((tech) => tech._id === customer.assignedTo)[0];
  }, [customer, technicians]);
  return assignedTechnician ? (
    <>{`${assignedTechnician.firstName} ${assignedTechnician.lastName} - (${assignedTechnician.email})`}</>
  ) : (
    <>none</>
  );
}
