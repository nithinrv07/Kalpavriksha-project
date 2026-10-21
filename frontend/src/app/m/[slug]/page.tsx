import { notFound } from "next/navigation";
import { MODULES, getModule } from "@/modules/registry";
import { ModuleScreen } from "@/modules/screens";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/m/[slug]">) {
  const { slug } = await props.params;
  return { title: `${getModule(slug)?.title.en ?? "Module"} — Kalpavriksha` };
}

export default async function ModulePage(props: PageProps<"/m/[slug]">) {
  const { slug } = await props.params;
  if (!getModule(slug)) notFound();
  return <ModuleScreen slug={slug} />;
}
