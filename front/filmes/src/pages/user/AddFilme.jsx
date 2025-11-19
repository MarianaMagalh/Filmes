import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import GiraGira from '../../components/GiraGira/GiraGira'
import CardFilme from '../../components/CardFilme/CardFilme'
import FormStep1 from '../../components/FormStep/FormStep1'
import FormStep2 from '../../components/FormStep/FormStep2'

import '../../styles/addFilme.css'
import '../../index.css'

const API_URL = 'http://localhost:8000';

export default function AddFilme() {
    const [currentStep, setCurrentStep] = useState(1);
    const { authData } = useAuth(); 
    
    // 1. ESTADO (Nomes novos)
    const [formData, setFormData] = useState({
        poster: '',
        nomeFilme: '',    // CORRETO
        duracao: '',      // CORRETO
        anoLancamento: '',// CORRETO
        produtora: '', 
        diretor: '',
        // Etapa 2
        linguagem: '', 
        pais: '', 
        genero: '', 
        atores: '', 
        sinopse: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));

        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    // 2. VALIDAÇÃO CORRIGIDA (Usa os nomes novos)
    const validateForm = (step) => {
        const newErrors = {};

        if (step === 1) {
            // CORRIGIDO: nomeDoFilme -> nomeFilme
            if (!formData.nomeFilme) newErrors.nomeFilme = "O nome do filme é obrigatório.";
            
            // CORRIGIDO: anoDeLancamento -> anoLancamento
            if (!formData.anoLancamento) newErrors.anoLancamento = "O ano é obrigatório.";
            else if (isNaN(parseInt(formData.anoLancamento))) newErrors.anoLancamento = "O ano deve ser um número.";
            
            if (!formData.produtora) newErrors.produtora = "A produtora é obrigatória.";
            
            // CORRIGIDO: Adicionei validação para duração e diretor que estavam faltando no seu check
            if (!formData.duracao) newErrors.duracao = "A duração é obrigatória.";
            if (!formData.diretor) newErrors.diretor = "O diretor é obrigatório.";
        }

        if (step === 2) {
            if (!formData.genero) newErrors.genero = "O gênero é obrigatório.";
            if (!formData.sinopse) newErrors.sinopse = "A sinopse é obrigatória.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateForm(1)) {
            setCurrentStep(2);
        } else {
            console.log("Validação falhou:", errors);
        }
    };

    const prevStep = () => setCurrentStep(1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isStep1Valid = validateForm(1);
        const isStep2Valid = validateForm(2);

        if (!isStep1Valid || !isStep2Valid) {
            alert("Existem erros no formulário. Por favor, corrija-os.");
            return; 
        }

        const atoresList = formData.atores
            ? formData.atores.split(',').map(ator => ator.trim()).filter(ator => ator) 
            : [];

        // 3. ENVIO PARA API CORRIGIDO (Mapeia nomes novos para a API)
        const dadosParaAPI = {
            titulo: formData.nomeFilme,           // CORRIGIDO: nomeDoFilme -> nomeFilme
            ano: parseInt(formData.anoLancamento),// CORRIGIDO: anoDeLancamento -> anoLancamento
            tempoDeDuracao: formData.duracao,     // Adicionado
            produtora: formData.produtora,
            diretor: formData.diretor,            // Adicionado
            genero: formData.genero,
            sinopse: formData.sinopse,
            poster: formData.poster,
            atores: atoresList,
            linguagem: formData.linguagem,
            pais: formData.pais
        };

        try {
            const response = await fetch(`${API_URL}/filmes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify(dadosParaAPI),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha na requisição.');
            }

            alert("Filme adicionado com sucesso!");
            
            // Resetar formulário
            setCurrentStep(1);
            setFormData({
                poster: '', nomeFilme: '', duracao: '', anoLancamento: '',
                produtora: '', diretor: '', linguagem: '', pais: '', 
                genero: '', atores: '', sinopse: '',
            });

        } catch (err) {
            console.error('Erro ao adicionar filme:', err);
            alert('Erro ao enviar filme: ' + err.message);
        }
    };

    const renderStep = () => {
        if (currentStep === 1) {
            return (
                <FormStep1
                    formData={formData}
                    handleChange={handleChange}
                    nextStep={nextStep}
                    errors={errors}
                />
            );
        } else {
            return (
                <FormStep2
                    formData={formData}
                    handleChange={handleChange}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                    errors={errors}
                />
            );
        }
    };

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavBar />

                <h2 className='titlePag'>Adicionar (Etapa {currentStep}/2)</h2>

                <div className='containerAddEdit'>
                    <CardFilme
                        filme={formData}        
                        key={formData.poster}   
                    />

                    {renderStep()}
                </div>

                <Footer />
            </div>
        </main>
    )
}