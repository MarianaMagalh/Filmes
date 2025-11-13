import Logo from '../../assets/imgs/Logo.png'
import Perfil from '../../assets/imgs/iconPerfil.png'
import './navbar.css'

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
                        <li>Home</li>
                        <li>Filmes</li>
                        <li>Adicionar Filmes</li>
                        <li>
                            <figure className='imgPerfil'>
                                <img src={Perfil} alt="" />
                            </figure>
                        </li>
                    </ul>
                </nav>
            </div>

        </header>
    )
}