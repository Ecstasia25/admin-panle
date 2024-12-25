"use client";

import { ApiAlert } from "@/components/shared/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import React from "react";
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
        title="GET EVENTS"
        variant="private"
        description={`${baseUrl}/${entityName}/getEvents`}
      />
      <ApiAlert
        title="GET EVENTS"
        variant="public"
        description={`${baseUrl}/${entityName}/getEventsPublic`}
      />
      <ApiAlert
        title="GET EVENT"
        variant="private"
        description={`${baseUrl}/${entityName}/getEventById?id{${entityNameId}}`}
      />
      <ApiAlert
        title="GET EVENT"
        variant="public"
        description={`${baseUrl}/${entityName}/getEventByIdPublic?id={${entityNameId}}`}
      />
    </>
  );
};