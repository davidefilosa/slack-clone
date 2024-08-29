import React from "react";

interface WorkspaceIdPageProps {
  params: { workspaceId: string };
}

const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  return <div>{params.workspaceId}</div>;
};

export default WorkspaceIdPage;
