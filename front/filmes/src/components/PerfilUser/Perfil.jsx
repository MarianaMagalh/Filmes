import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import IconPerfil from '../../assets/imgs/IconPerfil.png'

import '../../index.css'
import './perfil.css'


export default function Perfil(){
    // Estado para controlar se o menu está aberto ou fechado
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const { logout, isAdmin, authData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
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
                    
                    {/* AQUI ESTÁ A MUDANÇA: Mostra o Nome Dinâmico */}
                    <h3 className="profile-name">
                        {authData.name || 'Usuário'} 
                    </h3>
                    
                    {/* Opcional: Mostrar o cargo pequeno embaixo */}
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

                    {/* Todo mundo pode ver a página de adicionar (mas o status vai como pendente) */}
                    <Link to="/AddFilme" className="menu-item item-green-pattern" onClick={onClose}>
                        ADICIONAR FILMES
                    </Link>
                    
                    {/* LÓGICA DE PROTEÇÃO: Só Admin vê este botão */}
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