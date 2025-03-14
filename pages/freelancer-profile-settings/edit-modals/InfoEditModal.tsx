import { useState, useEffect, useCallback } from "react";
import { VscClose } from "react-icons/vsc";
import toast from "react-hot-toast";
import ErrorMessage from "@/components/ui/ErrorMessage";
import CountryDropdown from "@/components/forms/country-dropdown/CountryDropdown";
import StateDropdown from "@/components/forms/state-picker/StatePicker";
import { getYupErrors } from "@/helpers/utils/misc";
import { editUser } from "@/helpers/http/auth";
import { onlyCharacters } from "@/helpers/validation/common";
import Tooltip from "@/components/ui/Tooltip";
import EmailEditModal from "@/components/profile/EmailEditModal";
import InfoIcon from "../../../public/icons/info-gray-18.svg";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { freelancerProfileTabValidation } from "@/helpers/validation/freelancerProfileTabValidation";
import { CONSTANTS } from "@/helpers/const/constants";

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  data: IFreelancerDetails;
  refetch: () => void;
};

type TFormState = Pick<
  IFreelancerDetails,
  | "user_image"
  | "first_name"
  | "last_name"
  | "location"
  | "hourly_rate"
  | "u_email_id"
>;

const initialState: TFormState = {
  user_image: "",
  first_name: "",
  last_name: "",
  location: null,
  hourly_rate: 0,
  u_email_id: "",
};

const InfoEditModal = ({ show, onClose, onUpdate, data, refetch }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<TFormState>(initialState);
  const [errors, setErrors] = useState<TFormState>(undefined);
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);

  const toggleEditModal = () => {
    setShowEditEmailModal(!showEditEmailModal);
  };

  const onUpdateEmail = (value: string) => {
    handleChange("u_email_id", value);
    refetch();
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  useEffect(() => {
    if (data && show) {
      setFormState({
        user_image: data?.user_image,
        first_name: data?.first_name,
        last_name: data?.last_name,
        location: data?.location,
        hourly_rate: data?.hourly_rate,
        u_email_id: data?.u_email_id,
      });
    } else {
      setFormState(initialState);
    }
  }, [data, show]);

  const handleChange = useCallback(
    (field: keyof TFormState, value: TFormState[keyof TFormState]) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const handleUpdate = () => {
    setErrors(undefined);
    freelancerProfileTabValidation
      .validate(formState, { abortEarly: false })
      .then(() => {
        setLoading(true);
        const body = {
          user_image: formState?.user_image,
          first_name: formState?.first_name?.trim(),
          last_name: formState?.last_name?.trim(),
          hourly_rate: formState?.hourly_rate
            ? parseFloat(formState?.hourly_rate?.toString())
            : 0,
          location: formState?.location,
        };
        const promise = editUser(body);
        toast.promise(promise, {
          loading: "Updating your details - please wait...",
          success: (res) => {
            onUpdate();
            onClose();
            setLoading(false);
            return res.message;
          },
          error: (err) => {
            setLoading(false);
            return err?.response?.data?.message || "error";
          },
        });
      })
      .catch((err) => {
        const errors = getYupErrors(err);
        setErrors({ ...errors });
      });
  };

  const onSelectState = (item: { label: string; value: string } | null) => {
    console.log("Selected state:", item);
    setFormState((prevFormState) => {
      const newState = {
        ...prevFormState,
        location: {
          ...prevFormState.location,
          state: item ? item.value : null,
        },
      };
      console.log("Updated formState:", newState);
      return newState;
    });
  };

  const onSelectCountry = (item: TFormState["location"]) => {
    handleChange("location", item);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center bg-black/40  justify-center z-50">
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl max-w-[678px] max-h-[643px] w-full py-8 px-4 md:p-12 relative z-50 m-2">
        <VscClose
          type="button"
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />
        <div className="space-y-6">
          <h3
            className="font-bold mb-2"
            style={{ lineHeight: 1.2, fontSize: "calc(1rem + .6vw)" }}
          >
            Edit Profile Details
          </h3>

          <div className="space-y-5 px-3">
            {/* Username Section */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-normal">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="mt-1.5 w-full p-4 border border-black rounded-lg"
                  value={formState?.first_name}
                  onChange={(e) =>
                    handleChange("first_name", onlyCharacters(e.target.value))
                  }
                  maxLength={35}
                />
                {errors?.first_name && (
                  <ErrorMessage message={errors.first_name} />
                )}
              </div>
              <div className="flex-1">
                <label className="text-sm font-normal">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="mt-1.5 w-full p-4 border border-black rounded-lg"
                  value={formState?.last_name}
                  onChange={(e) =>
                    handleChange("last_name", onlyCharacters(e.target.value))
                  }
                  maxLength={35}
                />
                {errors?.last_name && (
                  <ErrorMessage message={errors.last_name} />
                )}
              </div>
            </div>

            {/* Hourly Rate Section */}
            <div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-normal">
                  Hourly Rate<span className="text-red-500">*</span>
                </label>
                <Tooltip customTrigger={<InfoIcon />} className="inline-block">
                  The purpose here is to share your standard hourly rate if you
                  have one. If you have different rates for different projects,
                  or no standard at all, leave this section empty.
                </Tooltip>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pt-1 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  placeholder="Enter your hourly rate"
                  className="mt-1.5 w-full p-4 pl-7 border border-black rounded-lg"
                  value={formState?.hourly_rate}
                  onChange={(e) =>
                    handleChange(
                      "hourly_rate",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength={3}
                />
              </div>
              {errors?.hourly_rate && (
                <ErrorMessage message={errors.hourly_rate.toString()} />
              )}
            </div>

            {/* Country Section */}
            <div>
              <label className="text-sm font-normal mb-1 block">
                Country<span className="text-red-500">*</span>
              </label>
              <CountryDropdown
                selectedCountry={formState?.location}
                onSelectCountry={onSelectCountry}
              />
              {errors?.location?.country_name && (
                <ErrorMessage message={errors?.location?.country_name} />
              )}
            </div>

            {/* State/Region Section */}
            {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
              formState?.location?.country_short_name
            ) && (
              <div>
                <label className="text-sm font-normal mb-1 block">
                  State/Region<span className="text-red-500">*</span>
                </label>
                <StateDropdown
                  countryCode={formState?.location?.country_short_name}
                  onSelectState={onSelectState}
                  selectedState={
                    formState?.location?.state
                      ? {
                          label: formState?.location?.state,
                          value: formState?.location?.state,
                        }
                      : null
                  }
                  borderColor="#000"
                />
                {errors?.location?.state && (
                  <ErrorMessage message={errors.location.state} />
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-end mt-6">
            <button
              className="bg-[#F2B420] text-[#212529] px-10 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:bg-[#F2A420]"
              style={{ lineHeight: 1.6875 }}
              disabled={loading}
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <EmailEditModal
        show={showEditEmailModal}
        existingEmail={data?.u_email_id}
        onClose={toggleEditModal}
        onUpdateEmail={onUpdateEmail}
      />
    </div>
  );
};

export default InfoEditModal;
