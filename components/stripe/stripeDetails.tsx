import { StripeContainer } from "./stripeStyled";
import "./style.css";
import Tooltip from "@/components/ui/Tooltip";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { StyledButton } from "@/components/forms/Buttons";
import { getStripeVerificationLink } from "@/helpers/http/freelancer";
import { isUserStripeVerified, pusherApiKey } from "@/helpers/utils/helper";
import StripeActivationModal from "@/pages/freelancer-profile-settings/partials/StripeActivationModal";
import toast from "react-hot-toast";
import HowToRegisterAccModal from "@/pages/freelancer-profile-settings/partials/HowToRegisterAccModal";
import { TStripeStatus } from "@/helpers/types/stripe.type";
import StripeResetModal from "./stripeResetModal";
import Pusher from "pusher-js";
import { IDENTITY_DOCS } from "@/helpers/const/constants";
import StripeAcceptableIDModal from "./stripeAcceptableIDModal";
import { Link } from "react-router-dom";

interface Prop {
  stripe: any;
  stripeStatus?: TStripeStatus;
  totalEarnings: any;
  refetch: () => void;
}

interface PusherDt {
  updated_status: string;
}

let pusher: Pusher | null = null;

const CONSTANTS: { [key: string]: string } = {
  "Ssn last 4": "Social Security number or Identity document",
  Phone: "Phone Number",
};

