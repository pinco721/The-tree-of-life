export interface FamilyMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  photo?: string;
  gender: "male" | "female" | "other";
  parents?: string[]; // IDs of parents
  spouses?: string[]; // IDs of spouses
  children?: string[]; // IDs of children
  notes?: string;
}

export interface FamilyTree {
  members: FamilyMember[];
  rootMemberId?: string;
}

// Sample data structure for demonstration
export const sampleFamilyData: FamilyTree = {
  rootMemberId: "1",
  members: [
    {
      id: "1",
      name: "John Smith",
      birthDate: "1920-05-15",
      deathDate: "1995-08-22",
      gender: "male",
      spouses: ["2"],
      children: ["3", "4"],
      notes: "Grandfather, WWII veteran",
    },
    {
      id: "2",
      name: "Mary Smith",
      birthDate: "1925-03-10",
      deathDate: "2000-12-01",
      gender: "female",
      spouses: ["1"],
      children: ["3", "4"],
      notes: "Grandmother, teacher",
    },
    {
      id: "3",
      name: "Robert Smith",
      birthDate: "1950-07-20",
      gender: "male",
      parents: ["1", "2"],
      spouses: ["5"],
      children: ["7"],
      notes: "Father, engineer",
    },
    {
      id: "4",
      name: "Jennifer Wilson",
      birthDate: "1952-11-30",
      gender: "female",
      parents: ["1", "2"],
      spouses: ["6"],
      children: ["8", "9"],
      notes: "Aunt, nurse",
    },
    {
      id: "5",
      name: "Susan Smith",
      birthDate: "1952-09-05",
      gender: "female",
      spouses: ["3"],
      children: ["7"],
      notes: "Mother, artist",
    },
    {
      id: "6",
      name: "David Wilson",
      birthDate: "1950-04-18",
      gender: "male",
      spouses: ["4"],
      children: ["8", "9"],
      notes: "Uncle, businessman",
    },
    {
      id: "7",
      name: "Michael Smith",
      birthDate: "1980-01-15",
      gender: "male",
      parents: ["3", "5"],
      notes: "You - software developer",
    },
    {
      id: "8",
      name: "Sarah Wilson",
      birthDate: "1978-06-22",
      gender: "female",
      parents: ["4", "6"],
      notes: "Cousin - doctor",
    },
    {
      id: "9",
      name: "James Wilson",
      birthDate: "1982-12-08",
      gender: "male",
      parents: ["4", "6"],
      notes: "Cousin - architect",
    },
  ],
};
