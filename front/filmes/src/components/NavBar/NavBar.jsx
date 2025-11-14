import { Link } from 'react-router-dom'

import Logo from '../../assets/imgs/Logo.png'
import Perfil from '../../assets/imgs/iconPerfil.png'

import './navbar.css'
import '../../index.css'

export default function NavBar() {
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
                        <li>
                            <Link to="/Perfil">
                                <figure className='imgPerfil'>
                                    <img src={Perfil} alt="" />
                                </figure>

                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

        </header>
    )
}