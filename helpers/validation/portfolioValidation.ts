import { object, string } from "yup";

export const portfolioValidation = object({
  project_name: string().required("Album name is required"),
  project_year: string()
    .test({
      message: "Please enter a valid value for Project year.",
      test: (value?: string) => !value || value === "" || !!Number(value),
    })
    .test({
      message: "Project year cannot be in the future.",
      test: (value?: string) => {
        if (!value || value === "") return true;
        return Number(value.toString().slice(0, 4)) <= new Date().getFullYear();
      },
    })
    .test({
      message: "Invalid project year entered.",
      test: (value?: string) => {
        if (!value || value === "") return true;
        return Number(value.toString().slice(0, 4)) > 1900;
      },
    }),
  project_description: string(),
});
