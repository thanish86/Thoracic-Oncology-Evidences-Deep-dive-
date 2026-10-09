import type { Metadata } from "next";
import { DiseaseModule } from "@/components/disease/disease-module";
import { nsclcModule } from "@/content/modules/nsclc";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Non-small cell lung cancer",
  description: "NSCLC disease module: screening, staging, perioperative therapy, stage III, metastatic driver-negative and driver-positive disease, with linked trials.",
};

export default function NsclcPage() {
  return <DiseaseModule content={nsclcModule} />;
}
