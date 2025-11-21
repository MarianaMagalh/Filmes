import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import GiraGira from '../../components/GiraGira/GiraGira'
import CardFilme from '../../components/CardFilme/CardFilme'

// Reutilizamos EXATAMENTE os mesmos componentes do Adicionar
import FormStep1 from '../../components/FormStep/FormStep1'
import FormStep2 from '../../components/FormStep/FormStep2'

import '../../styles/addFilme.css'
import '../../index.css'

const API_URL = 'http://localhost:8000'

export default function EditarFilme() {
    const { id } = useParams() // Pega o ID do filme da URL
    const navigate = useNavigate()
    const { authData } = useAuth()
    
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({})

    // Estado inicial igual ao do AddFilme
    const [formData, setFormData] = useState({
        poster: '', nomeFilme: '', duracao: '', anoLancamento: '',
        produtora: '', diretor: '', linguagem: '', pais: '', 
        genero: '', atores: '', sinopse: '',
    });

    // CARREGAR DADOS (A parte exclusiva do Editar)
    useEffect(() => {
        const fetchFilme = async () => {
            try {
                const response = await fetch(`${API_URL}/filmes/${id}`)
                if (!response.ok) throw new Error('Filme não encontrado')
                
                const data = await response.json();
                
                // TRADUÇÃO: Banco de Dados (API) -> Formulário (React)
                setFormData({
                    poster: data.poster || '',
                    nomeFilme: data.titulo || '',           
                    duracao: data.tempoDeDuracao || '',     
                    anoLancamento: data.ano || '',         
                    produtora: data.produtora || '',        
                    genero: data.genero || '',              
                    diretor: data.diretor || '',
                    linguagem: data.linguagem || '',
                    pais: data.pais || '',
                    sinopse: data.sinopse || '',
                    // Transforma o array de atores ["Ator 1", "Ator 2"] em string "Ator 1, Ator 2"
                    atores: data.atores ? data.atores.join(', ') : '', 
                });

            } catch (err) {
                console.error(err)
                alert("Erro ao carregar dados do filme.")
                navigate('/AllFilmes')
            } finally {
                setLoading(false)
            }
        };
        fetchFilme()
    }, [id, navigate])

    // Função padrão de atualizar input
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    };

    // VALIDAÇÃO (Igual ao AddFilme)
    const validateForm = (step) => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.nomeFilme) newErrors.nomeFilme = "O nome é obrigatório."
            if (!formData.anoLancamento) newErrors.anoLancamento = "O ano é obrigatório."
            if (!formData.produtora) newErrors.produtora = "A produtora é obrigatória."
            if (!formData.poster) newErrors.poster = "O poster é obrigatório."
        }
        if (step === 2) {
            if (!formData.genero) newErrors.genero = "O gênero é obrigatório."
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateForm(1)) setCurrentStep(2)
    }
    const prevStep = () => setCurrentStep(1)

    // SALVAR ALTERAÇÕES (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(2)) return

        // Transforma a string de atores de volta em array para a API
        const atoresList = formData.atores 
            ? formData.atores.split(',').map(a => a.trim()).filter(a => a) 
            : []

        // Formulário (React) -> Banco de Dados (API)
        const dadosParaAPI = {
            titulo: formData.nomeFilme,            
            ano: parseInt(formData.anoLancamento), 
            tempoDeDuracao: formData.duracao,
            produtora: formData.produtora,
            diretor: formData.diretor,
            genero: formData.genero,
            sinopse: formData.sinopse,
            poster: formData.poster,
            atores: atoresList,
            linguagem: formData.linguagem,
            pais: formData.pais
        }

        try {
            const response = await fetch(`${API_URL}/filmes/${id}`, {
                method: 'PUT', // <--- Método PUT para atualizar
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`, 
                },
                body: JSON.stringify(dadosParaAPI),
            });

            if (!response.ok) throw new Error('Erro ao atualizar');

            alert("Filme editado com sucesso!")
            navigate(`/SeeFilmes/${id}`) // Volta para a página de detalhes

        } catch (err) {
            console.error(err)
            alert('Erro: ' + err.message)
        }
    };

    // Renderiza o passo atual
    const renderStep = () => {
        if (currentStep === 1) {
            return <FormStep1 formData={formData} handleChange={handleChange} nextStep={nextStep} errors={errors} />
        } else {
            return <FormStep2 formData={formData} handleChange={handleChange} prevStep={prevStep} handleSubmit={handleSubmit} errors={errors} />
        }
    };

    if (loading) return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavBar />
                <p style={{textAlign:'center', marginTop:'50px'}}>Carregando dados...</p>
            </div>
        </main>
    );

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavBar />
                <h2 className='titlePag'>Editar Filme</h2>
                
                <div className='containerAddEdit'>
                    {/* Preview do Card */}
                    <CardFilme filme={formData} key={formData.poster} />
                    
                    {/* Formulário */}
                    {renderStep()}
                </div>
                
                <Footer />
            </div>
        </main>
    );
}