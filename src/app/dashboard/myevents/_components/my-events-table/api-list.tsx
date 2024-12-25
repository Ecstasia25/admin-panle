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
        title="GET MY EVENTS BY ID"
        variant="public"
        description={`${baseUrl}/${entityName}/getCoEventsByCoIdPublic?id={id}`}
      />
      <ApiAlert
        title="GET MY EVENTS WITH FILTER BY ID"
        variant="private"
        description={`${baseUrl}/${entityName}/getFilteredCordEventsByCoId?id={id}&q={value}&stage={enum}&groupSize={count}`}
      />
    </>
  );
};
