"use client";

import { Sidebar, SidebarNavItem, SidebarBrand } from "@/components/sidebar/Sidebar";
import { SidebarContent } from "@/components/sidebar/SidebarContent";
import { SidebarLink } from "@/components/sidebar/SidebarLink";
import { SidebarNavItemView as SidebarNavItemComponent } from "@/components/sidebar/SidebarNavItem";

type AppSidebarProps = {
  brand: SidebarBrand;
  items: SidebarNavItem[];
  activeHref?: string;
  user?: {
    name: string;
    role: string;
    avatar?: React.ReactNode;
  };
  mobileFooter?: React.ReactNode;
};

export function AppSidebar({
  brand,
  items,
  activeHref,
  user,
  mobileFooter,
}: AppSidebarProps) {
  return (
    <Sidebar
      brand={brand}
      items={items}
      activeHref={activeHref}
      user={user}
      mobileFooter={mobileFooter}
    />
  );
}

export { SidebarContent, SidebarLink, SidebarNavItemComponent };
