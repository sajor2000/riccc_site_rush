import type { Metadata } from "next";
import { ApplicationList } from "@/components/staff/application-list";

export const metadata: Metadata = {
  title: "Internship applications | Staff Admin",
};

export default function StaffApplicationsPage() {
  return <ApplicationList />;
}
