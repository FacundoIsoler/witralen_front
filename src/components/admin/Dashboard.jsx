import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaTags, FaTools, FaSignOutAlt } from 'react-icons/fa'
import styles from './Dashboard.module.css'
import logo from '../../assets/logo/logoBlanco.png'
import useAuthStore from '../../stores/authStore'

//Components
import Products from './sections/Products'
import Services from './sections/Services'
import Brands from './sections/Brands'

const SECTIONS = [
    { id: 'products', label: 'Productos', icon: FaBoxOpen, Component: Products },
    { id: 'brands', label: 'Marcas', icon: FaTags, Component: Brands },
    { id: 'services', label: 'Servicios', icon: FaTools, Component: Services },
]

function Dashboard() {
    const [activeSection, setActiveSection] = useState('products')
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)
    const ActiveComponent = SECTIONS.find((s) => s.id === activeSection).Component

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <button
                    type="button"
                    className={styles.sidebarHeader}
                    onClick={() => navigate('/')}
                    aria-label="Ir al sitio"
                >
                    <img src={logo} alt="Witralen" className={styles.sidebarLogo} />
                    <span className={styles.sidebarTitle}>Panel de administración</span>
                </button>
                <nav className={styles.nav}>
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`${styles.navItem} ${activeSection === id ? styles.navItemActive : ''}`}
                            onClick={() => setActiveSection(id)}
                        >
                            <Icon className={styles.navIcon} />
                            {label}
                        </button>
                    ))}
                </nav>
                <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                    <FaSignOutAlt className={styles.navIcon} />
                    Cerrar sesión
                </button>
            </aside>
            <main className={styles.content}>
                <ActiveComponent />
            </main>
        </div>
    )
}

export default Dashboard
