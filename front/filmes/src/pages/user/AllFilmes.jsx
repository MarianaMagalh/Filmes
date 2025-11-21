import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

import GiraGira from '../../components/GiraGira/GiraGira'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer.jsx'
import Filtro from '../../components/Filtro/Filtro'
import CardAcssFilme from '../../components/CarAcssFilme/CardAcssFilme'

import '../../styles/allFilmes.css'
import '../../index.css'

const API_URL = 'http://localhost:8000';

// Mantemos apenas a paleta de cores
const CLASS_PALETTE = [
    'color-sun', 'color-berry', 'color-fruit', 'color-dry'
];

export default function AllFilmes() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    
    // Estado para as sugestões dinâmicas (substitui a constante)
    const [sugestoesDinamicas, setSugestoesDinamicas] = useState([]);

    // Busca os filmes (Sem aninhamento errado)
    useEffect(() => {
        const fetchFilmes = async () => {
            try {
                const response = await fetch(`${API_URL}/filmes`);
                const data = await response.json();

                if (isAdmin) {
                    setFilmes(data);
                } else {
                    setFilmes(data.filter(filme => filme.status === 'aprovado'));
                }
            } catch (error) { 
                console.error("Erro:", error); 
            } finally { 
                setLoading(false);
            }
        };
        fetchFilmes();
    }, [isAdmin]);

    // Gera as sugestões baseadas nos 3 primeiros filmes
    useEffect(() => {
        if (filmes.length === 0) {
            setSugestoesDinamicas([]);
            return;
        }

        // Pega apenas os 3 primeiros filmes da lista
        const primeirosFilmes = filmes.slice(0, 3);
        
        let tagsBrutas = [];

        // Extrai as informações desses filmes
        primeirosFilmes.forEach(filme => {
            if (filme.titulo) tagsBrutas.push(filme.titulo);
            if (filme.genero) tagsBrutas.push(filme.genero);
            if (filme.diretor) tagsBrutas.push(filme.diretor);
        });

        // Remove duplicatas (ex: se 2 filmes forem de Terror, só mostra 1 tag)
        const tagsUnicas = [...new Set(tagsBrutas)];

        // Formata para o padrão que o Filtro espera (label + cor)
        const sugestoesFormatadas = tagsUnicas.map((tag, index) => ({
            label: tag,
            classe: CLASS_PALETTE[index % CLASS_PALETTE.length] // Dá uma cor da paleta
        }));

        setSugestoesDinamicas(sugestoesFormatadas);

    }, [filmes]); // Recalcula toda vez que a lista de filmes mudar (ex: deletar)


    // --- Funções de Controle ---
    const addFilter = (filterLabel) => {
        if (filterLabel && !activeFilters.includes(filterLabel)) {
            setActiveFilters([...activeFilters, filterLabel]);
        }
    };

    const toggleFilterMenu = () => setShowFilterMenu(!showFilterMenu);

    const addSearchTermAsFilter = () => {
        if (searchTerm.trim() && !activeFilters.includes(searchTerm.trim())) {
            setActiveFilters(prev => [...prev, searchTerm.trim()]);
            setSearchTerm('');
        }
    };

    const removeActiveFilter = (filterToRemove) => {
        setActiveFilters(prev => prev.filter(f => f !== filterToRemove));
    };

    // Lógica de Filtragem Unificada
    const filmesParaExibir = filmes.filter(filme => {
        const matchBarraBusca = filme.titulo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchTags = activeFilters.length === 0 || activeFilters.every(filterTerm => {
            const lowerFilter = filterTerm.toLowerCase();
            return (
                (filme.titulo && filme.titulo.toLowerCase().includes(lowerFilter)) ||
                (filme.diretor && filme.diretor.toLowerCase().includes(lowerFilter)) ||
                (filme.genero && filme.genero.toLowerCase().includes(lowerFilter)) ||
                (filme.produtora && filme.produtora.toLowerCase().includes(lowerFilter)) ||
                (filme.ano && filme.ano.toString() === lowerFilter)
            );
        });

        return matchBarraBusca && matchTags;
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
                    
                    // Passamos o estado dinâmico em vez da lista fixa
                    suggestions={sugestoesDinamicas}      
                    
                    showMenu={showFilterMenu}
                    classPalette={CLASS_PALETTE}
                    onSearchSubmit={addSearchTermAsFilter}
                    onTagClick={removeActiveFilter}     
                    onSuggestionClick={addFilter}       
                    onToggleMenu={toggleFilterMenu}     
                />

                <div className="filmesGridContainer">
                    {loading ? (
                        <p>Carregando filmes...</p>
                    ) : filmesParaExibir.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '100%', marginTop: '20px' }}>
                             <p>Nenhum filme encontrado com esses filtros.</p>
                             <button 
                                onClick={() => {setSearchTerm(''); setActiveFilters([]);}}
                                style={{ marginTop: '10px', cursor: 'pointer', textDecoration: 'underline', background:'none', border:'none', color: 'inherit' }}
                             >
                                Limpar filtros
                            </button>
                        </div>
                    ) : (
                        filmesParaExibir.map((filme, index) => (
                            <CardAcssFilme
                                key={filme.id}
                                filme={filme} 
                                index={index} 
                            />
                        ))
                    )}
                </div>

                <Footer />
            </div>
        </main>
    )
}