import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

import Home from '../../pages/user/Home'
import HomeAdmin from '../../pages/admin/HomeAdmin'

export default function HomeManager() {
    const { isAdmin } = useAuth()

    if (isAdmin) {
        return <HomeAdmin />
    } else {
        return <Home />
    }
}