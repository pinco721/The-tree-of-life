"use client";

import type { FamilyMember } from "@/lib/familyData";
import { User } from "lucide-react";

interface FamilyTreeNodeProps {
  member: FamilyMember;
  onClick: () => void;
  isSelected?: boolean;
}

export function FamilyTreeNode({
  member,
  onClick,
  isSelected,
}: FamilyTreeNodeProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getLifespan = () => {
    const birth = member.birthDate
      ? new Date(member.birthDate).getFullYear()
      : "?";
    const death = member.deathDate
      ? new Date(member.deathDate).getFullYear()
      : "";
    return death ? `${birth} - ${death}` : `${birth}`;
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer transition-all duration-300
        ${isSelected ? "scale-110" : "hover:scale-105"}
      `}
    >
      <div
        className={`
          w-32 h-32 rounded-full flex items-center justify-center
          bg-gradient-to-br from-zinc-700 to-zinc-900
          border-2 transition-all duration-300
          ${isSelected ? "border-white shadow-lg shadow-white/20" : "border-zinc-600 group-hover:border-zinc-400"}
        `}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <User className="w-12 h-12 text-zinc-400" />
            <span className="text-2xl font-bold text-zinc-300 mt-1">
              {getInitials(member.name)}
            </span>
          </div>
        )}
      </div>

      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center w-40">
        <p className="text-sm font-medium text-white truncate">{member.name}</p>
        <p className="text-xs text-zinc-400">{getLifespan()}</p>
      </div>
    </div>
  );
}
