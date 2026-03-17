import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MemberStatsCards from "@/components/cooperative/members/MemberStatsCards";
import MemberDirectory, { Member } from "@/components/cooperative/members/MemberDirectory";
import AddMemberDialog from "@/components/cooperative/members/AddMemberDialog";
import KYCVerificationDialog from "@/components/cooperative/members/KYCVerificationDialog";

const initialMembers: Member[] = [
  { id: "MEM-001", name: "John Doe", email: "john.doe@email.com", phone: "+234 801 234 5678", status: "Active", contributionBalance: "₦250,000", shareBalance: "₦180,000", loanBalance: "₦50,000", joinDate: "Jan 15, 2023", kycVerified: true },
  { id: "MEM-002", name: "Sarah Wilson", email: "sarah.wilson@email.com", phone: "+234 802 345 6789", status: "Active", contributionBalance: "₦180,000", shareBalance: "₦120,000", loanBalance: "₦0", joinDate: "Mar 10, 2023", kycVerified: true },
  { id: "MEM-003", name: "Michael Johnson", email: "michael.j@email.com", phone: "+234 803 456 7890", status: "Pending", contributionBalance: "₦0", shareBalance: "₦0", loanBalance: "₦0", joinDate: "Jan 08, 2025", kycVerified: false },
  { id: "MEM-004", name: "Emily Brown", email: "emily.brown@email.com", phone: "+234 804 567 8901", status: "Active", contributionBalance: "₦320,000", shareBalance: "₦280,000", loanBalance: "₦75,000", joinDate: "Sep 22, 2022", kycVerified: true },
  { id: "MEM-005", name: "David Okoro", email: "david.okoro@email.com", phone: "+234 805 678 9012", status: "Active", contributionBalance: "₦410,000", shareBalance: "₦350,000", loanBalance: "₦0", joinDate: "Feb 14, 2022", kycVerified: true },
  { id: "MEM-006", name: "Grace Adeola", email: "grace.adeola@email.com", phone: "+234 806 789 0123", status: "Suspended", contributionBalance: "₦95,000", shareBalance: "₦60,000", loanBalance: "₦120,000", joinDate: "Jul 03, 2023", kycVerified: true },
  { id: "MEM-007", name: "Chinedu Obi", email: "chinedu.obi@email.com", phone: "+234 807 890 1234", status: "Active", contributionBalance: "₦560,000", shareBalance: "₦500,000", loanBalance: "₦0", joinDate: "Apr 18, 2021", kycVerified: true },
  { id: "MEM-008", name: "Fatima Bello", email: "fatima.bello@email.com", phone: "+234 808 901 2345", status: "Pending", contributionBalance: "₦0", shareBalance: "₦0", loanBalance: "₦0", joinDate: "Mar 02, 2025", kycVerified: false },
  { id: "MEM-009", name: "Tunde Bakare", email: "tunde.b@email.com", phone: "+234 809 012 3456", status: "Exited", contributionBalance: "₦0", shareBalance: "₦0", loanBalance: "₦0", joinDate: "Jun 11, 2020", kycVerified: true },
];

const Members = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState(initialMembers);
  const [addOpen, setAddOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [kycMember, setKycMember] = useState({ name: "", id: "" });

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "Active").length,
    pending: members.filter((m) => m.status === "Pending").length,
    exited: members.filter((m) => m.status === "Exited").length,
  };

  const handleApprove = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: "Active" } : m)));
    toast({ title: "Member Approved", description: `${id} has been approved.` });
  };

  const handleSuspend = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: "Suspended" } : m)));
    toast({ title: "Member Suspended", description: `${id} has been suspended.` });
  };

  const handleExit = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: "Exited" } : m)));
    toast({ title: "Member Exited", description: `${id} has been exited from the cooperative.` });
  };

  const handleEdit = (id: string) => {
    toast({ title: "Edit Member", description: `Opening editor for ${id}...` });
  };

  const handleVerifyKYC = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      setKycMember({ name: member.name, id: member.id });
      setKycOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground">Manage your cooperative members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <MemberStatsCards stats={stats} />

      {/* Directory */}
      <MemberDirectory
        members={members}
        onApprove={handleApprove}
        onSuspend={handleSuspend}
        onExit={handleExit}
        onEdit={handleEdit}
        onVerifyKYC={handleVerifyKYC}
      />

      {/* Dialogs */}
      <AddMemberDialog open={addOpen} onOpenChange={setAddOpen} />
      <KYCVerificationDialog open={kycOpen} onOpenChange={setKycOpen} memberName={kycMember.name} memberId={kycMember.id} />
    </div>
  );
};

export default Members;
