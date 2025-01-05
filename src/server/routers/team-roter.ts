import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/utils/db"
import { matchSorter } from "match-sorter"

export const teamRouter = router({
  createTeam: privateProcedure
    .input(
      z.object({
        name: z.string({
          required_error: "Name is required",
        }),
        teamId: z.string({
          required_error: "Team ID is required",
        }),
        groupSize: z.string({
          required_error: "Group Size is required",
        }),
        reapId: z.string({
          required_error: "Reap is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      const { name, teamId, groupSize, reapId } = input

      try {
        // Create the team
        const team = await db.team.create({
          data: {
            name,
            teamId,
            groupSize,
            reap: {
              connect: {
                id: reapId,
              },
            },
          },
        })
        return c.json({
          success: true,
          data: team,
          message: "Team created successfully",
        })
      } catch (error: any) {
        console.error("Error creating event:", error)

        // Return an error response
        return c.json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to create the event",
        })
      }
    }),
  updateTeam: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
        }),
        name: z.string({
          required_error: "Name is required",
        }),
        groupSize: z.string({
          required_error: "Group Size is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id, name, groupSize } = input

      try {
        // Update the team
        const team = await db.team.update({
          where: {
            id,
          },
          data: {
            name,
            groupSize,
          },
        })
        return c.json({
          success: true,
          data: team,
          message: "Team updated successfully",
        })
      } catch (error: any) {
        console.error("Error updating team:", error)

        // Return an error response
        return c.json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update the team",
        })
      }
    }),
  getTeamById: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
        }),
      })
    )
    .query(async ({ c, input }) => {
      const { id } = input

      const team = await db.team.findUnique({
        where: {
          id,
        },
        include: {
          reap: true,
        },
      })
      return c.json({
        success: true,
        team,
        message: "Team fetched successfully",
      })
    }),
  deleteTeam: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id } = input

      try {
        await db.team.delete({
          where: {
            id,
          },
        })
        return c.json({
          success: true,
          message: "Team deleted successfully",
        })
      } catch (error: any) {
        console.error("Error deleting team:", error)

        // Return an error response
        return c.json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete the team",
        })
      }
    }),
  getTeams: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        groupSize: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search, groupSize } = input
      let formatedEventsArray = groupSize ? groupSize.split(".") : []

      let teams = await db.team.findMany({
        include: {
          reap: true,
        },
      })

      if (formatedEventsArray.length > 0) {
        teams = teams.filter((team) => {
          return formatedEventsArray.includes(team.groupSize)
        })
      }

      if (search) {
        teams = matchSorter(teams, search, {
          keys: ["name"],
        })
      }

      const allTeams = teams.length

      const offset = (page - 1) * limit

      const paginatedTeams = teams.slice(offset, offset + limit)

      return c.json({
        success: true,
        data: {
          allTeamsCount: allTeams,
          teams: paginatedTeams,
          offset,
          limit,
        },
        message: "Teams fetched successfully",
      })
    }),
  getReapTeamCountById: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
        }),
      })
    )
    .query(async ({ c, input }) => {
      const { id } = input

      const team = await db.team.findMany({
        where: {
          reapId: id,
        },
      })
      return c.json({
        success: true,
        teamCount: team.length,
        message: "Team fetched successfully",
      })
    }),
  getTeamsByReapId: privateProcedure
    .input(
      z.object({
        reapId: z.string({
          required_error: "Reap ID is required",
        }),
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        groupSize: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search, groupSize, reapId } = input
      let formatedEventsArray = groupSize ? groupSize.split(".") : []

      let teams = await db.team.findMany({
        where: {
          reapId,
        },
        include: {
          reap: true,
        },
      })

      if (formatedEventsArray.length > 0) {
        teams = teams.filter((team) => {
          return formatedEventsArray.includes(team.groupSize)
        })
      }

      if (search) {
        teams = matchSorter(teams, search, {
          keys: ["name"],
        })
      }

      const allTeams = teams.length

      const offset = (page - 1) * limit

      const paginatedTeams = teams.slice(offset, offset + limit)

      return c.json({
        success: true,
        data: {
          allTeamsCount: allTeams,
          teams: paginatedTeams,
          offset,
          limit,
        },
        message: "Teams fetched successfully",
      })
    }),
})
