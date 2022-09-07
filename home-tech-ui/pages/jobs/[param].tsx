/* This example requires Tailwind CSS v2.0+ */
import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { decode } from "punycode";
import { Customer } from "../../api/Auth/customerSlice";
import { getTechnicianList } from "../../api/Auth/techniciansSlice";
import { RootState, store } from "../../api/store";
import CarouselComponent from "../components/CarouselComponent";
import { useRouter } from "next/router";

export default function Jobs() {
  const token = useSelector<RootState, string | undefined>(
    (state) => state.auth.accessToken
  );
  const customers = useSelector<RootState, Customer[] | undefined>(
    (state) => state.technician.showTechnician?.assignedTasks
  );
  const router = useRouter();
  const { param } = router.query;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  console.log(customers?.filter((customer) => customer.status === "pending"));
  console.log(param);
  useEffect(() => {
    if (token) {
      var decoded: {
        name: string;
        email: string;
      } = jwt_decode(token);
      console.log(decoded);
      setName(decoded.name);
      setEmail(decoded.email);
    }
  }, [token]);

  return (
    <div className="pt-20 px-4">
      <h1 className="font-bold text-lg">
        {param === "all" ? (
          <>All Jobs</>
        ) : param === "pending" ? (
          <>pending jobs</>
        ) : (
          <>completed jobs</>
        )}
      </h1>
      <CarouselComponent
        customers={
          customers
            ? param === "all"
              ? customers?.filter((customer) => customer.status === "assigned")
              : param === "pending"
              ? customers?.filter((customer) => customer.status === "pending")
              : customers?.filter((customer) => customer.status === "completed")
            : []
        }
        refresh={() => {}}
      />
    </div>
  );
}
