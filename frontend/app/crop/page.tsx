import type { Metadata } from "next";
import CropForm from "@/components/crop/CropForm";

export const metadata: Metadata = {
  title: "Crop Image",
  description: "Drag on the image to select an area, then crop and download.",
  alternates: { canonical: "/crop" },
};

export default function CropPage() {
  return <CropForm />;
}
