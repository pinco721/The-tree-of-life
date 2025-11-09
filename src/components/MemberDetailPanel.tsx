"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FamilyMember } from "@/lib/familyData";
import { Calendar, Edit, Trash2, User, X } from "lucide-react";

interface MemberDetailPanelProps {
  member: FamilyMember | null;
  onClose: () => void;
  onEdit: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
}

export function MemberDetailPanel({
  member,
  onClose,
  onEdit,
  onDelete,
}: MemberDetailPanelProps) {
  if (!member) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light tracking-wide text-white">
            Member Details
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

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-white/20 flex items-center justify-center overflow-hidden">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-20 h-20 text-zinc-400" />
              )}
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h3 className="text-2xl font-light text-white mb-1">
              {member.name}
            </h3>
            <p className="text-sm text-zinc-400 capitalize">{member.gender}</p>
          </div>

          {/* Dates */}
          <Card className="bg-white/5 border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Birth Date</p>
                <p className="text-sm text-white">
                  {formatDate(member.birthDate)}
                </p>
              </div>
            </div>
            {member.deathDate && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-500">Death Date</p>
                  <p className="text-sm text-white">
                    {formatDate(member.deathDate)}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Notes */}
          {member.notes && (
            <Card className="bg-white/5 border-white/10 p-4">
              <p className="text-xs text-zinc-500 mb-2">Notes</p>
              <p className="text-sm text-white/80">{member.notes}</p>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onEdit(member)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => {
                if (
                  confirm(`Are you sure you want to delete ${member.name}?`)
                ) {
                  onDelete(member.id);
                  onClose();
                }
              }}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
