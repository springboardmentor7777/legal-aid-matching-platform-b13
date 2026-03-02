// src/api/caseService.ts
import API from "./axios";

export type CaseStatus = "SUBMITTED" | "IN_REVIEW" | "MATCHED";

export interface CitizenCase {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: CaseStatus;
  lawyer?: {
    name: string;
    email: string;
  };
}

export const getCitizenCases = async (): Promise<CitizenCase[]> => {
  const response = await API.get<CitizenCase[]>("/cases/my");
  return response.data;
};