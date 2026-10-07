"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function ProjectsDashboard() {
    const utils = api.useUtils();

    const { data: projects = [], isLoading } = api.project.getAll.useQuery();

    const createProject = api.project.create.useMutation({
        onSuccess: () => {
            void utils.project.getAll.invalidate();
            setTitle("");
        }
    });

    const [title, setTitle] = useState("");

    if (isLoading) {
        return <div className="p-8 text-gray-500">Loading enterprise data...</div>;
    }

    return <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Enterprise Projects</h1>

        {/* Creation Form */}
        <div className="flex gap-4 mb-8">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Project Title..."
                className="border rounded px-4 py-2 flex-1"
            />
            <button
                onClick={() => createProject.mutate({ title, orgId: "1" })}
                disabled={createProject.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
            {createProject.isPending ? "Creating..." : "Create Project"}
            </button>
        </div>

            {/* Project List */}
        <div className="space-y-4">
                {projects?.map((project) => (
                    <div key={project.id} className="border p-4 rounded shadow-sm bg-white">
                    <h2 className="font-semibold text-lg">{project.title}</h2>
                    <p className="text-gray-600 text-sm">{project.description ?? "No description provided."}</p>
                    <span className="text-xs text-blue-600 font-medium mt-2 inline-block">
                    {project.tasks.length} Active Tasks
                </span>
            </div>
            ))}
        </div>
    </main>
}