import type { Icon } from "@tabler/icons-react";

export type NavType = {
  id: string | number;
  title: string;
  url?: string;
  icon?: Icon;
  isActive?: boolean;
  onClick?: () => void;
  description: string;
}[];
