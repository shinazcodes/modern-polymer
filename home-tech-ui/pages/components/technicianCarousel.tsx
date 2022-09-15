import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  assignJob,
  Customer,
  customerSlice,
} from "../../api/Auth/customerSlice";
import { RootState, store } from "../../api/store";
import { EmailVerifyItems } from "../auth/signup";
import jwt_decode from "jwt-decode";
import ListBoxComponent from "../components/ListBox";
import { ApiState, getTechnician } from "../../api/Auth/techniciansSlice";

export default function TechnicianCarouselComponent({
  technicians,
  refresh,
}: {
  technicians?: EmailVerifyItems[];
  refresh: () => void;
}) {
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems | undefined
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTechnician, setShowtechnician] = useState(
    {} as EmailVerifyItems | undefined
  );
  const state = useSelector<RootState, RootState>((state) => state);

  const router = useRouter();
  useEffect(() => {
    if (selectedTechnician && selectedTechnician.email) {
      store
        .dispatch(getTechnician({ email: selectedTechnician.email }))
        .unwrap();
      setHasSubmitted(true);
      setSelectedTechnician(undefined);
    }
  }, [selectedTechnician]);

  useEffect(() => {
    if (hasSubmitted && state.technician.status === ApiState.SUCCESS) {
      setShowtechnician(state.technician.showTechnician);
      setHasSubmitted(false);
    }
  }, [hasSubmitted]);

  return (
    <div className="mx-0 w-full rounded-2xl p-2">
      <div>
        {technicians && (
          <div className="flex flex-row flex-wrap m-10 mt-6">
            <div className="min-w-full m-auto font-bold">
              {" "}
              select technician
            </div>
            <ListBoxComponent
              technicians={technicians}
              selectedTechnician={(technicians) => {
                setSelectedTechnician(technicians);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
