import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';

export default async function WorkspaceRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkspaceLayout workspaceId={id}>{children}</WorkspaceLayout>;
}
