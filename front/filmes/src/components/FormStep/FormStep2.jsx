import '../../styles/addFilme.css'

// Adicionei 'errors' nas props para mostrarmos as mensagens de validação
export default function FormStep2({ formData, handleChange, prevStep, handleSubmit, errors }) {
    return (
        <form className='formFilme' onSubmit={handleSubmit}>

            {/* --- LINGUAGEM --- */}
            <label className='labelFilme'>Linguagem</label>
            <input 
                className={`inputFilme ${errors && errors.linguagem ? 'input-error' : ''}`}
                type="text"
                name="linguagem" 
                value={formData.linguagem} 
                onChange={handleChange}
                placeholder='Insira a língua/idioma original do filme' 
            />
            {errors && errors.linguagem && <span className="error-message">{errors.linguagem}</span>}


            {/* --- PAÍS --- */}
            <label className='labelFilme'>País</label>
            <input 
                className={`inputFilme ${errors && errors.pais ? 'input-error' : ''}`}
                type="text"
                name="pais" 
                value={formData.pais} 
                onChange={handleChange}
                placeholder='Insira o país de origem do filme' 
            />


            {/* --- GÊNERO --- */}
            <label className='labelFilme'>Gênero</label>
            <input 
                className={`inputFilme ${errors && errors.genero ? 'input-error' : ''}`}
                type="text"
                name="genero" 
                value={formData.genero} 
                onChange={handleChange}
                placeholder='Insira o gênero do filme' 
            />
            {errors && errors.genero && <span className="error-message">{errors.genero}</span>}


            
            <label className='labelFilme'>Atores</label>
            <input 
                className='inputFilme' 
                type="text"
                name="atores" 
                value={formData.atores} 
                onChange={handleChange}
                placeholder='Insira no máximo cinco atores do filme' 
            />


            {/* --- SINOPSE --- */}
            <label className='labelFilme'>Sinopse</label>
            <textarea 
                className={`inputFilme ${errors && errors.sinopse ? 'input-error' : ''}`}
                name="sinopse" 
                value={formData.sinopse} 
                onChange={handleChange}
                placeholder='Insira a sinopse do filme' rows="4"
            ></textarea>
            {errors && errors.sinopse && <span className="error-message">{errors.sinopse}</span>}

            <div className='alinhaBotao'>
                <button className='btnCance' type="button" onClick={prevStep}>
                    VOLTAR
                </button>

                <button className='btnProximo' type="submit">
                    ADICIONAR
                </button>
            </div>
        </form>
    );
}