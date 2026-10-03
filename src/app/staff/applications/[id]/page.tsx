import type { Metadata } from "next";
import { ApplicationDetail } from "@/components/staff/application-detail";

export const metadata: Metadata = {
  title: "Application | Staff Admin",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function StaffApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ApplicationDetail id={id} />;
}
