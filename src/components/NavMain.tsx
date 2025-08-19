import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router";

export function NavMain() {
  const { navMain, navMainActive } =
    useStore();
  const navigate = useNavigate();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => {
                  navigate(item.url!);
                }}
                className={`
                ${
                  item.id === navMainActive
                    ? "bg-primary active:bg-primary/90 active:text-primary-foreground text-primary-foreground"
                    : ""
                }
                hover:bg-primary/90
                hover:text-primary-foreground
                min-w-8 
                duration-200 
                ease-linear
                `}
                tooltip={item.title}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
