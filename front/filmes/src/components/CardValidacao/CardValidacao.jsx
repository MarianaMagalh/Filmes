import React from 'react'
import { Link } from 'react-router-dom'

import '../CarAcssFilme/cardAcssFilme.css'

export default function CardValidacao({ filme, index, onApprove, onReject }) {

    // Lógica para alternar as cores (igual ao CardAcssFilme)
    const backgrounds = ["bg1", "bg2", "bg3", "bg4"]
    // Lógica para alternar a cor dos botões (para combinar com o fundo)
    const buttonColors = ["btnColor1", "btnColor2", "btnColor3", "btnColor4"]

    const variationIndex = index % 4;
    const bgClass = backgrounds[variationIndex]
    const btnClass = buttonColors[variationIndex]

    // URL do poster (com fallback)
    const posterUrl = filme.poster || 'https://via.placeholder.com/250x350?text=Sem+Poster'

    return (
        <div className={`containerCardFilmes ${bgClass}`}>

            {/* Imagem do Poster (Clique leva aos detalhes, opcional) */}
            <Link to={`/SeeFilmes/${filme.id}`} className="link-poster-validacao">
                <figure className='posterFilmeImg'>
                    <img
                        src={posterUrl}
                        alt={`Poster de ${filme.titulo}`}
                    />
                </figure>
            </Link>

            {/* ÁREA DOS BOTÕES DE VALIDAÇÃO */}
            <div className="botoesValidacao">
                {/* Botão APROVAR (Thumbs Up) */}
                <button
                    className={`btnAcao ${btnClass}`}
                    onClick={() => onApprove(filme.id)}
                    title="Aprovar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="30" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                    </svg>
                </button>

                {/* Botão REPROVAR/DELETAR (Thumbs Down) */}
                <button
                    className={`btnAcao ${btnClass}`}
                    onClick={() => onReject(filme.id)}
                    title="Reprovar / Deletar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="30" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                        <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.856a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.478 12.437 0 11.5 0H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.536 2 2.154 2 3v4c0 .85.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
                    </svg>
                </button>
            </div>

        </div>
    )
}