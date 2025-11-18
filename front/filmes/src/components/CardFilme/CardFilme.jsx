import Sub from '../../assets/img-filme/image 41.png'

import './cardFilme.css'
import '../../index.css'

export default function CardFilme() {

    const movies = [
        { id: 1, title: "Longlegs" },
    ];
    const backgrounds = ["bg1", "bg2", "bg3", "bg4"];

    return (
        <div>
            {movies.map((movie, index) => {
                const variationIndex = index % 4;
                const bgClass = backgrounds[variationIndex];
                return (
                    <div key={movie.id} className={`containerCard ${bgClass}`}>
                        <figure className='imgFilmePoster'>
                            <img src={Sub} alt="" />
                        </figure>

                    </div>
                );
            })}
        </div>
    );
}
