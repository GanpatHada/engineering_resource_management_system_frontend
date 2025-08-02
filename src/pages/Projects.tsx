import { useEffect, useState } from "react";
import { getAllProjects } from "@/services/projectService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: "planning" | "active" | "completed";
  managerId: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects();
        setProjects(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Projects</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{project.name}</CardTitle>
                  <Badge
                    className={
                      project.status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : project.status === "active"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-gray-700">
                <p>{project.description}</p>
                <p><strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
                <p><strong>Team Size:</strong> {project.teamSize}</p>

                {project.managerId ? (
                  <p>
                    <strong>Manager:</strong> {project.managerId.name} ({project.managerId.email})
                  </p>
                ) : (
                  <p className="text-gray-500">No manager assigned</p>
                )}

                <div className="flex flex-wrap gap-1 pt-2">
                  {project.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

