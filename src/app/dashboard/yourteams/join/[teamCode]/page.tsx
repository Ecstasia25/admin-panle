import React from 'react'

interface TeamJoinConfirmationPageProps {
    params: {
        teamCode: string
    }
}

const TeamJoinConfirmationPage = ({ params }: TeamJoinConfirmationPageProps) => {
    return (
        <div>
            {params.teamCode}
        </div>
    )
}

export default TeamJoinConfirmationPage