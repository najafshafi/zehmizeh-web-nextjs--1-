import { MdDescription } from 'react-icons/md';
import { GiSkills } from 'react-icons/gi';
import { MdTimer } from 'react-icons/md';
import { MdRoomPreferences } from 'react-icons/md';
import { MdPayment } from 'react-icons/md';
import { LuLayoutTemplate } from 'react-icons/lu';

export const CONSTANTS = {
  ABOUT_ME_MINIMUM_CHARACTERS: 120,
  ABOUT_ME_MAXIMUM_CHARACTERS: 5000,
  WEB_SPELL_CHECKER_DOM_ID: 'wsc-check',
  ckEditorPlaceholder: `Make your project description as detailed as possible.`,
  payment: {
    reviewWorkFirst: `I'll Review the Work First`,
    confirmAndPay: `Confirm and Pay`,
    areYouSureAboutThisTransaction: `Are you sure about this transaction?`,
    areYouSureAboutThisDelivery: `Are you sure about this delivery?`,
    theMilestoneGoesOverBudget: `This Milestone Goes Over Budget`,
  },
  job: {
    selectSubmissionsYoureReadyToPayFor: `Select the submissions that you're ready to pay for`,
  },
  ATTACHMENTS_LIMIT: 10,
  FILE_SIZE: {
    30: 30,
  },
  MAX_SELECT_CATEGORY: 10,
  MAX_SELECT_SKILLS: 10,
  DEFAULT_ATTACHMENT_SUPPORTED_TYPES: ['image/*', '.doc', '.docx', '.xls', '.xlsx', '.pdf'],
  PORTFOLIO_ATTACHMENT_SUPPORTED_TYPES: ['JPEG', 'PNG', 'JPG', 'WEBP', 'PDF', 'AVIF', 'MP4', 'MP3', 'WAV'],
  ESTIMATION_VALUES: [
    { id: 'hours', label: 'Hours' },
    { id: 'days', label: 'Days' },
    { id: 'weeks', label: 'Weeks' },
    { id: 'months', label: 'Months' },
  ],
  NEW_MESSAGE_EMAIL_OPTIONS: [
    { label: 'Email me every time I have an unread message', value: 1 },
    {
      label: 'Email once daily about unread messages',
      value: 2,
    },
    { label: "I don't want any emails about unread messages", value: 3 },
  ],
  NOTIFICATION_EMAIL: [
    { label: 'Every Day', value: 1 },
    { label: 'Sundays and Wednesdays', value: 3 },
    { label: 'Every Sunday', value: 2 },
    { label: 'Never (no project board emails)', value: 4 },
  ],
  COUNTRIES_SHORT_NAME_WITHOUT_STATE: ['GI'],
  POST_JOB_LOCATIONS: [
    'Anywhere',
    'USA & Canada',
    'Israel',
    'Europe & South Africa',
    'Mexico & South America',
    'Australia & New Zealand',
  ],
  POST_JOB_DEFAULT_LOCATION: ['Anywhere'],
  DELIVERY_DATE_OPTIONS: ['1 Week or Less', '1 Week - 3 Months', '3 Months or More'],
  POST_JOB_TITLE_MAX_CHARACTERS: 100,
  POST_JOB_DESCRIPTION_MAX_CHARACTERS: 5000,
  POST_JOB_MAX_REFERENCE_LINKS: 5,
  JOB_TITLE_EXAMPLES: [
    'Logo Design for Tech Startup - Creative and Modern Design Needed',
    'New Website for our Non-Profit (Experienced PHP Devs only)',
    'Content Writing for Travel Blog - Need Fun, Creative, SEO-Friendly Articles',
    'Social Media Marketing Campaign to Increase our Store’s Followers',
    'Seeking QuickBooks Expert for Small Business Bookkeeping',
  ],
  JOB_DESCRIPTION_QUESTION_ANSWER: [
    {
      question: 'Who is your project for?',
      answer: 'Is it personal, for your work, for your community? Who is the audience?',
    },
    {
      question: 'What is the project for?',
      answer:
        'What are you trying to accomplish with this project? What’s the context that led you to need this service or product?',
    },
    {
      question: 'What must the project include?',
      answer: 'Make a list of everything you want the freelancer to deliver by the end.',
    },
    {
      question: 'What are the measurements for this project?',
      answer:
        'Does it have to have a certain number of pages or words? Does it need to be a specific length, speed, file size?',
    },
    {
      question: 'What format does the project need to be in?',
      answer: 'Does the freelancer have to use a specific software? What type of files should they send?',
    },
  ],
  PROJECT_POSTED_HASH_VALUE: 'posted_project',
  VALUE_TO_SHOW_POSTED_PROJECT_MODAL_CHECKBOX: 5,
};
export const BOOKMARK_TOOLTIPS = {
  not_logged_in: 'Please login to save this freelancer.',
  save: 'Save this freelancer by clicking this.',
  unsave: 'Unsave this freelancer by clicking this.',
};

export const POST_JOB_STEPS = {
  CHOOSE_TEMPLATE_OR_DRAFT: {
    number: 0,
    label: 'Choose Template',
    icon: LuLayoutTemplate,
  },
  PROJECT_DESCRIPTION: { number: 1, label: 'Description', icon: MdDescription },
  SKILLS: { number: 2, label: 'Skills', icon: GiSkills },
  PROJECT_TIMING: { number: 3, label: 'Timing', icon: MdTimer },
  PROJECT_PREFERENCES: {
    number: 4,
    label: 'Preferences',
    icon: MdRoomPreferences,
  },
  PROJECT_PAYMENT: { number: 5, label: 'Payment', icon: MdPayment },
};

