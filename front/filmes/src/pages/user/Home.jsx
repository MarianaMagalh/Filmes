import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import GiraGira from '../../components/GiraGira/GiraGira'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import CardDecoretion1 from '../../assets/imgs/car-phase-movies.png'

import '../../styles/home.css'
import '../../index.css'

const API_URL = 'http://localhost:8000'

export default function Home() {
    const [filmesRecentes, setFilmesRecentes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentes = async () => {
            try {
                const response = await fetch(`${API_URL}/filmes`)
                const data = await response.json()

                // Filtra aprovados e Ordena (Mais novo primeiro)
                const recentes = data
                    .filter(f => f.status === 'aprovado')
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 2) // Pega só os 2 primeiros

                setFilmesRecentes(recentes)
            } catch (error) {
                console.error("Erro:", error)
            } finally {
                setLoading(false)
            }
        };
        fetchRecentes()
    }, [])

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <div className='containerInfoHome'>
                    <NavBar />
                </div>

                <div className='containerLinks'>
                    <section className='filmesNovos'>
                        <h2 className='titleContainer'>Recem Adicionados</h2>
                        <div id='recebeFilmesNovos'>
                            {filmesRecentes.length > 0 ? (
                                filmesRecentes.map((filme) => (
                                    <Link
                                        to={`/SeeFilmes/${filme.id}`}
                                        key={filme.id}
                                        className="poster-wrapper"
                                    >
                                        <img
                                            src={filme.poster}
                                            alt={filme.titulo}
                                            className="img-poster-recente"
                                        />
                                    </Link>
                                ))
                            ) : (
                                <p className="msg-vazio">Ainda não há filmes recentes.</p>
                            )}

                        </div>

                    </section>

                    <div className='containerDecoracao'>
                        <div className='bordaBranca'>
                            <Link to='/addfilme'>
                                <div className='LinkHomeAddFilmes'>
                                    <h2 className='titleContainer'>Adicionar Novos Filmes</h2>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <figure className='imgCardDecoration1'>
                    <img src={CardDecoretion1} alt="Card com tons azuis, com as maiores frase sobre cinema em idiomas diferentes." />
                </figure>

                <Footer />
            </div>
        </main>
    )
}