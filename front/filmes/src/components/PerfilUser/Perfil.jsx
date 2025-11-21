import React from 'react' // Removemos useState pois não é necessário aqui
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import IconPerfil from '../../assets/imgs/IconPerfil.png'

import '../../index.css'
import './perfil.css'

// 1. Recebemos 'onClose' como prop vinda do NavBar
export default function Perfil({ onClose }) {

    const { logout, isAdmin, authData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        // Verifica se onClose existe antes de chamar
        if (onClose) onClose();
    };

    return (
        <div>
            <div className="profileMenuContainer">
                <figure className="profileIconLarge" >
                    <img src={IconPerfil} alt="Perfil" />
                </figure>


                <h3 className="profileName">
                    {authData.nome || 'Usuário'}
                </h3>

                {/* Links de Navegação */}
                <div className="profileLinks">

                    <Link to="/Home" className="menu-item itemPinkPattern" onClick={onClose}>
                        <p>
                            HOME
                        </p>

                    </Link>

                    <Link to="/allfilmes" className="menu-item itemYellowPattern" onClick={onClose}>
                        <p>
                            FILMES
                        </p>


                    </Link>

                    <Link to="/addfilme" className="menu-item itemGreenPattern" onClick={onClose}>
                        <p>
                            ADICIONAR FILMES
                        </p>

                    </Link>

                    {isAdmin && (
                        <Link to="/validacao" className="menu-item itemCheckPattern" onClick={onClose}>
                            <p>
                                VALIDAÇÃO
                            </p>

                        </Link>
                    )}

                </div>

                <button className="menuItem btnLogout" onClick={handleLogout}>
                    SAIR
                </button>
            </div>
        </div>
    )
}