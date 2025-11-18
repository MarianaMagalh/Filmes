import '../../styles/addFilme.css'

export default function FormStep2({ formData, handleChange, prevStep, handleSubmit }) {
    return (
        // ATENÇÃO: A prop 'handleSubmit' do componente pai é passada aqui para o onSubmit
        <form className='formFilme' onSubmit={handleSubmit}>

            <label className='labelFilme'>Linguagem</label>
            <input className='inputFilme' type="text"
                value={formData.linguagem} onChange={handleChange}
                placeholder='Insira a língua/idioma original do filme' />


            <label className='labelFilme'>país</label>
            <input className='inputFilme' type="text"
                value={formData.pais} onChange={handleChange}
                placeholder='Insira o país de origem do filme' />


            <label className='labelFilme'>gênero</label>
            <input className='inputFilme' type="text"
                value={formData.genero} onChange={handleChange}
                placeholder='Insira o gênero do filme' />


            <label className='labelFilme'>atores</label>
            <input className='inputFilme' type="text"
                value={formData.poster} onChange={handleChange}
                placeholder='Insira no máximo cinco atores do filme' />


            <label className='labelFilme'>Sinopse</label>
            <textarea className='inputFilme' name="sinopse"
                value={formData.sinopse} onChange={handleChange}
                placeholder='Insira a sinopse do filme' rows="4"></textarea>

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