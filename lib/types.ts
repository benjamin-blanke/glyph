export type BadgeStyle = "flat" | "flat-square" | "rounded";
export type BadgeRequest = { label: string; message: string; color: string; labelColor: string; logo: string; style: BadgeStyle };
export type IconDefinition = { path: string; viewBox?: string; color?: string };
