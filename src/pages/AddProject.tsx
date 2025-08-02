import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { addProject } from "@/services/projectService";
import { useNavigate } from "react-router-dom";

const projectSchema = z
  .object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Start date is required",
    }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "End date is required",
    }),
    requiredSkills: z.array(z.string()).min(1, "Please select at least one skill"),
    teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date",
    path: ["endDate"]
  });

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AddProject() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"planning" | "active" | "completed">("planning");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectFormValues>,
  });

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  useEffect(() => {
    if (!watchStartDate || !watchEndDate) return;

    const today = new Date();
    const start = new Date(watchStartDate);
    const end = new Date(watchEndDate);

    if (today < start) {
      setStatus("planning");
    } else if (today >= start && today <= end) {
      setStatus("active");
    } else {
      setStatus("completed");
    }
  }, [watchStartDate, watchEndDate]);

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    try {
      await addProject({ ...data, status });
      toast("Project created successfully");
      reset();
      navigate("/manager");
    } catch (err: any) {
      toast(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="name">Project Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label className="mb-2" htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
              </div>
              <div>
                <Label className="mb-2" htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <Label className="mb-2">Required Skills</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "React", "Tailwind", "Node.js", "TypeScript", "MongoDB",
                  "Express", "Next.js", "Docker", "Kubernetes", "Python",
                  "Java", "PostgreSQL", "AWS"
                ].map((skill) => (
                  <label key={skill} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={skill}
                      {...register("requiredSkills")}
                      className="h-4 w-4"
                    />
                    {skill}
                  </label>
                ))}
              </div>
              {errors.requiredSkills && (
                <p className="text-sm text-red-500">{errors.requiredSkills.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2" htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                {...register("teamSize", { valueAsNumber: true })}
              />
              {errors.teamSize && (
                <p className="text-sm text-red-500">{errors.teamSize.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2">Status</Label>
              <Input value={status} disabled className="cursor-not-allowed bg-gray-100" />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
