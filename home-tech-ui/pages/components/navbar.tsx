/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { CogIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { RootState } from "../../api/store";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const userNavigation = [{ name: "Sign out", href: "/auth/login" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const router = useRouter();
  const state = useSelector<RootState, RootState>((s) => s);
  const [navigation, setNavigation] = useState([
    { name: "Job List", href: "/admin/customer-list", current: true },
    { name: "Create Job", href: "/admin/create-job", current: false },
    { name: "Technicians", href: "/admin/technicians", current: false },
    { name: "Approvals", href: "/admin/approvals", current: false },
    { name: "Invoices", href: "/admin/invoices", current: false },
  ]);
  useEffect(() => {
    navigation.map((ele, index) => {
      router.asPath === ele.href ? (ele.current = true) : (ele.current = false);
    });
  }, [router.asPath]);
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="h-16 fixed z-50 top-0 w-full">
        <Disclosure as="nav" className="bg-white shadow-xl ">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 bg-white ">
                  <div className="flex items-center">
                    {router.pathname !== "/auth/login" && (
                      <div
                        className="flex-shrink-0"
                        onClick={() => {
                          router.back();
                        }}
                      >
                        <img
                          className="h-6 w-auto mx-2"
                          src="/backbtn.png"
                          alt="Workflow"
                        />
                      </div>
                    )}

                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-auto"
                        src="/newlogo.png"
                        alt="Workflow"
                      />
                    </div>
                    {router.pathname.includes("admin") && (
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item, idx) => (
                            <a
                              key={item.name}
                              onClick={() => {
                                router.push(item.href);
                                navigation.map((ele, index) => {
                                  index === idx
                                    ? (ele.current = true)
                                    : (ele.current = false);
                                });
                              }}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-black hover:bg-gray-600 hover:text-white",
                                "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                              {item.name === "Technicians" &&
                                state.technician.techniciansPendingApproval >
                                  0 && (
                                  <>
                                    (
                                    {
                                      state.technician
                                        .techniciansPendingApproval
                                    }
                                    )
                                  </>
                                )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <button
                              type="button"
                              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            >
                              <span className="sr-only">
                                View notifications
                              </span>
                              <CogIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={() => {
                                      router.push(item.href);
                                    }}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  {router.pathname.includes("admin") && (
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  )}
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
