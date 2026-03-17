import { useParams, useNavigate } from "react-router-dom";
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
  ArrowLeft,
  User,
  CreditCard,
  Landmark,
  Megaphone,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
} from "lucide-react";

// Mock data for profile
const memberData: Record<string, any> = {
  "MEM-001": {
    id: "MEM-001", name: "John Doe", email: "john.doe@email.com", phone: "+234 801 234 5678",
    status: "Active", kycVerified: true, bvn: "2234****901", nin: "1234****890",
    gender: "Male", dob: "1985-06-15", address: "12 Marina Rd, Lagos", occupation: "Software Engineer",
    employer: "TechCorp Ltd", joinDate: "Jan 15, 2023", nextOfKin: "Jane Doe (+234 800 000 0000)",
    contributions: [
      { date: "Mar 01, 2025", amount: "₦25,000", channel: "Bank Transfer", status: "Confirmed" },
      { date: "Feb 01, 2025", amount: "₦25,000", channel: "Bank Transfer", status: "Confirmed" },
      { date: "Jan 01, 2025", amount: "₦25,000", channel: "Debit Card", status: "Confirmed" },
      { date: "Dec 01, 2024", amount: "₦25,000", channel: "Bank Transfer", status: "Confirmed" },
    ],
    shareBalance: "₦180,000", contributionBalance: "₦250,000", loanBalance: "₦50,000",
    loans: [
      { id: "LN-001", amount: "₦100,000", status: "Repaying", disbursed: "Nov 10, 2024", balance: "₦50,000" },
    ],
    dividends: [
      { year: "2024", amount: "₦12,500", status: "Paid", date: "Jan 15, 2025" },
      { year: "2023", amount: "₦8,200", status: "Paid", date: "Jan 20, 2024" },
    ],
    communications: [
      { date: "Mar 10, 2025", subject: "AGM Notice 2025", channel: "Email", status: "Delivered" },
      { date: "Feb 14, 2025", subject: "Loan Repayment Reminder", channel: "SMS", status: "Delivered" },
      { date: "Jan 01, 2025", subject: "Happy New Year", channel: "Portal", status: "Read" },
    ],
  },
};

// Fallback for other IDs
const getProfile = (id: string) =>
  memberData[id] || {
    ...memberData["MEM-001"],
    id,
    name: `Member ${id}`,
  };

const MemberProfile = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const member = getProfile(memberId || "MEM-001");

  return (
    <div className="space-y-6">
      {/* Back & Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cooperative/members")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
          <p className="text-muted-foreground">{member.id} · Joined {member.joinDate}</p>
        </div>
        <Badge
          variant="outline"
          className={
            member.status === "Active"
              ? "bg-success/10 text-success border-success/20"
              : "bg-warning/10 text-warning border-warning/20"
          }
        >
          {member.status}
        </Badge>
        {member.kycVerified && (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <ShieldCheck className="h-3 w-3 mr-1" />
            KYC Verified
          </Badge>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><CreditCard className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold text-foreground">{member.contributionBalance}</p>
              <p className="text-xs text-muted-foreground">Total Contributions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success"><Landmark className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold text-foreground">{member.shareBalance}</p>
              <p className="text-xs text-muted-foreground">Share Balance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning"><CreditCard className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold text-foreground">{member.loanBalance}</p>
              <p className="text-xs text-muted-foreground">Loan Balance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal"><User className="h-4 w-4 mr-1" /> Personal Info</TabsTrigger>
          <TabsTrigger value="contributions"><CreditCard className="h-4 w-4 mr-1" /> Contributions</TabsTrigger>
          <TabsTrigger value="loans"><Landmark className="h-4 w-4 mr-1" /> Loans</TabsTrigger>
          <TabsTrigger value="dividends"><CreditCard className="h-4 w-4 mr-1" /> Dividends</TabsTrigger>
          <TabsTrigger value="communications"><Megaphone className="h-4 w-4 mr-1" /> Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Mail, label: "Email", value: member.email },
                  { icon: Phone, label: "Phone", value: member.phone },
                  { icon: User, label: "Gender", value: member.gender },
                  { icon: Calendar, label: "Date of Birth", value: member.dob },
                  { icon: MapPin, label: "Address", value: member.address },
                  { icon: Briefcase, label: "Occupation", value: member.occupation },
                  { icon: Briefcase, label: "Employer", value: member.employer },
                  { icon: User, label: "Next of Kin", value: member.nextOfKin },
                  { icon: ShieldCheck, label: "BVN", value: member.bvn },
                  { icon: ShieldCheck, label: "NIN", value: member.nin },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions">
          <Card>
            <CardHeader><CardTitle>Contribution History</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.contributions.map((c: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{c.date}</TableCell>
                        <TableCell className="font-medium">{c.amount}</TableCell>
                        <TableCell>{c.channel}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">{c.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader><CardTitle>Loan History</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Disbursed</TableHead>
                      <TableHead>Outstanding</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.loans.map((l: any) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-mono text-xs">{l.id}</TableCell>
                        <TableCell className="font-medium">{l.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{l.status}</Badge>
                        </TableCell>
                        <TableCell>{l.disbursed}</TableCell>
                        <TableCell className="font-medium">{l.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dividends">
          <Card>
            <CardHeader><CardTitle>Dividend Payouts</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.dividends.map((d: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{d.year}</TableCell>
                        <TableCell className="font-medium">{d.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">{d.status}</Badge>
                        </TableCell>
                        <TableCell>{d.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <Card>
            <CardHeader><CardTitle>Communication Log</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.communications.map((c: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{c.date}</TableCell>
                        <TableCell className="font-medium">{c.subject}</TableCell>
                        <TableCell>{c.channel}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">{c.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberProfile;
