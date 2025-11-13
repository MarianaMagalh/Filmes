import { Link } from 'react-router-dom';
import Derepente30 from '../assets/imgs/derepente30.png'
import FundoForms from '../assets/img-comp/backgoundForm.png'
import Logo from '../assets/imgs/Logo.png'

import '../styles/login.css'

export default function Login() {
    return (
        <main className='mainLogin'>

            <figure className='imgLoginFilme'>
                <img className='imgDeperente' src={Derepente30} alt="" />
            </figure>

            <figure className='imgFundoLogin'>
                <img className='fundoForm' src={FundoForms} alt="" />
            </figure>
            
            <section className='containerLogin'>
                <figure className='imgLogo'>
                    <img src={Logo} alt="" />
                </figure>           
                <h1 className='tituloBoasVindas'>Seja Bem Vinde ao</h1>
                <h2 className='tituloNomeSite'>Amores & Morangos</h2>
                <h3 className='textInfo'>Entre com a sua conta</h3>
                <form action="" method="post" className='formLogin'>
                    <label htmlFor="">Email</label>
                    <input type="email" name="" id="" placeholder='Insira o seu email' />
                    <label htmlFor="">Senha</label>
                    <input type="password" name="" id="" placeholder='Insira a sua senha' />
                    <Link to='/Home'>
                        <button className='btnEntrar'>Entrar</button>
                    </Link>
                    
                </form>
            </section>
        </main>
    )
}