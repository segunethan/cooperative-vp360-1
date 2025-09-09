import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  PiggyBank, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Download,
  Filter
} from "lucide-react";

const Contributions = () => {
  const contributions = [
    {
      date: "Jan 08, 2025",
      member: "John Doe",
      memberId: "MEM-001",
      amount: "₦25,000",
      channel: "Bank Transfer",
      status: "Completed",
      reference: "TXN-20250108-001",
    },
    {
      date: "Jan 07, 2025", 
      member: "Sarah Wilson",
      memberId: "MEM-002",
      amount: "₦15,000",
      channel: "Mobile Money",
      status: "Completed", 
      reference: "TXN-20250107-002",
    },
    {
      date: "Jan 06, 2025",
      member: "Emily Brown", 
      memberId: "MEM-004",
      amount: "₦30,000",
      channel: "Cash Deposit",
      status: "Pending",
      reference: "TXN-20250106-003",
    },
    {
      date: "Jan 05, 2025",
      member: "Michael Johnson",
      memberId: "MEM-003", 
      amount: "₦20,000",
      channel: "Bank Transfer",
      status: "Failed",
      reference: "TXN-20250105-004",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "Failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contributions & Shares</h1>
          <p className="text-muted-foreground">Track member contributions and shareholding</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Record Contribution
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contributions</p>
                <p className="text-2xl font-bold">₦45.2M</p>
                <p className="text-xs text-muted-foreground">Year to Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                <p className="text-2xl font-bold">+8.5%</p>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₦3.8M</p>
                <p className="text-xs text-muted-foreground">January 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contributions Ledger */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contribution Ledger</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((contribution, index) => (
                  <TableRow key={index}>
                    <TableCell>{contribution.date}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contribution.member}</p>
                        <p className="text-sm text-muted-foreground">{contribution.memberId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{contribution.amount}</TableCell>
                    <TableCell>{contribution.channel}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(contribution.status)}>
                        {contribution.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contribution.reference}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {contribution.status === "Pending" && (
                          <Button variant="ghost" size="sm">
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 4 of 247 contributions
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contributions;