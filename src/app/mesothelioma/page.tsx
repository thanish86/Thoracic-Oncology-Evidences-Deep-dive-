import type { Metadata } from "next";
import { DiseaseModule } from "@/components/disease/disease-module";
import { mesotheliomaModule } from "@/content/modules/mesothelioma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Mesothelioma",
  description: "Pleural and peritoneal mesothelioma module: exposures, BAP1, pathology, staging, surgery, systemic therapy, CRS/HIPEC and palliation.",
};

export default function MesotheliomaPage() {
  return <DiseaseModule content={mesotheliomaModule} />;
}
