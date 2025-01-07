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
        members: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id, name, groupSize, members } = input

      try {
        // Update the team
        const team = await db.team.update({
          where: {
            id,
          },
          data: {
            name,
            groupSize,
            members: {
              set: members?.map((member) => ({
                id: member,
              })),
            },
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
          members: true,
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
          members: true,
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
  joinTeam: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
        }),
        userId: z.string({
          required_error: "User ID is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id, userId } = input

      try {
        // Fetch the team to check the current number of members
        const team = await db.team.findUnique({
          where: {
            id,
          },
          include: {
            members: true,
          },
        })

        if (team && team.members.length >= parseInt(team.groupSize)) {
          return c.json({
            success: false,
            freeSpace: false,
            message: "Maximum members reached",
          })
        }

        // Update the team
        const updatedTeam = await db.team.update({
          where: {
            id,
          },
          data: {
            members: {
              connect: {
                id: userId,
              },
            },
          },
        })
        return c.json({
          success: true,
          data: updatedTeam,
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
  exitTeam: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
        }),
        userId: z.string({
          required_error: "User ID is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id, userId } = input

      try {
        // Update the team
        const updatedTeam = await db.team.update({
          where: {
            id,
          },
          data: {
            members: {
              disconnect: {
                id: userId,
              },
            },
          },
        })
        return c.json({
          success: true,
          data: updatedTeam,
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
  getTeamByTeamCode: privateProcedure
    .input(
      z.object({
        teamId: z.string({
          required_error: "Team ID is required",
        }),
      })
    )
    .query(async ({ c, input }) => {
      const { teamId } = input

      const team = await db.team.findUnique({
        where: {
          teamId,
        },
        include: {
          reap: true,
          members: true,
        },
      })
      return c.json({
        success: true,
        team,
        message: "Team fetched successfully",
      })
    }),
  checkValidTeamCode: privateProcedure
    .input(
      z.object({
        teamId: z.string({
          required_error: "Team ID is required",
        }),
      })
    )
    .query(async ({ c, input }) => {
      const { teamId } = input

      const team = await db.team.findUnique({
        where: {
          teamId,
        },
      })
      return c.json({
        success: true,
        team,
        isValid: !!team,
        message: "Team fetched successfully",
      })
    }),
  getTeamsByMemberId: privateProcedure
    .input(
      z.object({
        memberId: z.string({
          required_error: "Member ID is required",
        }),
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        groupSize: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search, groupSize, memberId } = input
      let formatedEventsArray = groupSize ? groupSize.split(".") : []

      let teams = await db.team.findMany({
        where: {
          members: {
            some: {
              id: memberId,
            },
          },
        },
        include: {
          reap: true,
          members: true,
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
