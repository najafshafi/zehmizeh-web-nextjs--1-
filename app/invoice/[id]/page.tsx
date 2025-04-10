import React from "react";
import InvoiceGenerater from "@/app/payments/InvoiceGenerater";

const page = () => {
  return (
    <div className=" bg-secondary flex flex-col items-center h-screen">
      <InvoiceGenerater />
    </div>
  );
};

export default page;
