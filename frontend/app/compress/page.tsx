import type { Metadata } from "next";
import CompressForm from "@/components/compress/CompressForm";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Reduce image file size without losing much quality. Free and instant.",
  alternates: { canonical: "/compress" },
};

export default function CompressPage() {
  return <CompressForm />;
}
