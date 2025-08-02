import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import clsx from "clsx";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  getAllEngineers,
  getEngineerCapacity,
  type Engineer,
} from "@/services/engineerService";
import {
  getAllProjects,
  type Project,
} from "@/services/projectService";
import { assignEngineer } from "@/services/assignmentService";

type EngineerWithCapacity = Engineer & { capacity: number };

const schema = z.object({
  projectId: z.string().min(1, "Project is required"),
  assignments: z.array(
    z.object({
      engineerId: z.string(),
      allocationPercentage: z.number().min(1).max(100),
      role: z.string().min(1, "Role is required"),
    })
  ),
});

type FormData = z.infer<typeof schema>;

export default function AssignEngineer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [engineers, setEngineers] = useState<EngineerWithCapacity[]>([]);
  const [filteredEngineers, setFilteredEngineers] = useState<EngineerWithCapacity[]>([]);
  const [selectedEngineers, setSelectedEngineers] = useState<
    { engineerId: string; allocationPercentage: number; role: string }[]
  >([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: "",
      assignments: [],
    },
  });

  const selectedProjectId = watch("projectId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, engRes] = await Promise.all([
          getAllProjects(),
          getAllEngineers(),
        ]);

        const engineersWithCapacity: EngineerWithCapacity[] = await Promise.all(
          engRes.map(async (eng) => {
            const capacity = await getEngineerCapacity(eng._id).catch(() => 0);
            return { ...eng, capacity };
          })
        );

        setProjects(projRes.data);
        setEngineers(engineersWithCapacity);
      } catch {
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const project = projects.find((p) => p._id === selectedProjectId);
    setSelectedProject(project ?? null);

    if (project) {
      const requiredSkills = project.requiredSkills.map((s) => s.toLowerCase());
      const filtered = engineers.filter((eng) =>
        eng.skills.some((s) => requiredSkills.includes(s.toLowerCase()))
      );
      setFilteredEngineers(filtered);
      setSelectedEngineers([]);
    } else {
      setFilteredEngineers([]);
      setSelectedEngineers([]);
    }
  }, [selectedProjectId, projects, engineers]);

  const handleEngineerToggle = (id: string) => {
    if (!selectedProject) return;

    const isSelected = selectedEngineers.some((e) => e.engineerId === id);

    if (isSelected) {
      setSelectedEngineers((prev) => prev.filter((e) => e.engineerId !== id));
    } else if (selectedEngineers.length < selectedProject.teamSize) {
      setSelectedEngineers((prev) => [
        ...prev,
        { engineerId: id, allocationPercentage: 0, role: "" },
      ]);
    } else {
      toast.error(`You can only select ${selectedProject.teamSize} engineers`);
    }
  };

  const handleFieldChange = (
    id: string,
    field: "allocationPercentage" | "role",
    value: string
  ) => {
    setSelectedEngineers((prev) =>
      prev.map((e) =>
        e.engineerId === id
          ? {
            ...e,
            [field]:
              field === "allocationPercentage" ? Number(value) : value,
          }
          : e
      )
    );
  };

  const onSubmit = async () => {
    if (!selectedProject) return;

    if (selectedEngineers.length !== selectedProject.teamSize) {
      toast.error(`Select exactly ${selectedProject.teamSize} engineers`);
      return;
    }

    const total = selectedEngineers.reduce(
      (sum, eng) => sum + eng.allocationPercentage,
      0
    );
    if (total !== 100) {
      toast.error("Total allocation must be exactly 100%");
      return;
    }

    for (const eng of selectedEngineers) {
      const actual = engineers.find((e) => e._id === eng.engineerId);
      if (!actual || eng.allocationPercentage > actual.capacity) {
        toast.error(`Allocation exceeds capacity of ${actual?.name || "an engineer"}`);
        return;
      }
    }

    try {
      setLoading(true);
      await Promise.all(
        selectedEngineers.map((eng) =>
          assignEngineer({
            engineerId: eng.engineerId,
            projectId: selectedProjectId,
            allocationPercentage: eng.allocationPercentage,
            startDate: selectedProject.startDate,
            endDate: selectedProject.endDate,
            role: eng.role,
          })
        )
      );
      toast.success("Engineers assigned successfully");
      reset();
      setSelectedEngineers([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign engineers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-4xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Assign Engineers to Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Project</Label>
              <select
                {...register("projectId")}
                className="w-full border rounded-md h-10 px-2 mt-1"
              >
                <option value="">Select Project</option>
                {projects
                  .filter((p) => p.status === "active" || p.status === "planning")
                  .map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
              </select>
              {errors.projectId && (
                <p className="text-sm text-red-500">{errors.projectId.message}</p>
              )}
            </div>

            {selectedProject && (
              <div className="p-4 border bg-gray-50 rounded-md space-y-1">
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Team Size:</strong> {selectedProject.teamSize}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject && (
              <div>
                <Label className="mb-2 block">Engineers Matching Required Skills</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredEngineers.map((eng) => {
                    const maxCapacity = eng.maxCapacity ?? 100;
                    const remaining = eng.capacity ?? 0;
                    const used = maxCapacity - remaining;
                    const usedPercent = (used / maxCapacity) * 100;

                    const selected = selectedEngineers.find(
                      (e) => e.engineerId === eng._id
                    );
                    const isSelected = !!selected;

                    return (
                      <div
                        key={eng._id}
                        className={clsx(
                          "border rounded-md p-3 cursor-pointer hover:bg-gray-50",
                          isSelected && "ring-2 ring-blue-500"
                        )}
                        onClick={(e) => {
                          const tag = (e.target as HTMLElement).tagName;
                          if (tag === "INPUT" || tag === "LABEL" || tag === "BUTTON" || tag === "TEXTAREA") return;
                          handleEngineerToggle(eng._id);
                        }}
                      >
                        <p className="font-medium">{eng.name}</p>
                        <p className="text-xs text-gray-500">{eng.email}</p>

                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">
                            Capacity (Total: {maxCapacity}%)
                          </p>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${usedPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Used: {used}%</span>
                            <span>Remaining: {remaining}%</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {eng.skills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isSelected && selected && (
                          <div className="mt-3 space-y-2">
                            <div>
                              <Label className="text-xs">Allocation %</Label>
                              <Input
                                type="number"
                                value={selected.allocationPercentage}
                                onChange={(e) =>
                                  handleFieldChange(
                                    eng._id,
                                    "allocationPercentage",
                                    e.target.value
                                  )
                                }
                                min={1}
                                max={remaining}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Role</Label>
                              <Input
                                value={selected.role}
                                onChange={(e) =>
                                  handleFieldChange(
                                    eng._id,
                                    "role",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Allocating..." : "Allocate Engineers"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
