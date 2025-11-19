import { useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../assets/imgs/Logo.png'
import IconePerfil from '../../assets/imgs/iconPerfil.png'

import Perfil from '../PerfilUser/Perfil'

import '../NavBar/navbar.css'
import '../../index.css'

export default function NavAdmin() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header>
            <div className='allElements'>
                <figure className='imgLogoNav'>
                    <img src={Logo} alt="logo do site - lente de uma camêra em tons roxos" />
                </figure>

                <h1 className='titleNav'>Amores & Morangos</h1>

                <nav>
                    <ul>
                        <li><Link to="/Home">Home</Link></li>
                        <li><Link to="/AllFilmes">Filmes</Link></li>
                        <li><Link to="/AddFilme">Adicionar Filmes</Link></li>
                        <li><Link to='/validacao'>Validar Filmes</Link></li>
                        <li style={{ position: 'relative' }}>

                            <button className='imgPerfil' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <figure>
                                    <img src={IconePerfil} alt="Ícone de Perfil" />
                                </figure>
                            </button>

                            {/* Renderiza o Componente Perfil */}
                            {isMenuOpen && (
                                <Perfil onClose={() => setIsMenuOpen(false)} />
                            )}

                        </li>
                    </ul>
                </nav>
            </div>

        </header>
    )
}