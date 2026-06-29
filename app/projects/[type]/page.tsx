import { redirect } from "next/navigation";

type Params = Promise<{ type: string }>;

export async function generateStaticParams() {
  return [
    { type: "ongoing" },
    { type: "upcoming" }
  ];
}

export default async function ProjectsTypePage({ params }: { params: Params }) {
  const { type } = await params;
  redirect(`/projects/${type}/bangalore`);
}
