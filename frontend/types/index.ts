export type ResizeMode = "size" | "percent" | "social";
export type ExportFormat = "original" | "jpg" | "png" | "webp";
export type SizeUnit = "KB" | "MB";

export type SocialPresetTuple = [label: string, width: number, height: number];

export interface ResizeDefaults {
  mode: ResizeMode;
  width: number;
  height: number;
  percent: number;
  lock_aspect: boolean;
  target_size: string;
  target_unit: SizeUnit;
  export_format: ExportFormat;
}

export interface AppConfig {
  social_presets: SocialPresetTuple[];
  defaults: ResizeDefaults;
}

export interface User {
  name: string;
  email: string;
}

export interface OriginalImageInfo {
  w: number;
  h: number;
  size: number;
  ext: string;
}
