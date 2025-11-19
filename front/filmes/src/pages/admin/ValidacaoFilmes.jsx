import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

import NavAdmin from '../../components/NavAdmin/NavAdmin'
import GiraGira from '../../components/GiraGira/GiraGira'
import CardValidacao from '../../components/CardValidacao/CardValidacao'

import '../../styles/allFilmes.css';
import '../../index.css'

const API_URL = 'http://localhost:8000'

export default function ValidacaoFilmes() {
    const [filmesPendentes, setFilmesPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authData } = useAuth();

    // 1. Busca Filmes e Filtra os Pendentes
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

    // 2. Função para Aprovar Filme
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
                // Remove o filme da lista visualmente
                setFilmesPendentes(prev => prev.filter(f => f.id !== idFilme))
            } else {
                alert('Erro ao aprovar.')
            }
        } catch (error) {
            console.error('Erro:', error)
        }
    };

    // Função para Deletar/Reprovar (Falta criar essa lógica no backend DELETE)
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
                alert('Filme deletado!');
                setFilmesPendentes(prev => prev.filter(f => f.id !== idFilme));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavAdmin />
                <h2 className='titlePage'>Validação de Filmes</h2>

                <div className="filmes-grid-container">
                    {/* ... mapeamento ... */}
                    {filmesPendentes.map((filme, index) => (
                        <CardValidacao
                            key={filme.id}
                            filme={filme}
                            index={index}
                            onApprove={handleApprove} // Sua função existente
                            onReject={handleReject}   // Nova função acima
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}