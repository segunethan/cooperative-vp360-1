import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const CooperativeHeader = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb/Title Section */}
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Home</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-muted-foreground text-sm">Modules</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-muted-foreground text-sm">Cooperative</span>
          <span className="text-muted-foreground">›</span>
          <span className="font-medium">Dashboard</span>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-muted/50"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};