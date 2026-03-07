"use client";

import GridlyLogo from "@/components/gridly-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { appConfig, authConfig, dashboardConfig } from "@/config";
import { signOut, useSession } from "@/lib/auth-client";
import {
  ChevronsUpDown,
  LogOutIcon,
  Moon,
  SettingsIcon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const { setTheme, resolvedTheme } = useTheme();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    router.push(authConfig.auth.redirectAfterSignOut);
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-dashed py-3 min-h-14 flex-row items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:min-h-14">
        <Link
          href="/"
          className="flex items-center gap-3 group px-2 group-data-[collapsible=icon]:px-0! group-data-[collapsible=icon]:justify-center"
          prefetch
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GridlyLogo size={20} />
          </div>
          <span
            className="font-doto text-lg leading-none uppercase tracking-[0.15em] font-bold group-hover:text-primary transition-colors
           group-data-[collapsible=icon]:hidden"
          >
            {appConfig.name}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {dashboardConfig.nav.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="text-muted-foreground"
                >
                  <Link href={item.url} prefetch>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {session?.user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground  hover:text-primary transition-colors border-2"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name ?? "User"}
                      />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                        {(session.user.name ?? "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "top"}
                  align="end"
                  sideOffset={4}
                  alignOffset={-4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.image || ""} alt={user?.name} />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                          {user?.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name ?? "User"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email ?? ""}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                      }
                      className="cursor-pointer"
                    >
                      {resolvedTheme === "dark" ? (
                        <Sun className="mr-2 size-4" />
                      ) : (
                        <Moon className="mr-2 size-4" />
                      )}
                      Toggle Theme
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  >
                    <LogOutIcon className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <Skeleton className="h-14" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
