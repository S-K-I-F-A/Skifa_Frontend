import { notFound } from "next/navigation";
import { TalentProfile } from "@/screens/talent/TalentScreens";
import { talent } from "@/screens/talent/data";
export function generateStaticParams() {
  return talent.map((person) => ({ id: person.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = talent.find((profile) => profile.id === id);
  if (!person) notFound();
  return <TalentProfile person={person} />;
}
