import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { FileText, History, Settings, LogOut, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavigationProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Navigation({ user, setUser }: NavigationProps) {
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <div className="flex items-center space-x-2 cursor-pointer" data-testid="link-dashboard">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <FileText className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold gradient-text">DocuChat AI</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard">
              <button 
                className={`text-sm transition-colors ${location === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="link-dashboard-nav"
              >
                Dashboard
              </button>
            </Link>
            <Link href="/history">
              <button 
                className={`text-sm transition-colors ${location === "/history" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="link-history-nav"
              >
                History
              </button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="glass-effect p-3 rounded-lg hover-glow transition-all md:hidden" data-testid="button-mobile-menu">
              <History className="text-muted-foreground h-4 w-4" />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-effect border-border" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm" data-testid="text-user-email">{user.email}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      Premium Account
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-logout" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
