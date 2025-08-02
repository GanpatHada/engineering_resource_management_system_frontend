import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAssignments, type Assignment } from "@/services/assignmentService";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssignments()
      .then((data) => {
        setAssignments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const ongoing = assignments.filter(
    (a) => a.projectId.status === "active"
  );
  const upcoming = assignments.filter(
    (a) => a.projectId.status === "planning"
  );

  const renderAssignmentCards = (list: Assignment[]) =>
    list.length === 0 ? (
      <p className="text-gray-500">No assignments found.</p>
    ) : (
      <div className="grid gap-6">
        {list.map((assignment) => (
          <Card key={assignment._id}>
            <CardHeader>
              <CardTitle>{assignment.projectId.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {assignment.projectId.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Role:</strong> {assignment.role}
              </p>
              <p>
                <strong>Allocation:</strong> {assignment.allocationPercentage}%
              </p>
              <p>
                <strong>Project Duration:</strong>{" "}
                {format(new Date(assignment.startDate), "MMM d, yyyy")} -{" "}
                {format(new Date(assignment.endDate), "MMM d, yyyy")}
              </p>
              <p>
                <strong>Required Skills:</strong>{" "}
                {assignment.projectId.requiredSkills.join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  if (loading) return <div className="p-6 text-gray-600">Loading assignments...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        My Assignments
      </h1>

      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ongoing">
            Ongoing ({ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          {renderAssignmentCards(ongoing)}
        </TabsContent>

        <TabsContent value="upcoming">
          {renderAssignmentCards(upcoming)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
