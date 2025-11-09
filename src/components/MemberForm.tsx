"use client";

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
import { Textarea } from "@/components/ui/textarea";
import type { FamilyMember } from "@/lib/familyData";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface MemberFormProps {
  member?: FamilyMember;
  allMembers: FamilyMember[];
  onSave: (member: Partial<FamilyMember>) => void;
  onClose: () => void;
}

export function MemberForm({
  member,
  allMembers,
  onSave,
  onClose,
}: MemberFormProps) {
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: "",
    birthDate: "",
    deathDate: "",
    gender: "male",
    photo: "",
    notes: "",
    parents: [],
    spouses: [],
  });

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert("Name is required");
      return;
    }
    onSave({
      ...formData,
      id: member?.id || `${Date.now()}`,
    });
  };

  const updateField = (
    field: keyof FamilyMember,
    value: string | string[] | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const availableParents = allMembers.filter((m) => m.id !== member?.id);
  const availableSpouses = allMembers.filter((m) => m.id !== member?.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-light text-white">
            {member ? "Edit Member" : "Add New Member"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-white">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-white">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  updateField("gender", value as "male" | "female" | "other")
                }
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="photo" className="text-white">
                Photo URL
              </Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo || ""}
                onChange={(e) => updateField("photo", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="birthDate" className="text-white">
                Birth Date
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate || ""}
                onChange={(e) => updateField("birthDate", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="deathDate" className="text-white">
                Death Date
              </Label>
              <Input
                id="deathDate"
                type="date"
                value={formData.deathDate || ""}
                onChange={(e) => updateField("deathDate", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes" className="text-white">
                Notes
              </Label>
              <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="bg-white/5 border-white/20 text-white min-h-[100px]"
                  placeholder="Add any notes about this person..."
                />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              {member ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
