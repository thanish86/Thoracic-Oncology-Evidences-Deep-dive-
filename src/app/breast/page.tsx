import type { Metadata } from "next";
import { DiseaseModule } from "@/components/disease/disease-module";
import { breastModule } from "@/content/modules/breast";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Breast cancer",
  description: "Breast cancer disease module: biomarkers, early and metastatic management by subtype, with linked source-verified trials.",
};

export default function BreastPage() {
  return <DiseaseModule content={breastModule} />;
}
