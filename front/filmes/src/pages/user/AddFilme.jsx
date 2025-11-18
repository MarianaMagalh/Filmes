import React, { useState, useEffect } from 'react'
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
    const { authData } = useAuth(); // Pega o token e dados de autenticação
    const [formData, setFormData] = useState({
        // Etapa 1
        poster: '', nomeDoFilme: '', tempoDeDuracao: '', anoDeLancamento: '',
        produtora: '', diretor: '',
        // Etapa 2
        linguagem: '', pais: '', genero: '', atores: '', sinopse: '',
    });

    const [errors, setErrors] = useState({});

    // Função genérica para atualizar qualquer campo do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        
        // Limpa o erro específico desse campo ao digitar
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    // Função para avançar (apenas se a Etapa 1 estiver completa)
    const nextStep = () => {
        // Só avança para a etapa 2 se a etapa 1 for válida
        if (validateForm(1)) { 
            setCurrentStep(2);
        } else {
            console.log("Validação da Etapa 1 falhou.", errors);
        }
    };

    const prevStep = () => setCurrentStep(1);


    // FUNÇÃO CHAVE: CONEXÃO COM O BACKEND PYTHON
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Valida ambas as etapas antes de enviar
        const isStep1Valid = validateForm(1);
        const isStep2Valid = validateForm(2);

        if (!isStep1Valid || !isStep2Valid) {
            alert("Existem erros no formulário. Por favor, corrija-os.");
            return; // Impede o envio
        }

        // 2. Transforma os dados para o formato esperado pela API
        const atoresList = formData.atores 
            ? formData.atores.split(',').map(ator => ator.trim()).filter(ator => ator) // Transforma "Ator 1, Ator 2" em ["Ator 1", "Ator 2"] e remove vazios
            : []; // Garante que seja um array vazio se o campo estiver vazio
        
        const dadosParaAPI = {
            titulo: formData.nomeDoFilme,
            ano: parseInt(formData.anoDeLancamento), // Garante que o ano seja um número
            produtora: formData.produtora, 
            genero: formData.genero,
            sinopse: formData.sinopse,
            poster: formData.poster,
            atores: atoresList, 
            // Adicione os outros campos: diretor, linguagem, pais, tempoDeDuracao
        };

        // 3. Lógica de Fetch (como antes)
        try {
            const response = await fetch(`${API_URL}/filmes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`, 
                },
                body: JSON.stringify(dadosParaAPI),
            });
            
            // ... (resto do tratamento de resposta e erro do fetch) ...
            
            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.error || 'Falha na requisição.');
            }

            alert("Filme adicionado com sucesso!");
            setCurrentStep(1); // Volta para a etapa 1
            setFormData({}); // Limpa o formulário

        } catch (err) {
            console.error('Erro ao adicionar filme:', err);
            alert('Erro ao enviar filme: ' + err.message);
        }
    };
    
    // Renderiza o componente da etapa correta
    const renderStep = () => {
        if (currentStep === 1) {
            return (
                <FormStep1
                    formData={formData}
                    handleChange={handleChange}
                    nextStep={nextStep}
                    errors={errors} // NOVO: Passando os erros
                />
            );
        } else {
            return (
                <FormStep2
                    formData={formData}
                    handleChange={handleChange}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit} 
                    errors={errors} // NOVO: Passando os erros
                />
            );
        }
    };

    // Valida os campos
    const validateForm = (step) => {
        const newErrors = {};
        
        // Validação da Etapa 1 (Conforme o Figma)
        if (step === 1) {
            if (!formData.nomeDoFilme) newErrors.nomeDoFilme = "O nome do filme é obrigatório.";
            if (!formData.anoDeLancamento) newErrors.anoDeLancamento = "O ano é obrigatório.";
            else if (isNaN(parseInt(formData.anoDeLancamento))) newErrors.anoDeLancamento = "O ano deve ser um número.";
            if (!formData.produtora) newErrors.produtora = "A produtora é obrigatória.";
            // Adicione outras validações da Etapa 1 aqui (Tempo, Diretor, Poster...)
        }

        // Validação da Etapa 2 (Conforme o Figma)
        if (step === 2) {
            if (!formData.genero) newErrors.genero = "O gênero é obrigatório.";
            if (!formData.sinopse) newErrors.sinopse = "A sinopse é obrigatória.";
            // Adicione outras validações da Etapa 2 aqui (Linguagem, País, Atores...)
        }

        setErrors(newErrors);
        // Retorna true se não houver erros (Object.keys(newErrors).length === 0)
        return Object.keys(newErrors).length === 0;
    };

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavBar />

                <h2 className='titlePag'>Adicionar (Etapa {currentStep}/2)</h2>

                <div className='containerAddEdit'>
                    <CardFilme />

                    {renderStep()}
                </div>

                <Footer />

            </div>
        </main>
    )
}