import { CSSProperties, Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { EmailVerifyItems } from "../auth/signup";
import {
  BounceLoader,
  ClipLoader,
  ClockLoader,
  PulseLoader,
  RingLoader,
} from "react-spinners";
import { useSelector } from "react-redux";
import { RootState } from "../../api/store";
import { ApiState } from "../../api/Auth/techniciansSlice";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
};

export default function Spinner({}: {}) {
  useEffect(() => {}, []);
  let [color, setColor] = useState("blue");
  const loading = useSelector<RootState, boolean>(
    (state) =>
      state.auth.status === ApiState.LOADING ||
      state.technician.status === ApiState.LOADING ||
      state.customer.status === ApiState.LOADING
  );
  return (
    <>
      {loading && (
        <div className="w-full h-full z-50 flex bg-blue-100 opacity-40 align-middle flex-row flex-wrap place-content-center absolute">
          <PulseLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={20}
          />
        </div>
      )}
      home
    </>
  );
}
