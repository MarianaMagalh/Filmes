import React from 'react' // Removemos useState pois não é necessário aqui
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import IconPerfil from '../../assets/imgs/IconPerfil.png'

import '../../index.css'
import './perfil.css'

// 1. Recebemos 'onClose' como prop vinda do NavBar
export default function Perfil({ onClose }){
    
    // REMOVIDO: O estado 'isMenuOpen' fica no NavBar, não aqui inside.
    
    const { logout, isAdmin, authData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
        // Verifica se onClose existe antes de chamar
        if (onClose) onClose();
    };

    return(
        <div className="profile-menu-overlay">
            <div className="profile-menu-container">
                
                {/* Cabeçalho */}
                <div className="profile-header">
                    <div className="profile-icon-large">
                        <img src={IconPerfil} alt="Perfil" />
                    </div>
                    
                    <h3 className="profile-name">
                        {authData.name || 'Usuário'} 
                    </h3>
                    
                    <span className="profile-role-tag">
                        {isAdmin ? 'Administrador' : 'Membro'}
                    </span>
                </div>

                {/* Links de Navegação */}
                <div className="profile-links">
                    
                    <Link to="/Home" className="menu-item item-pink-pattern" onClick={onClose}>
                        HOME
                    </Link>

                    <Link to="/AllFilmes" className="menu-item item-yellow-pattern" onClick={onClose}>
                        FILMES
                    </Link>

                    <Link to="/AddFilme" className="menu-item item-green-pattern" onClick={onClose}>
                        ADICIONAR FILMES
                    </Link>
                    
                    {isAdmin && (
                        <Link to="/admin/validacao" className="menu-item item-check-pattern" onClick={onClose}>
                            VALIDAÇÃO
                        </Link>
                    )}

                </div>

                <button className="menu-item btn-logout" onClick={handleLogout}>
                    SAIR
                </button>
            </div>
        </div>
    )
}