import sendFirebaseNotification from "@/controller/firebase-controller"

export async function POST(req: any, res: Response) {
  const result = await sendFirebaseNotification(req, res)
  return result
}
