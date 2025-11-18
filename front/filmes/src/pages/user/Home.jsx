import GiraGira from '../../components/GiraGira/GiraGira'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import CardDecoretion1 from '../../assets/imgs/car-phase-movies.png'

import '../../styles/home.css'
import '../../index.css'

export default function Home() {
    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
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
                            <div className='LinkHomeAddFilmes'>

                            </div>
                        </div>
                    </div>
                </div>

                <figure className='imgCardDecoration1'>
                    <img src={CardDecoretion1} alt="Card com tons azuis, com as maiores frase sobre cinema em idiomas diferentes." />
                </figure>

                <Footer />
            </div>
        </main>
    )
}