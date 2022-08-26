import './new.css'

import firebase from '../../services/firebaseConnection';
import {useHistory, useParams} from 'react-router-dom';

import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import { FiPlus } from 'react-icons/fi';


export default function New() {

    const {id} = useParams();
    const history = useHistory();

    const [loadCustomers, setloadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setcustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const [idCustomers, setIdCustomers] = useState(false);


    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        setCustomers([{ id: '1', nomeFantasia: 'FREELA' }]);
                        setloadCustomers(false);
                        return;
                    }
                    setCustomers(lista);
                    setloadCustomers(false);

                    if(id){
                        loadId(lista);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    setloadCustomers(false);
                    setCustomers([{ id: '1', nomeFantasia: '' }]);
                })
        }
        loadCustomers();
    }, [id])

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setcustomerSelected(index);
            setIdCustomers(true);
            

        })
        .catch((error)=>{
            setIdCustomers(false);
        })
    }



    async function handleRegister(e) {
        e.preventDefault();

        if(idCustomers){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success('Chamado editado com sucesso!');
            })
            .catch((error)=>{
                toast.error('Ops erro ao editar, tente novamente mais tarde.');
                setcustomerSelected(0);
                setComplemento('');
                history.push('/dashboard');
            })
            return;
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Chamado criado com sucesso!');
            setComplemento('');
            setcustomerSelected(0);
        })
        .catch((error)=>{
            toast.error('Ops erro ao registrar, tente novamente mais tarde.');
        })
        
    }
    //chamado quando troca o assunto
    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }
    //chamado quando troca o status
    function handleOptionChange(e) {
        setStatus(e.target.value)
    }
    //chamado quando troca de cliente
    function handleChangeCustomers(e) {
        setcustomerSelected(e.target.value);
    }


    return (
        <div>
            <Header />
            <div className='content'>
                <Title name='Novo chamado'>
                    <FiPlus size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..." />
                        ) : (

                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>
                        <label>Status</label>
                        <div className='status'>
                            <input type="radio" name='radio' value='Aberto' onChange={handleOptionChange} checked={status === "Aberto"} />
                            <span>Em Aberto</span>
                            <input type="radio" name='radio' value='Progresso' onChange={handleOptionChange} checked={status === "Progresso"} />
                            <span>Em Progresso</span>
                            <input type="radio" name='radio' value='Atendido' onChange={handleOptionChange} checked={status === "Atendido"} />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type='text' placeholder='Descreva seu problema (opcional)' value={complemento} onChange={(e) => setComplemento(e.target.value)} />

                        <button type="submit">Registrar</button>
                    </form>
                </div>

            </div>
        </div>
    )
}