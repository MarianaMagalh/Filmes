import { Link } from 'react-router-dom'
import '../../styles/addFilme.css'

// FormStep1.jsx (Etapa 1: Dados básicos)
export default function FormStep1({ formData, handleChange, nextStep, errors }) {
    return (
        <form className='formFilme' onSubmit={(e) => e.preventDefault()}>
            {/* O formulário não envia aqui, só avança */}

            <label className='labelFilme'>Poster</label>
            <input className={`inputFilme ${errors.nomeFilme ? 'input-error' : ''}`}
                type="text"
                value={formData.nomeFilme}
                onChange={handleChange}
                placeholder='Insira a url do poster do filme' />
            {errors.poster && <span className="error-message">{errors.poster}</span>}


            <label className='labelFilme'>Nome Do Filme</label>
            <input className={`inputFilme ${errors.nomeFilme ? 'input-error' : ''}`}
                type="text"
                value={formData.nomeFilme}
                onChange={handleChange}
                placeholder='Insira o nome do filme' />
            {errors.nomeFilme && <span className="error-message">{errors.nomeFilme}</span>}

            <label className='labelFilme'>tempo de Duração</label>
            <input className={`inputFilme ${errors.duracao ? 'input-error' : ''}`}
                type="text"
                value={formData.duracao}
                onChange={handleChange}
                placeholder='Insira o tempo do filme em minutos' />
            {errors.duracao && <span className="error-message">{errors.duracao}</span>}

            <label className='labelFilme'>Ano de Lançamento</label>
            <input className={`inputFilme ${errors.anoLancamento ? 'input-error' : ''}`}
                type="text"
                value={formData.anoLancamento}
                onChange={handleChange}
                placeholder='Insira o Ano de lançamento do filme' />
            {errors.anoLancamento && <span className="error-message">{errors.anoLancamento}</span>}

            <label className='labelFilme'>Produtora</label>
            <input className={`inputFilme ${errors.produtora ? 'input-error' : ''}`}
                type="text"
                value={formData.produtora}
                onChange={handleChange}
                placeholder='Insira o nome da produtora do filme' />
            {errors.produtora && <span className="error-message">{errors.produtora}</span>}

            <label className='labelFilme'>Diretor</label>
            <input className={`inputFilme ${errors.diretor ? 'input-error' : ''}`}
                type="text"
                value={formData.diretor}
                onChange={handleChange}
                placeholder='Insira o nome do diretor do filme' />
            {errors.diretor && <span className="error-message">{errors.diretor}</span>}

            <div className='alinhaBotao'>
                <Link>
                    <button className='btnCance' type="button">Cancelar</button>
                </Link>
                <Link>
                    <button className='btnProximo' type="button" onClick={nextStep}>Proximo</button>
                </Link>
            </div>
        </form>
    );
}