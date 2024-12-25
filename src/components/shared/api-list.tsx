"use client";

import { useOrigin } from "@/hooks/use-origin";
import React from "react";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityNameId: string;
}

export const ApiList = ({ entityName, entityNameId }: ApiListProps) => {
  const origin = useOrigin();

  const baseUrl = `${origin}/api`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityNameId}}`}
      />
      <ApiAlert
        title="POST"
        variant="private"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="private"
        description={`${baseUrl}/${entityName}/{${entityNameId}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="private"
        description={`${baseUrl}/${entityName}/{${entityNameId}}`}
      />
    </>
  );
};
