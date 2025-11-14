import GiraGira from '../components/GiraGira/GiraGira'
import NavBar from '../components/NavBar/NavBar'
import Filtro from '../components/Filtro/Filtro'
import CardAcssFilme from '../components/CarAcssFilme/CardAcssFilme'

import '../styles/allFilmes.css'
import '../index.css'

export default function AllFilmes(){
    return(
        <main className='mainPadrao'>
            <GiraGira />

            <div className='formatacao'>
                <NavBar />

                <h2 className='titlePage'>Filmes</h2>

                <Filtro />

                <CardAcssFilme />
            </div>

        </main>
    )
}