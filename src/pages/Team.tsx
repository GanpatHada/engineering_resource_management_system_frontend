import { useEffect, useState } from "react";
import { getAllEngineers, getEngineerCapacity } from "@/services/engineerService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Engineer {
  _id: string;
  name: string;
  email: string;
  department?: string;
  seniority?: "junior" | "mid" | "senior";
  maxCapacity: number;
  skills: string[];
  capacity: number;
}

export default function Team() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const rawEngineers = await getAllEngineers();

        const engineersWithCapacity = await Promise.all(
          rawEngineers.map(async (eng) => {
            const capacity = await getEngineerCapacity(eng._id).catch(() => 0);
            return {
              ...eng,
              maxCapacity: eng.maxCapacity ?? 100,
              capacity,
            };
          })
        );

        setEngineers(engineersWithCapacity);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch engineers");
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  if (loading) return <p className="text-center py-8">Loading team...</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {engineers.map((engineer) => {
        const { name, email, department, seniority, maxCapacity, skills, capacity } = engineer;
        const used = Math.max(0, maxCapacity - capacity);
        const usedPercent = (used / maxCapacity) * 100;

        return (
          <Card key={engineer._id}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <p className="text-sm text-gray-500">{email}</p>
            </CardHeader>
            <CardContent>
              <p><strong>Department:</strong> {department || "N/A"}</p>
              <p><strong>Seniority:</strong> {seniority || "N/A"}</p>
              <p><strong>Max Capacity:</strong> {maxCapacity}%</p>

              <div className="mt-2">
                <p><strong>Skills:</strong></p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No skills listed</span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <p><strong>Used Capacity:</strong> {used}%</p>
                <Progress value={usedPercent} />
                <p><strong>Remaining Capacity:</strong> {capacity}%</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
