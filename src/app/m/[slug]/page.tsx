import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { MODULES, getModule } from "@/modules/registry";

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
  return <ComingSoon target={{ kind: "module", slug }} />;
}
