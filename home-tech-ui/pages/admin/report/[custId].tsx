import React, { useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PdfDocument from "../../components/CreatePdf";
import { useRouter } from "next/router";
import { Customer, getInvoice } from "../../../api/Auth/customerSlice";
import { RootState, store } from "../../../api/store";
import { useSelector } from "react-redux";

export default function ReportPdf() {
  const router = useRouter();
  const { custId } = router.query;
  const customer = useSelector<RootState, Customer | undefined>(
    (state) => state.customer.selectedForInvoiceGeneration
  );
  async function getInvoiceData() {
    return await store.dispatch(
      getInvoice({ _customerId: custId?.toString() ?? "" })
    );
  }

  useEffect(() => {
    console.log(custId);

    if (custId) {
      const res = getInvoiceData();
    }
  }, [custId]);
  return (
    <div className="h-full w-full mt-16">
      <PDFViewer className="h-full w-full">
        <PdfDocument />
      </PDFViewer>
    </div>
  );
}
