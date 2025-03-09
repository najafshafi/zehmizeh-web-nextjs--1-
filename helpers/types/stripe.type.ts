export type TStripeStatus =
  | 'pending'
  | 'currently_due'
  | 'pending_verification'
  | 'bank_account_pending'
  | 'verified';

export interface IStripeObject {
  id: string;
  object: string;
  business_profile: BusinessProfile;
  business_type: string;
  capabilities: Capabilities;
  charges_enabled: boolean;
  company: Company;
  country: string;
  created: number;
  default_currency: string;
  details_submitted: boolean;
  email: string;
  external_accounts: ExternalAccounts;
  future_requirements: FutureRequirements2;
  individual: Individual;
  metadata: Metadata3;
  payouts_enabled: boolean;
  requirements: Requirements3;
  settings: Settings;
  tos_acceptance: TosAcceptance2;
  type: string;
  balance: Balance;
}

interface BusinessProfile {
  annual_revenue: any;
  estimated_worker_count: any;
  mcc: string;
  name: any;
  product_description: any;
  support_address: any;
  support_email: any;
  support_phone: any;
  support_url: any;
  url: string;
}

interface Capabilities {
  transfers: string;
}

interface Company {
  address: Address;
  directors_provided: boolean;
  executives_provided: boolean;
  name: any;
  owners_provided: boolean;
  phone: any;
  tax_id_provided: boolean;
  verification: Verification;
}

interface Address {
  city: any;
  country: string;
  line1: any;
  line2: any;
  postal_code: any;
  state: any;
}

interface Verification {
  document: Document;
}

interface Document {
  back: any;
  details: any;
  details_code: any;
  front: any;
}

interface ExternalAccounts {
  object: string;
  data: Daum[];
  has_more: boolean;
  total_count: number;
  url: string;
}

interface Daum {
  id: string;
  object: string;
  account: string;
  account_holder_name: string;
  account_holder_type: string;
  account_type: any;
  available_payout_methods: string[];
  bank_name: string;
  country: string;
  currency: string;
  default_for_currency: boolean;
  fingerprint: string;
  future_requirements: FutureRequirements;
  last4: string;
  metadata: Metadata;
  requirements: Requirements;
  routing_number: string;
  status: string;
}

interface FutureRequirements {
  currently_due: any[];
  errors: any[];
  past_due: any[];
  pending_verification: any[];
}

interface Metadata {}

interface Requirements {
  currently_due: any[];
  errors: any[];
  past_due: any[];
  pending_verification: any[];
}

interface FutureRequirements2 {
  alternatives: any[];
  current_deadline: any;
  currently_due: any[];
  disabled_reason: any;
  errors: any[];
  eventually_due: any[];
  past_due: any[];
  pending_verification: any[];
}

interface Individual {
  id: string;
  object: string;
  account: string;
  address: Address2;
  created: number;
  dob: Dob;
  email: string;
  first_name: string;
  future_requirements: FutureRequirements3;
  last_name: string;
  metadata: Metadata2;
  phone: any;
  relationship: Relationship;
  requirements: Requirements2;
  verification: Verification2;
}

interface Address2 {
  city: any;
  country: string;
  line1: any;
  line2: any;
  postal_code: any;
  state: any;
}

interface Dob {
  day: number;
  month: number;
  year: number;
}

interface FutureRequirements3 {
  alternatives: any[];
  currently_due: any[];
  errors: any[];
  eventually_due: any[];
  past_due: any[];
  pending_verification: any[];
}

interface Metadata2 {}

interface Relationship {
  director: boolean;
  executive: boolean;
  legal_guardian: boolean;
  owner: boolean;
  percent_ownership: any;
  representative: boolean;
  title: any;
}

interface Requirements2 {
  alternatives: any[];
  currently_due: any[];
  errors: any[];
  eventually_due: any[];
  past_due: any[];
  pending_verification: any[];
}

interface Verification2 {
  additional_document: AdditionalDocument;
  details: any;
  details_code: any;
  document: Document2;
  status: string;
}

interface AdditionalDocument {
  back: any;
  details: any;
  details_code: any;
  front: any;
}

interface Document2 {
  back: any;
  details: any;
  details_code: any;
  front: string;
}

interface Metadata3 {}

interface Requirements3 {
  alternatives: any[];
  current_deadline: any;
  currently_due: any[];
  disabled_reason: any;
  errors: any[];
  eventually_due: any[];
  past_due: any[];
  pending_verification: any[];
}

interface Settings {
  bacs_debit_payments: BacsDebitPayments;
  branding: Branding;
  card_issuing: CardIssuing;
  card_payments: CardPayments;
  dashboard: Dashboard;
  invoices: Invoices;
  payments: Payments;
  payouts: Payouts;
  sepa_debit_payments: SepaDebitPayments;
}

interface BacsDebitPayments {
  display_name: any;
  service_user_number: any;
}

interface Branding {
  icon: any;
  logo: any;
  primary_color: any;
  secondary_color: any;
}

interface CardIssuing {
  tos_acceptance: TosAcceptance;
}

interface TosAcceptance {
  date: any;
  ip: any;
}

interface CardPayments {
  decline_on: DeclineOn;
  statement_descriptor_prefix: any;
  statement_descriptor_prefix_kana: any;
  statement_descriptor_prefix_kanji: any;
}

interface DeclineOn {
  avs_failure: boolean;
  cvc_failure: boolean;
}

interface Dashboard {
  display_name: string;
  timezone: string;
}

interface Invoices {
  default_account_tax_ids: any;
}

interface Payments {
  statement_descriptor: string;
  statement_descriptor_kana: any;
  statement_descriptor_kanji: any;
}

interface Payouts {
  debit_negative_balances: boolean;
  schedule: Schedule;
  statement_descriptor: any;
}

interface Schedule {
  delay_days: number;
  interval: string;
}

interface SepaDebitPayments {}

interface TosAcceptance2 {
  date: number;
  ip: string;
  service_agreement: string;
  user_agent: any;
}

interface Balance {
  object: string;
  available: Available[];
  connect_reserved: ConnectReserved[];
  instant_available: InstantAvailable[];
  livemode: boolean;
  pending: Pending[];
}

interface Available {
  amount: number;
  currency: string;
  source_types: SourceTypes;
}

interface SourceTypes {
  bank_account: number;
  card: number;
}

interface ConnectReserved {
  amount: number;
  currency: string;
}

interface InstantAvailable {
  amount: number;
  currency: string;
  source_types: SourceTypes2;
}

interface SourceTypes2 {
  bank_account: number;
  card: number;
}

interface Pending {
  amount: number;
  currency: string;
  source_types: SourceTypes3;
}

interface SourceTypes3 {
  bank_account: number;
  card: number;
}
