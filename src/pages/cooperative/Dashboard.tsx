import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  PiggyBank, 
  CreditCard, 
  DollarSign, 
  UserPlus, 
  TrendingUp, 
  AlertTriangle,
  Calendar
} from "lucide-react";
import { MetricCard } from "@/components/cooperative/MetricCard";
import { ActivityFeed } from "@/components/cooperative/ActivityFeed";
import { QuickActions } from "@/components/cooperative/QuickActions";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Members",
      value: "1,247",
      subtitle: "Active: 1,205 • Pending: 25 • Exited: 17",
      icon: Users,
      trend: "+12%",
      trendDirection: "up" as const,
    },
    {
      title: "Contributions Collected",
      value: "₦45.2M",
      subtitle: "YTD: ₦45.2M • MTD: ₦3.8M",
      icon: PiggyBank,
      trend: "+8.5%",
      trendDirection: "up" as const,
    },
    {
      title: "Loans Outstanding",
      value: "₦28.7M",
      subtitle: "Active: ₦28.7M • Delinquent: 2.3%",
      icon: CreditCard,
      trend: "-1.2%",
      trendDirection: "down" as const,
    },
    {
      title: "Dividends Paid",
      value: "₦12.5M",
      subtitle: "Last: Dec 2024 • Next: Jun 2025",
      icon: DollarSign,
      trend: "+15%",
      trendDirection: "up" as const,
    },
  ];

  const recentActivities = [
    {
      type: "contribution",
      message: "John Doe contributed ₦50,000",
      time: "2 hours ago",
      status: "completed" as const,
    },
    {
      type: "loan",
      message: "Loan application #LA-2024-0156 pending approval",
      time: "4 hours ago",
      status: "pending" as const,
    },
    {
      type: "member",
      message: "New member Sarah Wilson registered",
      time: "6 hours ago",
      status: "completed" as const,
    },
    {
      type: "announcement",
      message: "AGM Notice posted to all members",
      time: "1 day ago",
      status: "completed" as const,
    },
    {
      type: "dividend",
      message: "Dividend calculation completed for Q4 2024",
      time: "2 days ago",
      status: "completed" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cooperative Dashboard</h1>
          <p className="text-muted-foreground">Overview of your cooperative's performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-success border-success">
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivities} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Pending Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div>
                <p className="font-medium">Loan Applications</p>
                <p className="text-sm text-muted-foreground">8 applications awaiting review</p>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div>
                <p className="font-medium">Member Approvals</p>
                <p className="text-sm text-muted-foreground">25 members pending approval</p>
              </div>
              <Button variant="outline" size="sm">
                Approve
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
              <div>
                <p className="font-medium">Monthly Reports</p>
                <p className="text-sm text-muted-foreground">Due in 5 days</p>
              </div>
              <Button variant="outline" size="sm">
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Annual General Meeting</p>
                <Badge variant="outline">15 Feb</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Annual financial review and board elections</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Dividend Payout</p>
                <Badge variant="outline">30 Jun</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Q1 2025 dividend distribution</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Loan Committee Meeting</p>
                <Badge variant="outline">28 Jan</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Review pending loan applications</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;