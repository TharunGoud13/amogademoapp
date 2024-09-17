// components/LogoutButton.tsx
'use client'

import { logout } from '@/app/actions'
import { useSession } from 'next-auth/react'
// import { MdOutlineLogout } from "react-icons/md"
import { loginLog } from '@/lib/store/actions'
import IpAddress from '@/lib/IpAddress'
import { connect } from 'react-redux'
import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const LogoutButton: FC<any> = ({ loginLog }) => {
    const { data: session } = useSession()

    const handleLogout = async () => {
        try {
            const ipAddress = await IpAddress()

            // Log the logout attempt
            await loginLog({
                description: "Logout Successfully",
                event_type: 'Logout',
                status: 'Success',
                session: session?.user,
                user_ip_address: await IpAddress(),
            })

            // Perform the logout
            await logout()
        } catch (error) {
            console.error('Logout error:', error)

            // Log the failed logout attempt
            const ipAddress = await IpAddress()
            await loginLog({
                user_email: session?.user?.email,
                event_type: 'logout',
                status: 'failure',
                user_name: session?.user?.name,
                session_id: session?.user?.id,
                user_ip_address: ipAddress,
                error_message: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    return (
        <>
            <button
                onClick={handleLogout}
                className="p-2.5 hidden lg:block dark:border-white dark:bg-black dark:text-white font-semibold rounded-lg bg-secondary"
            >
                Logout
            </button>
            <button
                onClick={handleLogout}
                className="p-2.5 lg:hidden font-semibold dark:text-white dark:bg-black rounded-lg bg-gray-100"
            >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
        </>
    )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
    loginLog
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton)