import { ReactComponent as TimeScopeSimple } from 'assets/icons/timescope_simple.svg';
import { ReactComponent as TimeScopeBigger } from 'assets/icons/timescope_bigger.svg';
import { ReactComponent as TimeScopeOnGoing } from 'assets/icons/timescope_ongoing.svg';

export const PROJECT_TIME_SCOPE_OPTIONS = [
  {
    label: 'Short Project',
    description: 'Fewer than 10 Hours',
    icon: <TimeScopeSimple />,
    key: 'simple',
  },
  {
    label: 'Medium Project',
    description: '10 - 40 Hours',
    icon: <TimeScopeBigger />,
    key: 'bigger',
  },
  {
    label: 'Ongoing Project',
    icon: <TimeScopeOnGoing />,
    key: 'ongoing',
  },
];
