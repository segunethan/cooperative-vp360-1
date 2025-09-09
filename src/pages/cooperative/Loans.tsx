import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, 
  TrendingDown, 
  AlertTriangle, 
  Plus, 
  Download,
  Settings
} from "lucide-react";

const Loans = () => {
  const loanApplications = [
    {
      id: "LA-2024-0156",
      member: "John Doe",
      memberId: "MEM-001",
      amount: "₦500,000",
      purpose: "Business Expansion",
      status: "Pending Review",
      appliedDate: "Jan 05, 2025",
      officer: "Not Assigned",
    },
    {
      id: "LA-2024-0157",
      member: "Sarah Wilson", 
      memberId: "MEM-002",
      amount: "₦200,000",
      purpose: "Education",
      status: "Under Review",
      appliedDate: "Jan 03, 2025",
      officer: "Jane Smith",
    },
    {
      id: "LA-2024-0158",
      member: "Michael Johnson",
      memberId: "MEM-003",
      amount: "₦100,000", 
      purpose: "Emergency",
      status: "Approved",
      appliedDate: "Dec 28, 2024",
      officer: "Jane Smith",
    },
  ];

  const activeLoan = [
    {
      id: "LN-2024-0089",
      member: "Emily Brown",
      memberId: "MEM-004",
      amount: "₦750,000",
      balance: "₦450,000",
      monthlyPayment: "₦62,500",
      nextDue: "Jan 15, 2025",
      status: "Active",
      daysOverdue: 0,
    },
    {
      id: "LN-2024-0078",
      member: "David Wilson",
      memberId: "MEM-005", 
      amount: "₦300,000",
      balance: "₦180,000",
      monthlyPayment: "₦30,000",
      nextDue: "Jan 10, 2025",
      status: "Overdue",
      daysOverdue: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Pending Review":
      case "Under Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Rejected":
      case "Overdue":
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
          <h1 className="text-2xl font-bold text-foreground">Loans Management</h1>
          <p className="text-muted-foreground">Manage loan products, applications, and portfolio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Loan Products
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Portfolio Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">₦28.7M</p>
                <p className="text-xs text-muted-foreground">Outstanding loans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Repayment Rate</p>
                <p className="text-2xl font-bold">97.7%</p>
                <p className="text-xs text-muted-foreground">On-time payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">NPL Ratio</p>
                <p className="text-2xl font-bold">2.3%</p>
                <p className="text-xs text-muted-foreground">Non-performing loans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loans Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="active">Active Loans</TabsTrigger>
              <TabsTrigger value="products">Loan Products</TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Loan Applications</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Application
                  </Button>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Assigned Officer</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{application.member}</p>
                              <p className="text-sm text-muted-foreground">{application.memberId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{application.amount}</TableCell>
                          <TableCell>{application.purpose}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{application.appliedDate}</TableCell>
                          <TableCell>{application.officer}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                Review
                              </Button>
                              {application.status === "Pending Review" && (
                                <Button variant="ghost" size="sm">
                                  Assign
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Active Loans</h3>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Original Amount</TableHead>
                        <TableHead>Outstanding Balance</TableHead>
                        <TableHead>Monthly Payment</TableHead>
                        <TableHead>Next Due</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeLoan.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{loan.member}</p>
                              <p className="text-sm text-muted-foreground">{loan.memberId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{loan.amount}</TableCell>
                          <TableCell className="font-medium">{loan.balance}</TableCell>
                          <TableCell>{loan.monthlyPayment}</TableCell>
                          <TableCell>
                            <div>
                              <p>{loan.nextDue}</p>
                              {loan.daysOverdue > 0 && (
                                <p className="text-xs text-destructive">
                                  {loan.daysOverdue} days overdue
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(loan.status)}>
                              {loan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Payment
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Loan Products</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Personal Loan</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Interest Rate:</span> 12% per annum</p>
                        <p><span className="text-muted-foreground">Max Amount:</span> ₦1,000,000</p>
                        <p><span className="text-muted-foreground">Max Term:</span> 24 months</p>
                        <p><span className="text-muted-foreground">Processing Fee:</span> 2%</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Emergency Loan</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Interest Rate:</span> 8% per annum</p>
                        <p><span className="text-muted-foreground">Max Amount:</span> ₦500,000</p>
                        <p><span className="text-muted-foreground">Max Term:</span> 12 months</p>
                        <p><span className="text-muted-foreground">Processing Fee:</span> 1%</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Business Loan</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Interest Rate:</span> 15% per annum</p>
                        <p><span className="text-muted-foreground">Max Amount:</span> ₦2,000,000</p>
                        <p><span className="text-muted-foreground">Max Term:</span> 36 months</p>
                        <p><span className="text-muted-foreground">Processing Fee:</span> 3%</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loans;