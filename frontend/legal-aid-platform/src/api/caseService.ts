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

// export const getCitizenCases = async (): Promise<CitizenCase[]> => {
//   // // const response = await API.get<CitizenCase[]>("http://localhost:8081/cases/my");
//   // const response = await fetch("http://localhost:8081/cases/my",{
//   //   method:"GET",
//   //   headers:{
//   //     "Content-Type": "application/json",
//   //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`
//   //   },
//   // });
//   // return response;
// };