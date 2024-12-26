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
        variant="public"
        description={`${baseUrl}/${entityName}/getEventsPublic`}
      />
      <ApiAlert
        title="GET DAY1 EVENTS"
        variant="public"
        description={`${baseUrl}/${entityName}/getFilterEventsByPublic?day=DAY1`}
      />
      <ApiAlert
        title="GET DAY2 EVENTS"
        variant="public"
        description={`${baseUrl}/${entityName}/getFilterEventsByPublic?day=DAY2`}
      />
      <ApiAlert
        title="GET ONSTAGE  EVENTS"
        variant="public"
        description={`${baseUrl}/${entityName}/getFilterEventsByPublic?day={value}&stage=ONSTAGE`}
      />
      <ApiAlert
        title="GET OFFSTAGE  EVENTS"
        variant="public"
        description={`${baseUrl}/${entityName}/getFilterEventsByPublic?day={value}&stage=OFFSTAGE`}
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
      <ApiAlert
        title="GET EVENTS BY FILTER"
        variant="private"
        description={`${baseUrl}/${entityName}/events/getEvents?q={value}&stage={enum}&groupSize={count}&category={enum}`}
      />
      <ApiAlert
        title="GET EVENTS BY FILTER"
        variant="public"
        description={`${baseUrl}/${entityName}/events/getFilterEventsByPublic?q={value}&stage={enum}&groupSize={count}&category={enum}`}
      />
      <ApiAlert
        title="GET EVENTS BY PAGINATION"
        variant="public"
        description={`${baseUrl}/${entityName}/events/getFilterEventsByPublic?limit={value}&page=1`}
      />
    </>
  );
};