export const USER_PROFILE_SETTINGS_KEY = {
  DO_NOT_SHOW_SWITCH_TO_HIDDEN_POST_WARNING: 'do_not_show_switch_to_hidden_post_warning',
  DO_NOT_SHOW_SWITCH_TO_PUBLIC_POST_WARNING: 'do_not_show_switch_to_public_post_warning',
};
export const IDENTITY_DOCS = {
  US: [
    'Passport',
    'Passport card',
    'Driver license',
    'State issued ID card',
    'Resident permit ID / U.S. Green Card',
    'Border crossing card',
    'Child ID card',
    'NYC card',
    'U.S. visa card',
  ],
  IL: [
    "דרכון ישראלי, Darkon Yisre'eli (Passport)",
    "רשיון נהיגה, Rishion nehega (Driver's license) - scans of front and back are required",
  ],
  GB: ['Passport', 'Driver license', 'Resident permit', 'Citizen Card', 'Electoral ID'],
  BE: [
    'Paspoort / Passeport / Reisepass (Passport)',
    "Rijbewijs / Permis de conduire / Führerschein (Driver's license) - scans of front and back are required",
    "Elektronische identiteitskaart / Carte d'identité / eID (Identity card) - scans of front and back are required",
    'Elektronische vreemdelingenkaart / Carte d’identité d’étranger / Elektronische Ausländerkarte (Identity card for foreigners) - scans of front and back are required',
    'Verblijfsvergunning / Permis de résidence / Aufenthaltsgenehmigung (Residence permit) - dated within 12 months',
  ],
  CA: [
    'Passport / Passeport',
    'Driver’s licence / Permis de conduire - scans of front and back are required',
    'Permanent Resident card / Carte de résident permanent',
    'Provincial or territorial issued photo identity cards / Cartes d’identité avec photo délivrées par une province ou un territoire - scans of front and back are required',
    'Certificate of Indian Status card / Certificat du statut d’Indien',
    'Birth certificate / Acte de naissance',
    'Marriage certificate / Acte de mariage',
  ],
  ZA: ['Passport', 'Smart ID Card (National ID)', "Driver's License"],
  AU: [
    'Passport',
    "Driver Licence (Driver's license) - scans of front and back are required",
    'Photo Card - scans of front and back are required',
    'New South Wales Driving Instructor Licence - scans of front and back are required',
    'Tasmanian Government Personal Information Card - scans of front and back are required',
    'ImmiCard - scans of front and back are required',
    'Proof of Age card - scans of front and back are required',
    'Australian Defence Force (ADF) identification card (Military ID) - scans of front and back are required',
  ],
  MX: [
    'Pasaporte (Passport)',
    'Tarjeta de identificación (ID card) - scans of front and back are required',
    'ID consular / ID matricular consular (Consular ID/Matricular Consular ID Card)',
    'Credencial de elector (Voter ID card)',
    'CURP, Clave Única de Registro de Población',
    'Acta de nacimiento (Birth Certificate)',
    'Licencia de conducir (Driver license)',
  ],
  FR: [
    'Passeport (Passport)',
    "Permis de conduire (Driver's license) - scans of front and back are required",
    "Carte d'identité (Identity card) - scans of front and back are required",
    'Carte Vitale avec photo (Health insurance card)',
    "Carte d'identité avec photographie délivrée par les autorités militaires (Military identity card)",
    "Carte d'identité de parlementaire (Parliamentary identity card)",
    "Carte d'identité d'élu local (Elected official identity card)",
    "Carte du combattant avec photographie (Veteran's identity card)",
  ],
  DE: [
    'Reisepass (Passport)',
    "Führerschein (Driver's license) - scans of front and back are required",
    'Personalausweis (Identity card) - scans of front and back are required',
    'Aufenthaltstitel (Residence permit) - scans of front and back are required',
  ],
  AR: [
    'Pasaporte (Passport)',
    'Documento Nacional de Identidad (DNI) (National ID) - scans of front and back are required',
    'DNI para Extranjeros (Resident Permit) - scans of front and back are required',
  ],
  BR: [
    'Passaporte de estrangeiros (Non-Brazilian Passport)',
    "Carteira de Motorista (CNH) (Driver's license)",
    'Carteira de Identidade (RG) (National ID)',
    'Carteira de Registro Nacional Migratório (CRNM) (National Migration Registry Card)',
  ],
  HU: [
    'Útlevél (Passport)',
    'Személyazonosító igazolvány (Identity card) - scans of front and back are required',
    'Tartózkodási engedély (Residence permit) - scans of front and back are required',
  ],
  CH: [
    'Reisepass / Passeport / Passaporto (Passport)',
    'Führerschein / Permis de conduire / Licenza di condurre (Driver license)',
    "Identitäskarte / Carte d'identité / Carta d'identità (National ID) - scans of front and back are required",
    'Aufenthaltsbewilligung / Permis de séjour / Libretto per stranieri (Residence permit)',
  ],
  PA: ['Passport', 'Driving License'],
  NZ: [
    'Passport',
    'Driver license - scans of front and back are required',
    'New Zealand emergency travel document',
    'New Zealand refugee travel document',
    'New Zealand certificate of identity',
  ],
  GI: ['Passport', "Driver's license", 'Identity card'],
};

export const RATINGS_FILTER_ENUM = {
  lt_3: '< 3 stars',
  gt_3: '> 3 stars',
  new_freelancers: 'New Freelancers',
};
