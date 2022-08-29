import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";
import { totalmem } from "os";
import {
  InitialAuthState,
  getInvoice,
  ApiState,
} from "../../api/Auth/customerSlice";
import { RootState, store } from "../../api/store";
import PdfDocument from "../components/CreatePdf";

export default function ReportExternalPdf() {
  const router = useRouter();
  const { custId } = router.query;
  const state = useSelector<RootState, InitialAuthState | undefined>(
    (state) => state.customer
  );

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [gstAmount, setGstAmount] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  async function getInvoiceData() {
    return await store
      .dispatch(getInvoice({ _customerId: custId?.toString() ?? "" }))
      .unwrap();
  }

  useEffect(() => {
    if (hasSubmitted && state?.status === ApiState.SUCCESS) {
      let total: number = 0.0;
      state?.selectedForInvoiceGeneration?.invoiceDetails?.services.map(
        (item) => {
          total += Number(item.price) * Number(item.quantity);
        }
      );
      let gstA =
        (total *
          (state.selectedForInvoiceGeneration?.invoiceDetails?.gst ?? 0.0)) /
        100;
      setGstAmount(gstA);
      setTotal(total + gstA);
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
    <div className="h-full w-full">
      {total !== 0.0 && (
        <PDFViewer className="h-full w-full">
          <PdfDocument
            data={state?.selectedForInvoiceGeneration}
            gstAmount={gstAmount}
            total={total}
          />
        </PDFViewer>
      )}
    </div>
  );
}
