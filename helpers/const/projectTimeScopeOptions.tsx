import TimeScopeSimple from "../../public/icons/timescope_simple.svg";
import TimeScopeBigger from "../../public/icons/timescope_bigger.svg";
import TimeScopeOnGoing from "../../public/icons/timescope_ongoing.svg";

export const PROJECT_TIME_SCOPE_OPTIONS = [
  {
    label: "Short Project",
    description: "Fewer than 10 Hours",
    icon: <TimeScopeSimple />,
    key: "simple",
  },
  {
    label: "Medium Project",
    description: "10 - 40 Hours",
    icon: <TimeScopeBigger />,
    key: "bigger",
  },
  {
    label: "Ongoing Project",
    icon: <TimeScopeOnGoing />,
    key: "ongoing",
  },
];
