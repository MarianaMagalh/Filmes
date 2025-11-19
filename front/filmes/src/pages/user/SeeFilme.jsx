import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import GiraGira from '../../components/GiraGira/GiraGira'
import CardFilme from '../../components/CardFilme/CardFilme'

import '../../styles/seeFilme.css'
import '../../index.css'

const API_URL = 'http://localhost:8000';

export default function SeeFilme() {
    // Pega o ID da URL (Ex: /SeeFilmes/123 -> id = 123)
    const { id } = useParams();

    const navigate = useNavigate(); // Para redirecionar após deletar
    const { isAdmin, authData } = useAuth(); // Pega o token e status de admin

    // Estados para guardar o filme, o carregamento e erros
    const [filme, setFilme] = useState(null); // Guarda os dados do filme
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect para buscar o filme específico da API
    useEffect(() => {
        const fetchFilme = async () => {
            try {
                // Chama o endpoint do seu backend: GET /filmes/{id}
                const response = await fetch(`${API_URL}/filmes/${id}`);

                if (!response.ok) {
                    throw new Error('Filme não encontrado ou falha na API.');
                }

                const data = await response.json();
                setFilme(data); // Salva os dados do filme no estado

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Termina o carregamento
            }
        };

        fetchFilme();
    }, [id]); // Executa toda vez que o 'id' da URL mudar

    // Renderização condicional (Loading, Erro, Sucesso)
    if (loading) {
        return <p>Carregando detalhes do filme...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    if (!filme) {
        return <p>Filme não encontrado.</p>;
    }

    // --- FUNÇÃO DE DELETAR ---
    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja EXCLUIR este filme permanentemente?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/filmes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authData.token}` // Só admin tem token válido pra isso
                }
            });

            if (response.ok) {
                alert("Filme deletado com sucesso!");
                navigate('/AllFilmes'); // Volta para a lista
            } else {
                alert("Erro ao deletar filme.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    return (
        <main className='mainPadrao'>
            <GiraGira />
            <div className='formatacao'>
                <NavBar />

                <h1 className='titlePagFilme'>{filme.titulo}</h1>

                <div className='containerInfoFilme'>
                    <CardFilme filme={filme} />

                    <section className='infoFilme'>
                        <h3 className='movieTitle'>{filme.titulo}</h3>

                        <div className='conjuntoInfo'>
                            <div className='info'>
                                <h5 className='topico'>Tempo de Duração:</h5>
                                <p className='txtTopico paragrafo'>{filme.duracao || 'N/A'}</p>
                            </div>
                            <div className='info'>
                                <h5 className='topico'>Linguagem:</h5>
                                <p className='txtTopico paragrafo'>{filme.linguagem || 'N/A'}</p>
                            </div>
                        </div>
                        <div className='conjuntoInfo'>
                            <div className='info'>
                                <h5 className='topico'>Ano de Lançamento:</h5>
                                <p className='txtTopico paragrafo'>{filme.ano}</p>
                            </div>
                            <div className='info'>
                                <h5 className='topico'>País:</h5>
                                <p className='txtTopico paragrafo'>{filme.pais || 'N/A'}</p>
                            </div>
                        </div>
                        <div className='conjuntoInfo'>
                            <div className='info'>
                                <h5 className='topico'>Produtora:</h5>
                                <p className='txtTopico paragrafo'>{filme.produtora || 'N/A'}</p>
                            </div>
                            <div className='info'>
                                <h5 className='topico'>Gênero:</h5>
                                <p className='txtTopico paragrafo'>{filme.genero || 'N/A'}</p>
                            </div>
                        </div>
                        <div className='conjuntoInfo'>
                            <div className='info'>
                                <h5 className='topico'>Diretor:</h5>
                                <p className='txtTopico paragrafo'>{filme.diretor || 'N/A'}</p>
                            </div>
                            <div className='info'>
                                <h5 className='topico'>Atores:</h5>
                                {/* Converte o array de atores em string */}
                                <p className='txtTopico paragrafo'>{filme.atores ? filme.atores.join(', ') : 'N/A'}</p>
                            </div>
                        </div>
                        <div className='info'>
                            <h5 className='topico'>Sinopse:</h5>
                            <p className='txtTopico'>{filme.sinopse}</p>
                        </div>

                        <div className="botoes-acao">
                            {/* Botão EDITAR (Já existia) */}
                            {isAdmin && (
                                <Link to={`/EditarFilme/${filme.id}`}>
                                    <button className='btnEditar'>Editar</button>
                                </Link>
                            )}

                            {/* NOVO: Botão EXCLUIR (Só para Admin) */}
                            {isAdmin && (
                                <button
                                    onClick={handleDelete}
                                    className='btnExcluir'
                                    style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
                                >
                                    Excluir
                                </button>
                            )}
                        </div>
                    </section>

                </div>

                <Footer />
            </div>
        </main>
    )
}