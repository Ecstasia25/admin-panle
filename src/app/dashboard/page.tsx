
import { currentUser } from '@clerk/nextjs/server'



const DashboardPage = async () => {
  const auth = await currentUser()


  return (
    <div>
      {auth?.id}
    </div>
  )
}

export default DashboardPage