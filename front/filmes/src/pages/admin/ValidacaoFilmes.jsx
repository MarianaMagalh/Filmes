import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

import NavBar from '../../components/NavBar/NavBar'
import GiraGira from '../../components/GiraGira/GiraGira'
// Verifique se o caminho da pasta do card está correto aqui:
import CardValidacao from '../../components/CardValidacao/CardValidacao' 

import '../../styles/allFilmes.css';
import '../../index.css'

const API_URL = 'http://localhost:8000'

export default function ValidacaoFilmes() {
    const [filmesPendentes, setFilmesPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { authData } = useAuth();

    // Busca Filmes e Filtra os Pendentes
    useEffect(() => {
        const fetchFilmes = async () => {
            try {
                const response = await fetch(`${API_URL}/filmes`)
                const data = await response.json()
                // Filtra apenas o que é 'pendente'
                setFilmesPendentes(data.filter(f => f.status === 'pendente'))
            } catch (error) {
                console.error("Erro:", error)
            } finally {
                setLoading(false)
            }
        };
        fetchFilmes()
    }, [])

    // DEFINIÇÃO DA FUNÇÃO APROVAR (handleApprove)
    const handleApprove = async (idFilme) => {
        try {
            const response = await fetch(`${API_URL}/aprovacao_filme`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({ movie_id: idFilme })
            });

            if (response.ok) {
                alert('Filme Aprovado!');
                // Remove o filme da lista visualmente para não precisar recarregar
                setFilmesPendentes(prev => prev.filter(f => f.id !== idFilme))
            } else {
                alert('Erro ao aprovar.')
            }
        } catch (error) {
            console.error('Erro:', error)
        }
    };

    // DEFINIÇÃO DA FUNÇÃO REJEITAR (handleReject)
    const handleReject = async (idFilme) => {
        if (!window.confirm("Tem certeza que deseja rejeitar e deletar este filme?")) return;

        try {
            const response = await fetch(`${API_URL}/filmes/${idFilme}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });
            if (response.ok) {
                alert('Filme deletado/rejeitado!');
                setFilmesPendentes(prev => prev.filter(f => f.id !== idFilme));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // RENDERIZAÇÃO (HTML)
    if (loading) {
        return (
            <main className='mainPadrao'>
                 <GiraGira />
                 <div className='formatacao'>
                    <NavBar />
                    <h2 className='titlePage'>Validação de Filmes</h2>
                    <p style={{textAlign: 'center', marginTop: '50px'}}>Carregando filmes pendentes...</p>
                 </div>
            </main>
        )
    }

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavBar />
                <h2 className='titlePage'>Validação de Filmes</h2>

                <div className="filmes-grid-container">
                    {filmesPendentes.length === 0 ? (
                        <div style={{textAlign: 'center', width: '100%', marginTop: '20px'}}>
                            <p>Nenhum filme pendente de aprovação.</p>
                        </div>
                    ) : (
                        filmesPendentes.map((filme, index) => (
                            <CardValidacao
                                key={filme.id}
                                filme={filme}
                                index={index}
                                onApprove={handleApprove} 
                                onReject={handleReject}   
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}