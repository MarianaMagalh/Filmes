import './filtro.css'
import '../../index.css'

export default function Filtro() {
    return (
        <div className='containerFiltro'>
            <div className='divisaoFiltro'>
                <input type="text" className='filtroInput' placeholder='Procure por titulo, diretor, ano...' />

                <button className='filtroBtnBusca'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
            </div>
            <div className='divisaoFiltro2'>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <div className='cardSelecionaFiltro'>
                    <p className='textFiltro1'>Nome Filme</p>
                </div>
                <button className='btnFiltro'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-funnel-fill" viewBox="0 0 16 16">
                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                    </svg>
                </button>

            </div>

        </div>
    )
}