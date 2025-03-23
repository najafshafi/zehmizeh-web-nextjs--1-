declare module "@ckeditor/ckeditor5-react";
declare module "@ckeditor/ckeditor5-build-classic";

interface Window {
  CKEDITOR_TRANSLATIONS?: {
    timestamp?: number;
    [key: string]: any;
  };
}
