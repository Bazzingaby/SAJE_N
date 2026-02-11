import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";

export default function WorkspaceRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
