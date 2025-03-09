export interface IPortFolio {
  portfolio_id: number;
  _user_id: string;
  project_name: string;
  image_urls: string[];
  status: string;
  date_created: string;
  date_modified: string;
  is_deleted: number;
  project_year: string;
  project_description: string;
  project_skills: string;
}
