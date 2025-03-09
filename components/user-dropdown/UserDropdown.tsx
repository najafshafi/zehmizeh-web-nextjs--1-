import { Fragment, ReactElement } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import DownArrowIcon from "../../public/icons/chevronDown.svg";
import Image from "next/image";

interface MenuItem {
  link: string;
  text: string;
}

interface User {
  user_image?: string;
}

interface Auth {
  user?: User;
  signout: () => void;
}

interface UserDropdownProps {
  displayUserName: () => string;
  profileDropdownMenuItem: MenuItem[];
  toggleNavbar: () => void;
  auth: Auth;
}

export default function UserDropdownComp({
  displayUserName,
  profileDropdownMenuItem,
  toggleNavbar,
  auth,
}: UserDropdownProps): ReactElement {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center bg-transparent border-none text-inherit focus:outline-none">
          <Image
            src={auth?.user?.user_image || "/images/default_avatar.png"}
            alt="profile-image"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="ml-2 text-lg font-medium capitalize">
            {displayUserName()}
          </span>
          <DownArrowIcon className="ml-1 w-4 h-4" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          onClick={toggleNavbar}
          className="absolute right-0 mt-2 w-48 origin-top-right bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            {profileDropdownMenuItem.map(({ link, text }) => (
              <Menu.Item key={`${text}-${link}`}>
                {({ active }) => (
                  <Link
                    href={link}
                    className={`block px-5 py-2.5 text-sm ${
                      active ? "bg-blue-100 text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {text}
                  </Link>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={auth.signout}
                  className={`block w-full text-left px-5 py-2.5 text-sm ${
                    active ? "bg-blue-100 text-blue-600" : "text-pink-600"
                  }`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
