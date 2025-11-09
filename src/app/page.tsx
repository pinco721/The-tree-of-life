"use client";

import { FamilyTreeCanvas } from "@/components/FamilyTreeCanvas";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { Header } from "@/components/Header";
import { MemberDetailPanel } from "@/components/MemberDetailPanel";
import { MemberForm } from "@/components/MemberForm";
import { type FamilyMember, sampleFamilyData } from "@/lib/familyData";
import { useState } from "react";

export default function Home() {
  const [familyData, setFamilyData] = useState(sampleFamilyData);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const member = familyData.members.find((m) =>
      m.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (member) {
      setSelectedMember(member);
    } else {
      alert("No member found with that name");
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleSaveMember = (memberData: Partial<FamilyMember>) => {
    setFamilyData((prev) => {
      const exists = prev.members.find((m) => m.id === memberData.id);

      if (exists) {
        // Update existing member
        return {
          ...prev,
          members: prev.members.map((m) =>
            m.id === memberData.id
              ? ({ ...m, ...memberData } as FamilyMember)
              : m,
          ),
        };
      }
      // Add new member
      return {
        ...prev,
        members: [...prev.members, memberData as FamilyMember],
      };
    });

    setShowForm(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
  };

  return (
    <main className="relative min-h-screen">
      {/* Textured background overlay */}
      <div className="textured-bg" />

      <Header onSearch={handleSearch} onAddMember={handleAddMember} />

      <div className="pt-20 h-screen">
        <FamilyTreeCanvas
          familyData={familyData}
          onSelectMember={setSelectedMember}
          selectedMemberId={selectedMember?.id}
        />
      </div>

      {selectedMember && (
        <MemberDetailPanel
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      )}

      {showForm && (
        <MemberForm
          member={editingMember || undefined}
          allMembers={familyData.members}
          onSave={handleSaveMember}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}
    </main>
  );
}
