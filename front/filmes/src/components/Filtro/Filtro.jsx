import './filtro.css'
import '../../index.css'

export default function Filtro({
    searchTerm, 
    setSearchTerm,
    activeFilters,
    onSearchSubmit, // Função para adicionar o termo da busca como filtro
    onTagClick,
    classPalette
 }) {

    // Permite que o usuário clique ENTER no input para buscar
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearchSubmit();
        }
    };

    return (
        <div className='containerFiltro'>
            <div className='divisaoFiltro'>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress} // Adiciona o evento de Enter
                    className='filtroInput' 
                    placeholder='Procure por titulo, diretor, ano...' 
                />

                <button className='filtroBtnBusca' onClick={onSearchSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
            </div>
            <div className='divisaoFiltro2'>
               {activeFilters.map((filterName, index) => {
                    // 2. Calcula a classe de cor para esta tag
                    const colorIndex = index % classPalette.length;
                    const tagClass = classPalette[colorIndex];

                    return (
                        <div 
                            key={filterName}
                            // 3. APLICA A CLASSE DINÂMICA
                            className={`cardSelecionaFiltro ${tagClass}`} 
                            onClick={() => onTagClick(filterName)} 
                        >
                            <p className='textFiltro1'>{filterName}</p>
                        </div>
                    );
                })}
            </div>

        </div>
    )
}