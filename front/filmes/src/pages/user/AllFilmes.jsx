import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

import GiraGira from '../../components/GiraGira/GiraGira'
import NavBar from '../../components/NavBar/NavBar'
import Filtro from '../../components/Filtro/Filtro'
import CardAcssFilme from '../../components/CarAcssFilme/CardAcssFilme'

import '../../styles/allFilmes.css'
import '../../index.css'

const API_URL = 'http://localhost:8000';

const CLASS_PALETTE = [
    'juice',
    'berry',
    'fruit',
    'dry'
    // Adicione mais classes se tiver mais cores
];

export default function AllFilmes() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    // 'searchTerm' para o que está sendo digitado na barra de busca
    const [searchTerm, setSearchTerm] = useState('');

    // 'activeFilters' agora armazena os termos que viraram tags clicáveis
    const [activeFilters, setActiveFilters] = useState([]);

    // 3. Busca inicial dos dados (useEffect)
    useEffect(() => {
        const fetchFilmes = async () => {
            useEffect(() => {
                // ... (sua lógica de fetch)
                const fetchFilmes = async () => {
                    try {
                        const response = await fetch(`${API_URL}/filmes`);
                        const data = await response.json();

                        if (isAdmin) {
                            setFilmes(data);
                        } else {
                            setFilmes(data.filter(filme => filme.status === 'aprovado'));
                        }
                    } catch (error) { console.error("Erro:", error); }
                    finally { setLoading(false); }
                };
                fetchFilmes();
            }, [isAdmin]);

        };
        fetchFilmes();
    }, [isAdmin]); // (O useEffect fica como estava)

    // 4. LÓGICA DE FILTRO
    // Filtra a lista 'filmes' com base no 'searchTerm'
    const filmesFiltrados = filmes.filter(filme =>
        filme.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        // (Podemos adicionar diretor, ano, etc. aqui depois)
    );

    const addSearchTermAsFilter = () => {
        if (searchTerm.trim() && !activeFilters.includes(searchTerm.trim())) {
            setActiveFilters(prevFilters => [...prevFilters, searchTerm.trim()]);
            setSearchTerm(''); // Limpa a barra de busca após adicionar
        }
    };

    // Função para remover um filtro ativo (ao clicar na tag)
    const removeActiveFilter = (filterToRemove) => {
        setActiveFilters(prevFilters => prevFilters.filter(f => f !== filterToRemove));
    };

    // LÓGICA DE FILTRAGEM DOS FILMES
    const filmesExibidos = filmes.filter(filme => {
        // Se não há filtros ativos, todos os filmes passam (já filtrados por status)
        if (activeFilters.length === 0) {
            return true;
        }

        // Verifica se o filme corresponde a TODOS os filtros ativos (AND lógico)
        return activeFilters.every(filterTerm => {
            const lowerFilterTerm = filterTerm.toLowerCase();

            // Verifica o título
            if (filme.titulo && filme.titulo.toLowerCase().includes(lowerFilterTerm)) {
                return true;
            }
            // Verifica o diretor
            if (filme.diretor && filme.diretor.toLowerCase().includes(lowerFilterTerm)) {
                return true;
            }
            // Verifica os atores
            if (filme.atores && filme.atores.some(ator => ator.toLowerCase().includes(lowerFilterTerm))) {
                return true;
            }
            // Verifica o gênero
            if (filme.genero && filme.genero.toLowerCase().includes(lowerFilterTerm)) {
                return true;
            }
            // Verifica o ano (se o filtro for um número)
            if (!isNaN(parseInt(lowerFilterTerm)) && filme.ano === parseInt(lowerFilterTerm)) {
                return true;
            }
            // ... adicione outros campos que você quer pesquisar ...

            return false; // Se o filme não corresponde a este filterTerm, ele não passa
        });
    });

    return (
        <main className='mainPadrao'>
            <GiraGira />

            <div className='formatacao'>
                <NavBar />

                <h2 className='titlePage'>Filmes</h2>

                <Filtro
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    activeFilters={activeFilters}
                    onSearchSubmit={addSearchTermAsFilter}
                    onTagClick={removeActiveFilter}
                    classPalette={CLASS_PALETTE}
                />

                <div className="filmesGridContainer">
                    {loading ? (
                        <p>Carregando filmes...</p>
                    ) : (
                        // MUDANÇA AQUI: Passamos (filme, index)
                        filmesFiltrados.map((filme, index) => (
                            <CardAcssFilme
                                key={filme.id}
                                filme={filme} // Passa os dados do filme
                                index={index} // Passa a posição (0, 1, 2, ...)
                            />
                        ))
                    )}
                </div>
            </div>

        </main>
    )
}