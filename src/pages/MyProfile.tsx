import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateEngineerSkills } from "@/services/engineerService";

const allSkills = [
  "React", "Tailwind", "Node.js", "TypeScript", "MongoDB",
  "Express", "Next.js", "Docker", "Kubernetes", "Python",
  "Java", "PostgreSQL", "AWS",
];

export default function Profile() {
  const { user, setUser } = useUser();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-6 text-gray-600">Loading profile...</div>;

  const isEngineer = user.role === "engineer";
  const employmentType =
    user.maxCapacity === 100
      ? "Full-time Employee"
      : user.maxCapacity === 50
      ? "Part-time Employee"
      : null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleUpdateSkills = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateEngineerSkills(selectedSkills);
      setUser(updatedUser);
      toast.success("Skills updated successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="space-y-4 bg-white shadow rounded-lg p-6 border">
        <p><span className="font-medium text-gray-700">Name:</span> {user.name}</p>
        <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
        <p><span className="font-medium text-gray-700">Role:</span> {user.role}</p>

        {isEngineer && (
          <>
            <p>
              <span className="font-medium text-gray-700">Skills:</span>{" "}
              {user.skills?.join(", ") || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Seniority:</span>{" "}
              {user.seniority || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Max Capacity:</span>{" "}
              {user.maxCapacity || "N/A"}%
            </p>
            {employmentType && (
              <p className="text-sm text-blue-600 font-medium">{employmentType}</p>
            )}

            {/* Skills Update Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">Update Skills</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Skills</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
                  {allSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <Label htmlFor={skill}>{skill}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleUpdateSkills} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
