import './filtro.css'
import '../../index.css'

export default function Filtro({
    searchTerm, setSearchTerm,
    activeFilters, suggestions, showMenu,
    onSearchSubmit, onTagClick, onSuggestionClick, onToggleMenu,
    classPalette 
}) {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearchSubmit();
        }
    };

    // --- FUNÇÃO PARA DESCOBRIR A COR ---
    const getTagClass = (filterName, index) => {
        // Tenta achar na lista de sugestões (ignora maiúsculas/minúsculas)
        const foundSuggestion = suggestions.find(s => 
            s.label.toLowerCase() === filterName.toLowerCase()
        );
        
        if (foundSuggestion) {
            return foundSuggestion.classe; // Retorna 'color-juice', 'color-berry', etc.
        }

        // Se não achar (foi digitado manual), pega uma cor da paleta
        if (classPalette && classPalette.length > 0) {
            return classPalette[index % classPalette.length];
        }

        return ''; // Sem cor definida
    };


    return (
        <div className='containerFiltro'>
            
            {/* BARRA DE BUSCA */}
            <div className='divisaoFiltro'>
                <input
                    type="text"
                    className='filtroInput'
                    placeholder='Procure por titulo, diretor, ano...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className='filtroBtnBusca' onClick={onSearchSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>

                <button
                    className={`btnFiltro ${showMenu ? 'active' : ''}`}
                    onClick={onToggleMenu}
                    title="Mostrar sugestões"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                    </svg>
                </button>
            </div>

            {/* TAGS ATIVAS (Aqui chamamos a função getTagClass) */}
            <div className='divisaoFiltro2'>
                {activeFilters.map((filterName, index) => {
                    
                    // Descobre a cor desta tag específica
                    const colorClass = getTagClass(filterName, index);
                    
                    return (
                        <div
                            key={index}
                            // APLICAÇÃO DA CLASSE: Adiciona 'selected' e a cor (ex: 'color-juice')
                            className={`cardSelecionaFiltro selected ${colorClass}`}
                            onClick={() => onTagClick(filterName)}
                        >
                            <p className='textFiltro1'>{filterName} ✕</p>
                        </div>
                    );
                })}
            </div>

            {/* MENU DE SUGESTÕES */}
            {showMenu && (
                <div className='menuSugestoes'>
                    <p className="tituloSugestoes">Sugestões:</p>
                    <div className='listaSugestoes'>
                        {suggestions.map((sugestao) => (
                            <div
                                key={sugestao.label}
                                className={`cardSelecionaFiltro ${sugestao.classe}`}
                                onClick={() => onSuggestionClick(sugestao.label)}
                            >
                                <p className='textFiltro1'>{sugestao.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}