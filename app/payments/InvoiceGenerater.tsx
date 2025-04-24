"use client";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { getInvoice } from "@/helpers/http/invoice";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
} from "@/helpers/utils/misc";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import useResponsive from "@/helpers/hooks/useResponsive";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import toast from "react-hot-toast";
import Image from "next/image";
import CustomButton from "@/components/custombutton/CustomButton";

// Define types for milestone data
type Milestone = {
  hourly_id: string | number;
  title: string;
  total_amount?: number;
  amount?: number;
};

function InvoiceGenerater() {
  useStartPageFromTop();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { isMobile } = useResponsive();

  const exportPdf = useCallback(() => {
    toast.dismiss();
    toast.loading("Downloading PDF...");
    const input = document.getElementById("invoice");
    if (!input || !id) return;

    html2canvas(input).then((canvas) => {
      if (canvas) {
        const imgData = canvas.toDataURL("image/png");
        // Initialize PDF with A4 size
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // A4 measurements
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate dimensions to fit the image properly on A4
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        // If image height is greater than PDF height, scale it down
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = (imgProps.width * finalHeight) / imgProps.height;
        }

        // Center the image horizontally if it's smaller than page width
        const xOffset = finalWidth < pdfWidth ? (pdfWidth - finalWidth) / 2 : 0;

        pdf.addImage(imgData, "PNG", xOffset, 0, finalWidth, finalHeight);
        pdf.save(`ZMZ Invoice (0000${id}).pdf`);
        toast.dismiss();
        if (isMobile) router.back();
      }
    });
  }, [id, isMobile, router]);

  const feeBreakUpHandler = () => {
    const result = { subtotal: 0, fee: 0 };
    if (!invoice) return result;

    const { fee_amount, amount, payment_type } = invoice;
    const operator = payment_type === "transfer" ? "+" : "-";

    result.subtotal = eval(
      `${Number(amount)} ${operator} ${Number(fee_amount)}`
    );

    result.fee = fee_amount;

    return result;
  };

  const { data, isLoading, isRefetching } = useQuery(
    ["invoice", id],
    () => getInvoice(id),
    {
      enabled: !!id,
    }
  );
  const invoice = data?.data;
  const feeBreakup = React.useMemo(() => {
    const { fee, subtotal } = feeBreakUpHandler();
    return {
      total: invoice?.amount,
      subtotal,
      fee,
      percentage:
        invoice?.fee_percentage == 4.9
          ? "4.9%"
          : invoice?.fee_percentage == 2.9
            ? "2.9%"
            : `${invoice?.fee_percentage}%`,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice]);

  useEffect(() => {
    if (isMobile && !isLoading && !isRefetching && invoice) {
      exportPdf();
    }
  }, [exportPdf, invoice, isLoading, isMobile, isRefetching]);

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto my-5 w-[800px]">
      <BackButton className="mt-2  print:hidden" />
      <div className="p-4" id="invoice">
        <header className="flex justify-between mt-6">
          <div>
            <span className="capitalize">
              {[invoice?.userData.first_name, invoice?.userData.last_name].join(
                " "
              )}
            </span>
            <br />
            {invoice?.userData?.u_email_id} <br />
            {[
              invoice?.userData.location.state,
              invoice?.userData.location.country_short_name,
            ].join(", ")}
          </div>

          <Image
            style={{ aspectRatio: "1/1" }}
            src="/images/zehmizeh-logo.svg"
            alt="logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </header>
        <section className="flex justify-between mt-10">
          <div>
            <b className="text-sm">Bill to:</b> <br />
            ZehMizeh
          </div>
          <div>
            <div>
              <b className="text-sm">Invoice Number:</b> <br />
              0000{id}
            </div>
            <div className="mt-6">
              <span className="text-sm">
                <b>Date:</b>
              </span>{" "}
              <br />
              {formatLocalDate(invoice?.date_created, "LL")}
            </div>
          </div>
          <div className="text-end">
            <span className="text-sm">
              <b>Amount Due:</b>
            </span>{" "}
            <br />
            <h2 className="text-xl">
              {/* <span className="uppercase">{invoice?.currency}</span>{' '} */}
              {numberWithCommas(invoice?.amount, "USD")}
            </h2>
          </div>
        </section>
        <div className="summary mt-6">
          <table className="w-full table-fixed">
            <thead className="bg-[#f2b420]">
              <tr>
                <td className="p-2.5 pl-4 uppercase text-center w-full">
                  Description
                </td>
                <td className="p-2.5 pl-4 uppercase text-center w-full">
                  Project
                </td>
                {/* <td>Rate</td> */}
                <td className="p-2.5 pl-4 uppercase text-center w-full">
                  Line Total
                </td>
              </tr>
            </thead>
            <tbody>
              {invoice?.milestone ? (
                <tr className="invoice-content">
                  <td className="capital-first-ltr p-4 pb-8 text-center">
                    {invoice?.milestone.title}
                  </td>
                  <td className="capital-first-ltr p-4 pb-8 text-center">
                    {convertToTitleCase(invoice?.jobdata.job_title)}
                  </td>
                  {/* <td>{numberWithCommas(invoice?.amount, 'USD')}</td> */}
                  <td className="p-4 pb-8 text-center">
                    {numberWithCommas(feeBreakup?.subtotal, "USD")}
                  </td>
                </tr>
              ) : (
                <>
                  {Array.isArray(invoice?.milestones) &&
                    invoice?.milestones.map((milestone: Milestone) => (
                      <tr
                        className="invoice-content"
                        key={`milestone-${milestone.hourly_id}`}
                      >
                        <td className="capital-first-ltr p-4 pb-8 text-center">
                          {milestone?.title}
                        </td>
                        <td className="capital-first-ltr p-4 pb-8 text-center">
                          {convertToTitleCase(invoice?.jobdata.job_title)}
                        </td>
                        <td className="p-4 pb-8 text-center">
                          {numberWithCommas(
                            milestone?.total_amount || milestone?.amount || 0,
                            "USD"
                          )}
                        </td>
                      </tr>
                    ))}
                </>
              )}

              <tr className="border-t border-[#e9e7e7]">
                <td
                  className="p-2.5 pl-4 uppercase text-center w-full"
                  colSpan={2}
                ></td>
                <td
                  className="p-2.5 pl-4 uppercase text-center w-full"
                  colSpan={2}
                >
                  <table className="mt-6 w-full text-end table-fixed">
                    <tbody>
                      <tr>
                        <td className="p-1.5 text-sm" width={180}>
                          {invoice.payment_type !== "charge"
                            ? "Freelancer Original Price"
                            : "Subtotal"}
                          :
                        </td>
                        <td className="p-1.5 text-sm">
                          {/* <span className="uppercase">
                            {invoice?.currency}
                          </span>{' '} */}
                          {numberWithCommas(feeBreakup.subtotal, "USD")}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1.5 text-sm" width={150}>
                          ZehMizeh Fee ({feeBreakup.percentage}):
                        </td>
                        <td className="text-sm">
                          <span>
                            {invoice.payment_type === "transfer" ? "-" : " + "}
                          </span>
                          {numberWithCommas(feeBreakup.fee, "USD")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr
                className="total"
                style={{
                  borderTop: "1px solid #ccc",
                }}
              >
                <td
                  className="p-2.5 pl-4 uppercase text-center w-full"
                  colSpan={2}
                ></td>
                <td
                  className="p-2.5 pl-4 uppercase text-center w-full"
                  colSpan={2}
                >
                  <table className="w-full text-end  table-fixed">
                    <tbody>
                      <tr>
                        <td className="p-1.5 text-sm" width={130}>
                          Total:
                        </td>
                        <td className="text-base p-1.5 ">
                          <b>{numberWithCommas(invoice?.amount, "USD")}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center flex gap-2 justify-center mt-10 print:hidden">
        {/* <StyledButton size="sm" onClick={exportPdf}>
          Download
        </StyledButton> */}

        <CustomButton
          text={"Download"}
          className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px] mx-2"
          onClick={exportPdf}
        />

        <CustomButton
          text={"Print"}
          className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full text-[16px] border-2 hover:border-black hover:text-white hover:bg-black"
          onClick={() => window.print()}
        />
      </div>
    </div>
  );
}

export default InvoiceGenerater;