const StripeDetails = (props: Prop) => {
  const { stripe = null, stripeStatus = null, refetch } = props ?? {};
  const [step, setStep] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const [generatingLink, setGeneratingLink] = useState<boolean>(false);
  const [messageFromStripe, setMessageFromStripe] = useState<string>("");
  const [showHowToRegModal, setShowHowToRegModal] = useState<boolean>(false);
  const [stripeResetModal, setStripeResetModal] = useState(false);
  const [ShowAcceptableIDModal, setAcceptableIDModal] =
    useState<boolean>(false);
  const content = useMemo(() => {
    const data = {
      label: "Not started (Required)",
      description: "Submit your details so you can get paid on ZMZ",
      tooltip:
        "After registering for Stripe, this is where freelancers can add the details of the bank account(s) that their fees will be sent to. These are not visible to any other user.",
    };

    if (stripeStatus) {
      switch (stripeStatus) {
        case "pending":
          if (!stripe?.id) data.label = "Not started (Required)";
          else data.label = "New Submissions Needed";
          break;
        case "currently_due":
          data.label = "New Submissions Needed";
          break;
        case "pending_verification":
          data.label = "Verifying Info";
          data.description = "Verification can take 3-5 days.";
          data.tooltip = "Verification can take 3-5 days";
          break;
        case "bank_account_pending":
          data.label = "Bank Account Pending";
          data.description =
            "Complete setting up your payment preferences by adding bank details to the box on the right.";
          data.tooltip =
            "Complete setting up your payment preferences by adding bank details to the box on the right.";
          break;
        case "verified":
          data.label = "Verified";
          data.description = `You've successfully set up your payment info - you're ready to start freelancing!`;
          data.tooltip =
            "All required information has been provided to activate your Stripe account. You can now accept payments and receive payments.";
          break;
        default:
          data.label = (stripeStatus as string).replace(/_/g, " ");
          data.description = `Submit your details so you can get paid on ZMZ`;
          data.tooltip =
            "After registering for Stripe, this is where freelancers can add the details of the bank account(s) that their fees will be sent to. These are not visible to any other user.";
      }
      if (messageFromStripe) {
        data.label = "New Submissions Needed";
      }
    }
    return {
      pending: data,
      inprogress: data,
      verified: data,
    };
  }, [messageFromStripe, stripe?.id, stripeStatus]);

  const [stripeDetails, setStripeDetails] = useState<any>({
    status: "pending",
    message: content["pending"].description,
  });

  const { status, message } = stripeDetails;
  const {
    individual: { first_name, last_name },
  } = stripe ?? { individual: {} };

  const buttonStyle = {
    fontSize: "15px",
    fontWeight: 500,
    minHeight: "unset",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
  };

  const verificationHandler = async () => {
    setLoading(true);
    try {
      const { account_url } = await getStripeVerificationLink(stripe.country);
      window.location.replace(account_url);
      setLoading(true);
    } catch (error) {
      setLoading(false);
    }
  };

  const toggleHowToRegModal = () => {
    // This function will toggle the Hide/ show the How to register details
    setShowHowToRegModal(!showHowToRegModal);
  };

  const toggleAcceptableIDModal = () => {
    // This function will toggle the Hide/ show the How to register details
    setAcceptableIDModal(!ShowAcceptableIDModal);
  };

  const missingDetails = (finalRequirementArr: string[]) => {
    // Date of birth
    const dob_arr = ["Month", "Day", "Year"];

    for (let i = 0; i < dob_arr.length; i++) {
      if (finalRequirementArr.includes(dob_arr[i])) {
        finalRequirementArr = finalRequirementArr.filter(
          (rq) => !dob_arr.includes(rq)
        );
        finalRequirementArr.push("Birthdate");
        break;
      }
    }

    // address
    const add_arr = ["Postal code", "City", "Line1", "State"];

    for (let i = 0; i < add_arr.length; i++) {
      if (finalRequirementArr.includes(add_arr[i])) {
        finalRequirementArr = finalRequirementArr.filter(
          (rq) => !add_arr.includes(rq)
        );
        finalRequirementArr.push("Address");
        break;
      }
    }

    // ID Number
    // const id_num = 'Id number';
    // if (finalRequirementArr.includes(id_num)) {
    //   finalRequirementArr = finalRequirementArr.filter((el) => el !== id_num);
    //   finalRequirementArr.push('ID Number');
    // }

    // URL
    const url = "Url";
    if (finalRequirementArr.includes(url)) {
      finalRequirementArr = finalRequirementArr.filter((el) => el !== url);
      finalRequirementArr.push("URL");
    }

    // ordering the array
    const valid_order = [
      "URL",
      // 'ID Number',
      "First name",
      "Last name",
      "Birthdate",
      "Address",
      "Phone",
      "Ssn last 4",
    ];

    const final_arr: string[] = [];
    valid_order.map((or_el) => {
      if (finalRequirementArr.includes(or_el)) final_arr.push(or_el);
    });

    return final_arr.map((el, index) => (
      <li key={`required-stp-${index}`} className="mt-1">
        {CONSTANTS[el] ?? el}
      </li>
    ));
  };

  const stripeInprogressHandler = () => {
    const finalRequirementArr = isUserStripeVerified(stripe);

    let finalMessage: ReactElement | string;

    if (finalRequirementArr.length) {
      // This means only document is pending to submit
      // So changing text to inform user that only document is pending and how to add it
      if (
        finalRequirementArr.length === 1 &&
        finalRequirementArr[0] === "Document"
      ) {
        finalMessage = (
          <div className="fs-18">
            <b>
              To finish verification - please add a Personal Identity Document.
            </b>
            <p className="mb-2">
              To add: click ‘Go to Stripe’ below, then click ‘Edit’ by your
              personal details.
            </p>
          </div>
        );
      } else {
        finalMessage = (
          <div>
            <p className="mb-0">
              To continue your registration with Stripe, click "Go to Stripe"
              and add this info:
            </p>
            <ul className="ps-3 mt-1">{missingDetails(finalRequirementArr)}</ul>
          </div>
        );
      }
      finalMessage = stripe?.country &&
        stripe?.individual?.verification?.status &&
        stripe?.individual?.verification?.status != "verified" && (
          <>
            {finalMessage}
            <div>
              <div>
                Please upload one of the following acceptable ID documents:
              </div>
              <ul className="ps-3 mt-1">
                {stripe?.country &&
                  Array.isArray(
                    IDENTITY_DOCS?.[
                      stripe?.country as keyof typeof IDENTITY_DOCS
                    ]
                  ) &&
                  IDENTITY_DOCS[stripe.country as keyof typeof IDENTITY_DOCS]
                    .slice(0, 3)
                    .map((item) => (
                      <li className="mt-1" key={item}>
                        {item}
                      </li>
                    ))}
                {IDENTITY_DOCS[stripe.country as keyof typeof IDENTITY_DOCS]
                  ?.length > 3 && (
                  <div
                    className="flex reset-password fs-16 fw-400 pointer"
                    onClick={toggleAcceptableIDModal}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    See More Options
                  </div>
                )}
              </ul>
            </div>
          </>
        );
    } else {
      if (stripeStatus !== "bank_account_pending") setShowBtn(false);
      finalMessage = content["inprogress"].description;
    }
    return setStripeDetails({
      ...stripeDetails,
      status: "inprogress",
      message: finalMessage,
    });
  };

  const stripeDetailsHandler = () => {
    if (!stripe?.id)
      return setStripeDetails((prev) => ({ ...prev, status: "pending" }));

    if (stripeStatus && !["verified"].includes(stripeStatus))
      return stripeInprogressHandler();
    else
      return setStripeDetails({
        ...stripeDetails,
        status: "verified",
        message: content["verified"].description,
      });
  };

  const messageFromStripeHandler = () => {
    if (stripe == null) return;
    let errors = stripe?.requirements?.errors ?? [];

    // error for future requirements
    if (!Array.isArray(errors) || errors?.length <= 0) {
      errors = stripe?.future_requirements?.errors ?? [];
    }
    const reason = errors[0]?.reason;
    if (typeof reason !== "string") return;

    if (reason) stripeInprogressHandler();
    setMessageFromStripe(reason);
  };

  useEffect(() => {
    stripeDetailsHandler();
    messageFromStripeHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

  // pusher for real time changes
  useEffect(() => {
    if (!stripe?.id) return;

    if (pusher) {
      pusher.disconnect();
      pusher = null;
    }

    const pusher_api_key = pusherApiKey();
    pusher = new Pusher(pusher_api_key, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`STRIPE-${stripe?.id}`);
    channel.bind("stripe-account-updated", (data: PusherDt) => {
      if (stripeStatus !== data.updated_status) refetch();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

  if (!content[status]) return null;

  const generateVerifyLink = (country: { country_short_name: string }) => {
    // This function will generate a stripe verification link to redirect the user to stripe

    setGeneratingLink(true);
    getStripeVerificationLink(country.country_short_name)
      .then((res) => {
        if (res.status) {
          window.location.replace(res.account_url);
        }
        setGeneratingLink(false);
      })
      .catch((err) => {
        setGeneratingLink(false);
        toast.error(err.response.data.message);
      });
  };

  const onVerify = (country: any) => {
    setStep(NaN);
    generateVerifyLink(country);
  };

  return (
    <StripeContainer className={`stripe-${status}`}>
      {stripe?.id && (
        <>
          <StripeResetModal
            show={stripeResetModal}
            onClose={() => setStripeResetModal(false)}
            refetch={refetch}
          />
          <p
            className="reset-stripe-btn"
            onClick={() => setStripeResetModal(true)}
          >
            Reset Stripe
          </p>
        </>
      )}

      {status === "pending" && (
        <>
          {/* Strip 3 step activation modal */}
          <StripeActivationModal
            step={step}
            setStep={setStep}
            onVerify={onVerify}
          />

          {/* How to register account modal */}
          <HowToRegisterAccModal
            show={showHowToRegModal}
            toggle={toggleHowToRegModal}
          />

          <div
            className="flex justify-content-end reset-password fs-18 fw-400 pointer"
            onClick={toggleHowToRegModal}
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            How to Register?
          </div>
        </>
      )}

      <div>
        <div className="flex items-center justify-content-between">
          <h3>Stripe Account Details</h3>
        </div>
        <div className="mt-4">
          <div className="flex  gap-3">
            <div className=" stripe-tag">
              <span>{content[status].label}</span>

              {content[status].tooltip && (
                <Tooltip className="stripe-tooltip">
                  {content[status].tooltip}
                </Tooltip>
              )}
            </div>

            {stripe?.id && (
              <div className="stripe-tag">
                <span>{`ACCT: ${stripe?.id.split("_")[1]}`}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <table className="no-border">
            <tr>
              <td className="pb-3">Full Name</td>
              <td className="ps-5 pb-3">
                {first_name && last_name ? (
                  <>
                    {first_name} {last_name}
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td className="ps-5">{stripe?.email ?? "-"}</td>
            </tr>
          </table>
        </div>

        <div className="capabilities-container-wrapper mt-4 mb-4">
          <p className="stripe-message my-3">{message}</p>
          {status == "pending" && (
            <p className="stripe-message my-3">
              For Stripe verification, you need to upload a ID document. You can
              check the acceptable ID documents for your preferred country{" "}
              <a
                className="text-primary"
                target="_blank"
                rel="noreferrer"
                href="https://docs.stripe.com/acceptable-verification-documents"
              >
                (here) .
              </a>
            </p>
          )}
          {status == "pending" && (
            <>
              <Link className="d-block text-primary" to="/support/faq/stripe">
                Help with Stripe
              </Link>
              <br />
            </>
          )}
          {messageFromStripe && (
            <p className="stripe-message">Stripe: {messageFromStripe}</p>
          )}

          {!stripe && (
            <StyledButton
              disabled={generatingLink}
              style={buttonStyle}
              onClick={() => setStep(1)}
            >
              {generatingLink ? (
                <Spinner animation="border" />
              ) : (
                "Begin Stripe Activation"
              )}
            </StyledButton>
          )}

          {((stripe?.id &&
            ["pending", "currently_due"].includes(stripeStatus) &&
            showBtn) ||
            isUserStripeVerified(stripe).length > 0) && (
            <StyledButton
              style={buttonStyle}
              disabled={loading}
              onClick={() => verificationHandler()}
            >
              {loading ? <Spinner animation="border" /> : "Go to Stripe"}
            </StyledButton>
          )}
        </div>
      </div>
      <StripeAcceptableIDModal
        show={ShowAcceptableIDModal}
        toggle={toggleAcceptableIDModal}
        country={stripe?.country}
      />
    </StripeContainer>
  );
};

export default StripeDetails;
