"use client";

import { Button } from "@/components/ui/button";
import type { FamilyMember, FamilyTree } from "@/lib/familyData";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FamilyTreeNode } from "./FamilyTreeNode";

interface FamilyTreeCanvasProps {
  familyData: FamilyTree;
  onSelectMember: (member: FamilyMember) => void;
  selectedMemberId?: string;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  generation: number;
}

export function FamilyTreeCanvas({
  familyData,
  onSelectMember,
  selectedMemberId,
}: FamilyTreeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const [viewportCenter, setViewportCenter] = useState({ x: 960, y: 540 });

  // Calculate node positions based on family relationships
  useEffect(() => {
    const positions: NodePosition[] = [];
    const generationMap = new Map<string, number>();
    const positionedIds = new Set<string>();

    // Helper function to calculate generation
    const calculateGeneration = (memberId: string, currentGen = 0): number => {
      if (generationMap.has(memberId)) return generationMap.get(memberId)!;

      const member = familyData.members.find((m) => m.id === memberId);
      if (!member || !member.parents || member.parents.length === 0) {
        generationMap.set(memberId, currentGen);
        return currentGen;
      }

      const parentGens = member.parents.map((pid) =>
        calculateGeneration(pid, currentGen - 1),
      );
      const gen = Math.max(...parentGens) + 1;
      generationMap.set(memberId, gen);
      return gen;
    };

    // Calculate all generations
    familyData.members.forEach((member) => calculateGeneration(member.id));

    // Group by generation
    const generations = new Map<number, string[]>();
    generationMap.forEach((gen, id) => {
      if (!generations.has(gen)) generations.set(gen, []);
      generations.get(gen)?.push(id);
    });

    // Position nodes
    const genArray = Array.from(generations.entries()).sort(
      (a, b) => a[0] - b[0],
    );
    genArray.forEach(([gen, memberIds], genIndex) => {
      const genY = genIndex * 250 + 150;
      memberIds.forEach((memberId, index) => {
        const genX = (index - memberIds.length / 2 + 0.5) * 200;
        positions.push({ id: memberId, x: genX, y: genY, generation: gen });
      });
    });

    setNodePositions(positions);
  }, [familyData]);

  // Set viewport center on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.3), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === canvasRef.current ||
      (e.target as HTMLElement).closest(".tree-canvas")
    ) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Draw connections between family members
  const renderConnections = () => {
    const lines: JSX.Element[] = [];

    familyData.members.forEach((member) => {
      const memberPos = nodePositions.find((p) => p.id === member.id);
      if (!memberPos) return;

      // Connect to parents
      if (member.parents && member.parents.length > 0) {
        member.parents.forEach((parentId) => {
          const parentPos = nodePositions.find((p) => p.id === parentId);
          if (parentPos) {
            const midY = (memberPos.y + parentPos.y) / 2;
            lines.push(
              <g key={`${member.id}-${parentId}`}>
                <line
                  x1={parentPos.x}
                  y1={parentPos.y + 64}
                  x2={parentPos.x}
                  y2={midY}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <line
                  x1={parentPos.x}
                  y1={midY}
                  x2={memberPos.x}
                  y2={midY}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <line
                  x1={memberPos.x}
                  y1={midY}
                  x2={memberPos.x}
                  y2={memberPos.y - 64}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
              </g>,
            );
          }
        });
      }
    });

    return lines;
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setScale((prev) => Math.min(prev * 1.2, 3))}
          className="bg-black/60 border-white/20 hover:bg-black/80"
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setScale((prev) => Math.max(prev * 0.8, 0.3))}
          className="bg-black/60 border-white/20 hover:bg-black/80"
        >
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={resetView}
          className="bg-black/60 border-white/20 hover:bg-black/80"
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="tree-canvas w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          className="relative"
        >
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: "200vw",
              height: "200vh",
              left: "-50vw",
              top: "-50vh",
            }}
          >
            <g
              transform={`translate(${viewportCenter.x}, ${viewportCenter.y})`}
            >
              {renderConnections()}
            </g>
          </svg>

          {/* Nodes */}
          <div className="absolute" style={{ left: "50vw", top: "50vh" }}>
            {nodePositions.map((pos) => {
              const member = familyData.members.find((m) => m.id === pos.id);
              if (!member) return null;

              return (
                <div
                  key={pos.id}
                  className="absolute"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <FamilyTreeNode
                    member={member}
                    onClick={() => onSelectMember(member)}
                    isSelected={selectedMemberId === member.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
