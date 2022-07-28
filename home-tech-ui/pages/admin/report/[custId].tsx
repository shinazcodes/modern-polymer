import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PdfDocument from "../../components/CreatePdf";
import { useRouter } from "next/router";
import {
  ApiState,
  Customer,
  getInvoice,
  InitialAuthState,
} from "../../../api/Auth/customerSlice";
import { RootState, store } from "../../../api/store";
import { useSelector } from "react-redux";

export default function ReportPdf() {
  const router = useRouter();
  const { custId } = router.query;
  const state = useSelector<RootState, InitialAuthState | undefined>(
    (state) => state.customer
  );

  const [hasSubmitted, setHasSubmitted] = useState(false);

  async function getInvoiceData() {
    return await store.dispatch(
      getInvoice({ _customerId: custId?.toString() ?? "" })
    );
  }

  useEffect(() => {
    if (hasSubmitted && state?.status === ApiState.SUCCESS) {
    }
  }, [hasSubmitted, state]);

  useEffect(() => {
    console.log(custId);

    if (custId) {
      const res = getInvoiceData();
      setHasSubmitted(true);
    }
  }, [custId]);
  return (
    <div className="h-full w-full mt-16">
      <PDFViewer className="h-full w-full">
        <PdfDocument data={state?.selectedForInvoiceGeneration} />
      </PDFViewer>
    </div>
  );
}
