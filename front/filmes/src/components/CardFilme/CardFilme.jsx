import { useState } from 'react';
import PlaceholderImg from '../../assets/img-comp/placeholder-card.png';

import './cardFilme.css'
import '../../index.css'

export default function CardFilme({ filme, index }) {
    // LÓGICA DE COR ALEATÓRIA
    // O useState com uma função garante que o número seja sorteado
    // apenas UMA vez quando a tela carrega (para não ficar piscando).
    const [randomIndex] = useState(() => Math.floor(Math.random() * 4));

    // Se alguém passar um 'index' (prop), usa ele. Se não, usa o aleatório.
    const finalIndex = index !== undefined ? index : randomIndex;

    const backgrounds = ["bg1", "bg2", "bg3", "bg4"];
    const bgClass = backgrounds[finalIndex % 4];

    // Verifica se existe um filme E se ele tem um poster preenchido
    const hasPoster = filme && filme.poster && filme.poster.trim() !== "";

    // SE NÃO TIVER POSTER
    if (!hasPoster) {
        return (
            <div className={`containerCard ${bgClass}`}>
                <figure className="imgFilmePoster">
                    <img
                        src={PlaceholderImg}
                        alt="Aguardando imagem..."
                    />
                </figure>
            </div>
        );
    }

    // SE TIVER POSTER
    return (
        <div className={`containerCard ${bgClass}`}>
            <figure className="imgFilmePoster">
                <img
                    src={filme.poster}
                    alt={`Poster de ${filme.titulo || 'filme'}`}
                />
            </figure>
        </div>
    )
}
