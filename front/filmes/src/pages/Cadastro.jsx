import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


import Derepente30 from '../assets/imgs/derepente30.png'
import FundoForms from '../assets/img-comp/backgoundForm.png'
import Logo from '../assets/imgs/Logo.png'

import '../styles/login.css'

const API_URL = 'http://localhost:8000';

const Cadastro = () => {
    // 1. Adiciona o estado para 'nome'
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Para redirecionar

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/register`, { // 2. Chama /register
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ nome, email, senha, role: 'user' }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao cadastrar.');
            }

            // Sucesso!
            alert('Usuário cadastrado com sucesso! Você será redirecionado para o login.');
            navigate('/'); //  Redireciona para a página de Login

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

                <h1 className='tituloBoasVindas'>Crie sua conta no</h1>
                <h2 className='tituloNomeSite'>Amores & Morangos</h2>
                <h3 className='textInfo'>Insira seus dados para começar</h3>


                <form onSubmit={handleRegister} className='formLogin'>

                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        placeholder='Insira o seu nome'
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder='Insira o seu email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder='Insira a sua senha'
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                    />

                    <button type='submit' className='btnEntrar'>Cadastrar</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}


                    <p className='linkss'>
                        Já tem uma conta? <Link to="/">Faça login</Link>
                    </p>
                </form>



            </section>
        </main>
    )
}

export default Cadastro;