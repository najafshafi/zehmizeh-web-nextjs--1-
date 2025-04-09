"use client";
import { StyledButton } from "@/components/forms/Buttons";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
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

const Wrapper = styled.div`
  margin: 20px auto;
  width: 800px;
`;

const InvoiceBody = styled.div`
  padding: 1rem;
  table {
    width: 100%;
    table-layout: fixed;
  }
  .summary-header {
    background: #f2b420;
    tr > td {
      padding: 0.6rem 0.6rem 0.6rem 1rem;
      text-transform: uppercase;
      width: 100%;
      text-align: center;
    }
  }
  .invoice-content {
    td {
      padding: 1rem;
      padding-bottom: 2rem;
      text-align: center;
    }
  }
  .total-content {
    border-top: 1px solid #e9e7e7;
  }
  .total-inner {
    td {
      padding: 0.35rem;
      font-size: 0.875rem;
    }
  }
`;

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
  const { id } = router.query;
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
    () => getInvoice(id as string),
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
    <Wrapper>
      <BackButton className="mt-4 d-print-none" />
      <InvoiceBody id="invoice">
        <header className="flex justify-between mt-4">
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
        <section className="flex justify-between mt-5">
          <div>
            <b className="fs-14">Bill to:</b> <br />
            ZehMizeh
          </div>
          <div>
            <div>
              <b className="fs-14">Invoice Number:</b> <br />
              0000{id}
            </div>
            <div className="mt-4">
              <span className="fs-14">
                <b>Date:</b>
              </span>{" "}
              <br />
              {formatLocalDate(invoice?.date_created, "LL")}
            </div>
          </div>
          <div className="text-end">
            <span className="fs-14">
              <b>Amount Due:</b>
            </span>{" "}
            <br />
            <h2 className="fs-20">
              {/* <span className="text-uppercase">{invoice?.currency}</span>{' '} */}
              {numberWithCommas(invoice?.amount, "USD")}
            </h2>
          </div>
        </section>
        <div className="summary mt-4">
          <table className="w-100">
            <thead className="summary-header">
              <tr>
                <td>Description</td>
                <td>Project</td>
                {/* <td>Rate</td> */}
                <td>Line Total</td>
              </tr>
            </thead>
            <tbody>
              {invoice?.milestone ? (
                <tr className="invoice-content">
                  <td className="capital-first-ltr">
                    {invoice?.milestone.title}
                  </td>
                  <td className="capital-first-ltr">
                    {convertToTitleCase(invoice?.jobdata.job_title)}
                  </td>
                  {/* <td>{numberWithCommas(invoice?.amount, 'USD')}</td> */}
                  <td>{numberWithCommas(feeBreakup?.subtotal, "USD")}</td>
                </tr>
              ) : (
                <>
                  {Array.isArray(invoice?.milestones) &&
                    invoice?.milestones.map((milestone: Milestone) => (
                      <tr
                        className="invoice-content"
                        key={`milestone-${milestone.hourly_id}`}
                      >
                        <td className="capital-first-ltr">
                          {milestone?.title}
                        </td>
                        <td className="capital-first-ltr">
                          {convertToTitleCase(invoice?.jobdata.job_title)}
                        </td>
                        <td>
                          {numberWithCommas(
                            milestone?.total_amount || milestone?.amount || 0,
                            "USD"
                          )}
                        </td>
                      </tr>
                    ))}
                </>
              )}

              <tr className="total-content">
                <td colSpan={2}></td>
                <td colSpan={2}>
                  <table className="mt-4 w-100 text-end total-inner">
                    <tbody>
                      <tr>
                        <td width={180}>
                          {invoice.payment_type !== "charge"
                            ? "Freelancer Original Price"
                            : "Subtotal"}
                          :
                        </td>
                        <td>
                          {/* <span className="text-uppercase">
                            {invoice?.currency}
                          </span>{' '} */}
                          {numberWithCommas(feeBreakup.subtotal, "USD")}
                        </td>
                      </tr>
                      <tr>
                        <td width={150}>
                          ZehMizeh Fee ({feeBreakup.percentage}):
                        </td>
                        <td>
                          <span>
                            {invoice.payment_type === "transfer" ? "-" : "+"}
                          </span>{" "}
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
                <td colSpan={2}></td>
                <td colSpan={2}>
                  <table className="w-100 text-end total-inner">
                    <tbody>
                      <tr>
                        <td width={130}>Total:</td>
                        <td className="fs-1rem">
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
      </InvoiceBody>
      <div className="text-center flex gap-2 justify-center mt-5 d-print-none">
        <StyledButton size="sm" onClick={exportPdf}>
          Download
        </StyledButton>
        <StyledButton
          size="sm"
          variant="outline-primary"
          onClick={() => window.print()}
        >
          Print
        </StyledButton>
      </div>
    </Wrapper>
  );
}

export default InvoiceGenerater;
