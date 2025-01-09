import { format } from "date-fns"
import { transporter } from "./nodemailer"

const domain = process.env.NEXT_PUBLIC_APP_URL

export const JoinTeamMail = async (
  leaderEmail: string,
  eventTitle: string,
  membersName: string[],
  registrationId: string,
  paymentId: string,
  eventDate: string,
  totalENtry: string
) => {
  const info = await transporter.sendMail({
    from: `"Ecstasia 2025" <${process.env.GMAIL_EMAIL}>`,
    to: leaderEmail,
    subject: `Event Registration: ${eventTitle}`,
    html: ``,
  })

  return info
}
