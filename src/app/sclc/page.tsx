import type { Metadata } from "next";
import { DiseaseModule } from "@/components/disease/disease-module";
import { sclcModule } from "@/content/modules/sclc";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Small cell lung cancer",
  description: "SCLC disease module: biology, staging, limited- and extensive-stage management, DLL3-directed therapy and paraneoplastic syndromes.",
};

export default function SclcPage() {
  return <DiseaseModule content={sclcModule} />;
}
