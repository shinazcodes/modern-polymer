import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PdfDocument from "../components/CreatePdf";

export default function ReportPdf() {
  return (
    <div className="h-full w-full mt-16">
      <PDFViewer className="h-full w-full">
        <PdfDocument />
      </PDFViewer>
    </div>
  );
}
