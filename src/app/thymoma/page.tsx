import type { Metadata } from "next";
import { DiseaseModule } from "@/components/disease/disease-module";
import { thymicModule } from "@/content/modules/thymic";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Thymic epithelial tumours",
  description: "Thymoma and thymic carcinoma module: WHO classification, IHC, Masaoka–Koga and TNM staging, surgery, radiotherapy and systemic therapy.",
};

export default function ThymomaPage() {
  return <DiseaseModule content={thymicModule} />;
}
