import { ReactComponent as NewJobIcon } from 'assets/icons/newjob.svg';
import { ReactComponent as DraftIcon } from 'assets/icons/draft.svg';
import { ReactComponent as TemplateIcon } from 'assets/icons/template.svg';

export const POST_JOB_OPTIONS = [
  {
    id: 0,
    label: 'Post New Project',
    icon: <NewJobIcon />,
    key: 'new-job',
  },
  {
    id: 1,
    label: 'Edit Project Draft',
    icon: <DraftIcon />,
    key: 'draft',
  },
  {
    id: 2,
    label: 'Choose Template',
    icon: <TemplateIcon />,
    key: 'template',
  },
] as const;
