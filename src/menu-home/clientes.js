import React from 'react';
import axios from 'axios'
import { Button } from 'primereact/button';
import { useLocalStorage } from '../requests/greenHooks.js'
import { useState,useEffect } from 'react'
import { confirmDialog } from 'primereact/confirmdialog'
import  {api_address }  from '../proxy/proxy.js'


export default function Clientes(props) {

    const [clientes,setClientes] = useState([])
    const [token,setToken] = useLocalStorage("token",null)
    const [, setClienteId] = useLocalStorage("clienteId",null)
    const [, setClienteNome] = useLocalStorage("clienteNome",null)
    const [carrinhoId, setCarrinhoId] = useLocalStorage("carrinhoId",null)
  
    useEffect(() => {
        getClientes()
        document.title = "Greenish B2B | Clientes"
      }, [])

    const confirma_alteracao = (id,nome) => {
        confirmDialog({
            message: 'Itens nao salvos no carrinho serao apagados. Confirma alteracao?',
            header: 'Confirmacao',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:"Sim",
            rejectLabel:"Nao",
            accept: () => altera_cliente(id,nome)
        })
    }

    const altera_cliente = (id,nome) =>{
        axios({
            method: 'GET',
            headers: {'Authorization': 'Token '+token},
            url: api_address+'/pedidos/deleta/'+carrinhoId,
          })
        setClienteId(id)
        setClienteNome(nome)
        setCarrinhoId(null)
        window.location.href = '/'
    }
    

    const getClientes = () =>{
        let url = api_address+'/clientes'
        axios({
            method: 'GET',
            headers: {'Authorization': 'Token '+token},
            url: url,
        }).then(res => {
            setClientes(res.data['clientes'])
        })
    } 

    const lista = clientes.slice()
    let clientes_html = lista.map((val,index) => <div>
        <p>{val.nome+" - "+val.tabela_precos}</p><Button label="Selecionar" onClick={() => confirma_alteracao(val.id,val.nome)} />
        </div>)
    return (
        <div>
            {clientes_html}
        </div>
    )
}