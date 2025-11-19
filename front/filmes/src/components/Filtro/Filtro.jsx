import './filtro.css'
import '../../index.css'

export default function Filtro({
    searchTerm, setSearchTerm,
    activeFilters, suggestions, showMenu,
    onSearchSubmit, onTagClick, onSuggestionClick, onToggleMenu
}) {

    // Permite que o usuário clique ENTER no input para buscar
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearchSubmit();
        }
    };

    <div className='containerFiltro'>
        {/* PARTE 1: INPUT + BOTÕES */}
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

            {/* BOTÃO DO FUNIL: Agora tem funcionalidade! */}
            <button
                className={`btnFiltro ${showMenu ? 'active' : ''}`}
                onClick={onToggleMenu}
                title="Mostrar filtros sugeridos"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                </svg>
            </button>
        </div>

        {/* PARTE 2: TAGS ATIVAS (O que o usuário já escolheu) */}
        <div className='divisaoFiltro2'>
            {activeFilters.map((filterName, index) => (
                <div
                    key={index}
                    className="cardSelecionaFiltro selected" // Usa estilo padrão de selecionado
                    onClick={() => onTagClick(filterName)}
                    style={{ backgroundColor: '#333', borderColor: '#333' }} // Ex: Cinza escuro para tags digitadas manualmente
                >
                    <p className='textFiltro1'>{filterName} ✕</p>
                </div>
            ))}
        </div>

        {/* MENU DE SUGESTÕES (Aparece só se clicar no funil) */}
        {showMenu && (
            <div className='menuSugestoes'>
                <p className="tituloSugestoes">Sugestões:</p>
                <div className='listaSugestoes'>
                    {suggestions.map((sugestao) => (
                        <div
                            key={sugestao.label}
                            // Aplica a classe de cor definida no AllFilmes (color-juice, etc)
                            className={`cardSelecionaFiltro ${sugestao.classe}`}
                            onClick={() => {
                                onSuggestionClick(sugestao.label);
                                // Opcional: Fechar o menu após clicar? onToggleMenu();
                            }}
                        >
                            <p className='textFiltro1'>{sugestao.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
}