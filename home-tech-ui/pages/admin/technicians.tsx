import { Combobox, Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
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
  blockUnblockUser,
  getTechnician,
  getTechnicianList,
  removeTechnician,
} from "../../api/Auth/techniciansSlice";
import TechnicianCarouselComponent from "../components/technicianCarousel";
import { confirmAlert } from "react-confirm-alert";
import { classNames } from "../components/ApprovalTabs";
import TechnicianTabComponent from "../components/TechniciansTabComponent";

export default function Technicians() {
  const [selectedTechnician, setSelectedTechnician] = useState(
    {} as EmailVerifyItems | undefined
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSubmittedTechnician, sethasSubmittedTechnician] = useState(false);
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
      const res = await store.dispatch(getTechnicianList("partial")).unwrap();
      setgotTechnicians(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedTechnician && selectedTechnician.email) {
      store.dispatch(getTechnician({ email: selectedTechnician.email }));
      sethasSubmittedTechnician(true);
      setSelectedTechnician(undefined);
    }
  }, [selectedTechnician]);

  useEffect(() => {
    if (
      hasSubmittedTechnician &&
      state.technician.status === ApiState.SUCCESS
    ) {
      setShowtechnician(state.technician.showTechnician);
      sethasSubmittedTechnician(false);
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

  const [query, setQuery] = useState("");
  const filteredtechnicians = useMemo(() => {
    console.log(filteredtechnicians);
    return query === ""
      ? state.technician.data
      : state.technician.data.filter((technician) =>
          technician?.email
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [query, state]);

  useEffect(() => {
    setSelectedTechnician(filteredtechnicians[0]);
  }, []);
  const router = useRouter();
  useEffect(() => {
    if (selectedTechnician && selectedTechnician.email) {
      store
        .dispatch(getTechnician({ email: selectedTechnician.email }))
        .unwrap();
      sethasSubmittedTechnician(true);
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
    <div className="w-full mt-16 h-full flex flex-row flex-wrap ">
      {/* <TechnicianCarouselComponent
        technicians={state.technician.data}
        refresh={() => {
          setgotTechnicians(false);
        }}
      /> */}

      <div className="w-1/3 px-4 rounded-md">
        <h1 className="font-bold text-lg p-4">Technicians</h1>
        <input
          className=" border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 
          rounded-md"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="search by email"
        />
        <ul className="h-full overflow-scroll pt-4">
          {filteredtechnicians.map((technician) => (
            <li
              className="hover:bg-blue-200  cursor-pointer p-2 rounded-lg"
              key={technician._id}
              onClick={() => {
                setSelectedTechnician(technician);
              }}
            >
              <div className="flex flex-row flex-wrap place-content-between">
                <span>
                  {technician.firstName + " " + technician.lastName}(
                  {technician.email})
                </span>
                {/* <div className="bg-gray-300 w-full h-px"></div> */}
                <button
                  type="button"
                  className={classNames(
                    "inline-flex justify-center mr-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                    technician.isBlocked
                      ? "bg-blue-600 hover:bg-blue-700  focus:ring-blue-500"
                      : "bg-red-600 hover:bg-red-700  focus:ring-red-500"
                  )}
                  onClick={async (e: React.MouseEvent) => {
                    console.log(selectedTechnician);
                    try {
                      if (technician?.email) {
                        const res = await store
                          .dispatch(
                            blockUnblockUser({
                              email: technician?.email,
                              block: !!!technician.isBlocked,
                            })
                          )
                          .unwrap();
                        if (res.response !== "error") {
                          confirmAlert({
                            title: "success",
                            message: res.message,
                          });
                          getTechnicians();
                        }
                      }
                    } catch (error: any) {
                      confirmAlert({
                        title: "error",
                        message: error.message,
                      });
                    }
                    e.preventDefault();
                  }}
                >
                  {technician.isBlocked ? <>unblock </> : <>block </>}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {!!state.technician.showTechnician && (
        <>
          <div className="flex flex-row flex-wrap content-center justify-center w-2/3">
            {state.technician?.showTechnician &&
            state.technician?.showTechnician?.assignedTasks &&
            state.technician?.showTechnician?.assignedTasks?.length > 0 ? (
              <div className="w-full p-4 rounded bg-white shadow-lg m-4">
                <h1 className="text-lg font-bold ">Jobs Assigned</h1>
                <TechnicianTabComponent
                  customers={state.technician.showTechnician.assignedTasks}
                  refresh={() => {}}
                />
              </div>
            ) : (
              <>
                <div className="w-full p-4 rounded  shadow-lg m-4">
                  <h1 className="text-lg font-bold  w-full">Jobs Assigned</h1>
                  <p className="text-center">no jobs assigned</p>
                </div>
              </>
            )}

            <div className="w-full m-4 bg-white self-center rounded-lg shadow-lg p-10">
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
                  onClick={async (e: React.MouseEvent) => {
                    console.log(selectedTechnician);
                    try {
                      if (state.technician.showTechnician?.email) {
                        const res = await store
                          .dispatch(
                            removeTechnician({
                              email: state.technician.showTechnician?.email,
                            })
                          )
                          .unwrap();
                      }
                    } catch (error: any) {
                      confirmAlert({
                        title: "error",
                        message: error,
                      });
                    }
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
