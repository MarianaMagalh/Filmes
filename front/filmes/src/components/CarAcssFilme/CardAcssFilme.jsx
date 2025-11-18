import { Link } from 'react-router-dom'
import React from 'react';

import './cardAcssFilme.css'
import '../../index.css'

export default function CardAcssFilme({ filme, index }) {
  /* LÓGICA PARA MUDAR A IMG DOS CARD´S
     A CADA NOVO FILME ADICIONADO */
  // Isso aplica os fundos decorativos (card-filmes.png, card-filmes-verde.png)
  const backgrounds = ["bg1", "bg2", "bg3", "bg4"];
  const buttonColors = ["btnColor1", "btnColor2", "btnColor3", "btnColor4"];

  const variationIndex = index % 4;
  const bgClass = backgrounds[variationIndex];
  const btnClass = buttonColors[variationIndex];

  // 2. URL do poster (com uma imagem padrão de fallback)
  const posterUrl = filme.poster || 'https://via.placeholder.com/250x350?text=Sem+Poster';

  return (
    <div className={`containerCardFilmes ${bgClass}`}>

      <figure className="posterFilmeImg">
        <img
          src={posterUrl}
          alt={`Poster do filme ${filme.titulo}`}
        />
      </figure>


      {/* O Link agora usa o ID real do filme */}
      <Link to={`/SeeFilmes/${filme.id}`}>
        <button className={btnClass}>ACESSAR</button>
      </Link>

    </div>
  );
}
