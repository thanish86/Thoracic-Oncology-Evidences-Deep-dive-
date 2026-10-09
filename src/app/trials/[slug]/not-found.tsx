import Link from "next/link";
import { EmptyState, Button } from "@/components/ui/primitives";

export default function TrialNotFound() {
  return (
    <EmptyState title="Trial not found" action={<Button asChild><Link href="/trials">Back to trial explorer</Link></Button>}>
      This trial is not in the ONCOATLAS database yet. Records are added only after source retrieval and structured extraction.
    </EmptyState>
  );
}
