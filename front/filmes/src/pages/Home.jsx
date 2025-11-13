import GiraGira from '../components/GiraGira/GiraGira'
import NavBar from '../components/NavBar/NavBar'
import '../styles/home.css'

export default function Home() {
    return (
        <main className='mainHome'>
            <GiraGira />
            <div className='mainOfc'>
                <div className='containerInfoHome'>
                    <NavBar />
                </div>

                <div className='containerLinks'>
                    <section className='filmesNovos'>
                        <h2 className='titleContainerNewMovies'>Recem Adicionados</h2>
                        <div id='recebeFilmesNovos'>

                        </div>

                    </section>
                    
                    <div className='containerDecoracao'>
                        <div className='bordaBranca'>

                        </div>
                    </div>

                </div>

            </div>
        </main>
    )
}