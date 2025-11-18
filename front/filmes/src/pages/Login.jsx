import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx';

import Derepente30 from '../assets/imgs/derepente30.png'
import FundoForms from '../assets/img-comp/backgoundForm.png'
import Logo from '../assets/imgs/Logo.png'

import '../styles/login.css'

// URL base da sua API Python
const API_URL = 'http://localhost:8000';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciais inválidas.');
            }

            login(data.token, data.role); // Salva o token

            // 3. Redireciona para a Home APÓS o sucesso
            navigate('/Home');

        } catch (err) {
            setError(err.message);
        }
    };

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

                <form onSubmit={handleLogin} method="post" className='formLogin'>
                    <label htmlFor="">Email</label>
                    <input type="email" name="" id="" placeholder='Insira o seu email' value={email} onChange={e => setEmail(e.target.value)} required />

                    <label htmlFor="">Senha</label>
                    <input type="password" name="" id="" placeholder='Insira a sua senha' value={senha} onChange={e => setSenha(e.target.value)} required />


                    <button type='submit' className='btnEntrar'>Entrar</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <p className='linkss'>
                        Ainda não uma conta? <Link to="/Cadastro">Faça o cadastro</Link>
                    </p>

                </form>
            </section>
        </main>
    )
}

export default Login
