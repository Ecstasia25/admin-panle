import React from 'react'

interface AdminDetailsProps {
  params: {
    adminId: string
  }
}

const AdminDetails = ({
  params
}: AdminDetailsProps) => {

  const adminId = params.adminId
  return (
    <div>
      {adminId}
    </div>
  )
}

export default AdminDetails