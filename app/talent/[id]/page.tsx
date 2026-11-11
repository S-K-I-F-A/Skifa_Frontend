import { notFound } from "next/navigation";
import { TalentProfile } from "@/screens/talent/TalentScreens";
import { talent } from "@/screens/talent/data";
import type { Talent } from "@/screens/talent/data";
import { backendBase } from "@/lib/backend";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${backendBase}/talent/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );
  const person: Talent | undefined = response.ok
    ? ((await response.json()) as Talent)
    : talent.find((profile) => profile.id === id);
  if (!person) notFound();
  return <TalentProfile person={person} />;
}
