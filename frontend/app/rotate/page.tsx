import type { Metadata } from "next";
import RotateForm from "@/components/rotate/RotateForm";

export const metadata: Metadata = {
  title: "Rotate Image",
  description: "Rotate your image left or right, or set a custom angle.",
  alternates: { canonical: "/rotate" },
};

export default function RotatePage() {
  return <RotateForm />;
}
