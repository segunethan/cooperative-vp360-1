import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMemberDialog = ({ open, onOpenChange }: AddMemberDialogProps) => {
  const { toast } = useToast();
  const [tab, setTab] = useState("manual");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Member Added", description: "New member has been registered successfully." });
    onOpenChange(false);
  };

  const handleBulkImport = () => {
    toast({ title: "Bulk Import", description: "CSV file uploaded. Processing 0 records..." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Member
          </DialogTitle>
          <DialogDescription>Register a new cooperative member or bulk import from CSV.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+234 801 234 5678" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bvn">BVN</Label>
                  <Input id="bvn" placeholder="12345678901" maxLength={11} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nin">NIN</Label>
                  <Input id="nin" placeholder="12345678901" maxLength={11} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Residential Address</Label>
                <Textarea id="address" placeholder="Enter full address" rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input id="employer" placeholder="Company name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextOfKin">Next of Kin</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="nextOfKin" placeholder="Full name" />
                  <Input placeholder="Phone number" />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Member</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <div className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag & drop your CSV file here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or click to browse. Max 5MB, CSV format only.
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">CSV Template Columns:</p>
                <p className="text-xs text-muted-foreground">
                  First Name, Last Name, Email, Phone, BVN, NIN, Gender, Date of Birth, Address, Occupation, Employer
                </p>
                <Button variant="link" size="sm" className="px-0 mt-1 text-primary">
                  Download CSV Template
                </Button>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Members
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
