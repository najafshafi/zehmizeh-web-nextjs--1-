import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";
import LoadingButtons from "@/components/LoadingButtons";

// Define option type for React-Select
interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = [
  { value: "1", label: "Once A Week" },
  { value: "2", label: "Twice A Week" },
  { value: "3", label: "Disable Job Alerts" },
];

const defaultOptions: Record<number, OptionType> = {
  1: { value: "1", label: "Once A Week" },
  2: { value: "2", label: "Twice A Week" },
  3: { value: "3", label: "Disable Job Alerts" },
};

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: (data: OptionType) => void;
  loading: boolean;
  defaultEmailNotification: number;
};

const ManageNotificationModal = ({
  show,
  toggle,
  onConfirm,
  loading,
  defaultEmailNotification = 1,
}: Props) => {
  const [selectedOPT, setSelectedOPT] = useState<OptionType>(
    defaultOptions[defaultEmailNotification] || defaultOptions[1]
  );

  useEffect(() => {
    if (show)
      setSelectedOPT(
        defaultOptions[defaultEmailNotification] || defaultOptions[1]
      );
  }, [show, defaultEmailNotification]);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={toggle}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[678px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button
                  type="button"
                  className="absolute top-3 right-3 text-3xl font-normal text-gray-400 hover:text-gray-600"
                  onClick={toggle}
                >
                  &times;
                </button>

                <div>
                  <div className="content flex flex-col">
                    <Dialog.Title className="text-[28px] font-normal">
                      Manage Notification
                    </Dialog.Title>
                    <Select
                      defaultValue={selectedOPT}
                      value={selectedOPT}
                      className="mt-3"
                      options={options}
                      onChange={(dt) => setSelectedOPT(dt as OptionType)}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button"
                      disabled={loading}
                      className="min-w-[10rem] px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onConfirm(selectedOPT)}
                    >
                      {loading ? <LoadingButtons /> : "Save"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ManageNotificationModal;
