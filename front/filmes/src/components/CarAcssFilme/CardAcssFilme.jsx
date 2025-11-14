import './cardAcssFilme.css'
import '../../index.css'

export default function CardAcssFilme() {
  /* LÓGICA PARA MUDAR A IMG DOS CARD´S
     A CADA NOVO FILME ADICIONADO */
  const movies = [
    { id: 1, title: "Longlegs" },
    { id: 2, title: "Your Vains" },
    { id: 3, title: "Little Women" },
    { id: 4, title: "The Substance" },
    { id: 5, title: "Mickey 17" },
    { id: 6, title: "Central" },
  ];

  const backgrounds = ["bg1", "bg2", "bg3", "bg4"];
  const buttonColors = ["btnColor1", "btnColor2", "btnColor3", "btnColor4"];

  return (
    <div>
      {movies.map((movie, index) => {
        const variationIndex = index % 4;
        const bgClass = backgrounds[variationIndex];
        const btnClass = buttonColors[variationIndex];

        return (
          <div key={movie.id} className={`containerCardFilmes ${bgClass}`}>
            
            <button className={btnClass}>ACESSAR</button>
          </div>
        );
      })}
    </div>
  );
}
