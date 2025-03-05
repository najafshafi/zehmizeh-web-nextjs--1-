"use client";

import { Popover } from "@headlessui/react";
import Image from "next/image";
import IntercomIcon from "@/assets/icons/intercom.svg";

type Props = {
  adBlockDetected: boolean;
};

const AdBlockPopover = ({ adBlockDetected }: Props) => {
  if (!adBlockDetected) return null;

  return (
    <Popover className="relative">
      <Popover.Button className="focus:outline-none">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition">
          <Image src={IntercomIcon} alt="Intercom Icon" className="w-6 h-6" />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute left-full ml-2 w-48 p-2 text-sm text-white bg-gray-800 rounded shadow-lg">
        Please disable <strong>Ad Blocker</strong> and reload the page to access support.
      </Popover.Panel>
    </Popover>
  );
};

export default AdBlockPopover;