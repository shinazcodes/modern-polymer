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
import {
  ApiState,
  getTechnician,
  getTechnicianList,
} from "../../api/Auth/techniciansSlice";
import TechnicianCarouselComponent from "../components/technicianCarousel";

export default function Technicians() {
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems | undefined
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTechnician, setShowtechnician] = useState(
    {} as EmailVerifyItems | undefined
  );
  const [gotTechnicians, setgotTechnicians] = useState(false);

  const state = useSelector<RootState, RootState>((state) => state);
  useEffect(() => {
    if (!gotTechnicians) {
      getTechnicians();
    }
  }, [gotTechnicians]);

  const getTechnicians = async () => {
    try {
      const res = await store.dispatch(getTechnicianList("partial"));
      setgotTechnicians(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedTechnician && selectedTechnician.email) {
      store.dispatch(getTechnician({ email: selectedTechnician.email }));
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

  const getImage = (result: any) => {
    const byteCharacters = atob(result);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    let image = new Blob([byteArray], { type: "image/jpeg" });
    return URL.createObjectURL(image);
  };

  return (
    <div className="w-full mt-20">
      <TechnicianCarouselComponent
        technicians={state.technician.data}
        refresh={() => {
          setgotTechnicians(false);
        }}
      />
      {!!state.technician.showTechnician && (
        <>
          <div className="flex flex-row flex-wrap content-center justify-center">
            <div className="w-2/3 self-center rounded-lg shadow-lg p-10 ">
              <h1 className="text-lg font-bold">Technician Details</h1>

              <p>first name: {state.technician.showTechnician.firstName}</p>
              <p>last name: {state.technician.showTechnician.lastName}</p>
              <p>phone: {state.technician.showTechnician.phoneNumber}</p>
              <p>email: {state.technician.showTechnician.email}</p>
              <p>
                street address: {state.technician.showTechnician.streetAddress}
              </p>
              <p>city:{state.technician.showTechnician.city}</p>
              <p>state:{state.technician.showTechnician.state}</p>
              <p>zip code: {state.technician.showTechnician.zipCode}</p>
              <p>adhar: {state.technician.showTechnician.adharNumber}</p>

              <div className="px-4  text-right sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={(e: React.MouseEvent) => {
                    console.log(selectedTechnician);

                    e.preventDefault();
                  }}
                >
                  remove technician
                </button>
              </div>
            </div>
            <div className="w-2/3 self-center mt-10 rounded-lg shadow-lg p-10">
              <h1 className="text-lg font-bold">Uploaded Proofs</h1>
              <p>certificate:</p>
              <img src={`${state.technician.showTechnician.certificate}`} />
              <p>photo:</p>
              <img src={`${state.technician.showTechnician.photo}`} />
              <p>adhar:</p>
              <img src={`${state.technician.showTechnician.adhar}`} />
              <p>pancard:</p>
              <img src={`${state.technician.showTechnician.pancard}`} />
              <p>passbook:</p>
              <img src={`${state.technician.showTechnician.passbook}`} />
              <p>license:</p>
              <img src={`${state.technician.showTechnician.license}`} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
