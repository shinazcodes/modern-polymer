/* This example requires Tailwind CSS v2.0+ */
import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { RootState, store } from "../api/store";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { decode } from "punycode";
import { getTechnician, getTechnicianList } from "../api/Auth/techniciansSlice";
import { Customer } from "../api/Auth/customerSlice";
import { useRouter } from "next/router";

export default function Example() {
  const token = useSelector<RootState, string | undefined>(
    (state) => state.auth.accessToken
  );
  const jobs = useSelector<RootState, Customer[] | undefined>(
    (state) => state.technician.showTechnician?.assignedTasks
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();
  const [features, setFeatures] = useState([
    {
      name: "My jobs",
      total: 0,
      icon: GlobeAltIcon,
    },
    {
      name: "Pending jobs",
      total: 0,
      icon: ScaleIcon,
    },
    {
      name: "Completed jobs",
      total: 0,
      icon: LightningBoltIcon,
    },
  ]);

  useEffect(() => {
    if (token && !hasSubmitted) {
      var decoded: {
        name: string;
        email: string;
      } = jwt_decode(token);
      console.log(decoded);
      setName(decoded.name);
      setEmail(decoded.email);
      // store.dispatch(getTechnicianList)
      store.dispatch(getTechnician({ email: decoded.email }));
      setHasSubmitted(true);
    }
  }, [hasSubmitted]);

  useEffect(() => {
    console.log(jobs);
    let tempFeatures = features;
    console.log(jobs);

    if (!!jobs?.length) {
      tempFeatures[0].total = jobs?.length;
      tempFeatures[1].total = jobs.filter(
        (job) => job.status && job.status === "pending"
      ).length;
      tempFeatures[2].total = jobs.filter(
        (job) => job.status && job.status === "completed"
      ).length;
      console.log(
        jobs.filter((job) => job.status && job.status === "pending").length
      );
    }
    setFeatures(tempFeatures);
  }, [jobs]);

  useEffect(() => {
    if (token) {
      var decoded: {
        name: string;
        email: string;
      } = jwt_decode(token);
      console.log(decoded);
      setName(decoded.name);
      setEmail(decoded.email);
      // store.dispatch(getTechnicianList)
    }
  }, [token]);

  return (
    <div className="py-12 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center justify-center flex flex-col items-center">
          <div className=" flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
            <ScaleIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-10 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Hello {name}
          </p>
          <p className="mt-20 max-w-2xl text-xl text-gray-500 lg:mx-auto text-center">
            Registered email : {email}
          </p>
        </div>

        <dl className="flex flex-row flex-wrap content-between justify-around fixed p-4 bottom-0 left-0 w-full">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              onClick={() => {
                if (index === 0) {
                  router.push("/jobs/all");
                } else if (index === 1) {
                  router.push("/jobs/pending");
                } else {
                  router.push("/jobs/completed");
                }
              }}
              className="relative w-1/3"
            >
              <div className="flex flex-col items-center">
                <div className=" flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className=" md:text-lg text-sm font-medium text-gray-900">
                  {feature.name}
                </p>
                <p className=" text-lg font-medium text-gray-900">
                  {feature.total}
                </p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
