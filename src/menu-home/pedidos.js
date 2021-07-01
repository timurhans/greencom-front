import React from 'react';
import axios from 'axios'
import { Button } from 'primereact/button';
import { useLocalStorage } from '../requests/greenHooks.js'
import { useState,useEffect,useRef } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Dialog } from 'primereact/dialog'
import { Messages } from 'primereact/messages'
import { confirmDialog } from 'primereact/confirmdialog'
import  {api_address }  from '../proxy/proxy.js'


export default function Pedidos(props) {

    const [pedidos,setPedidos] = useState([])
    const [carrinhoAtualId, setCarrinhoId] = useLocalStorage("carrinhoId",null)
    const [, setClienteId] = useLocalStorage("clienteId",null)
    const [, setClienteNome] = useLocalStorage("clienteNome",null)
    const [token,setToken] = useLocalStorage("token",null)
    const [displayModal, setDisplayModal] = useState(false)
    const message = useRef(null)
  
    useEffect(() => {
        getPedidos()
        document.title = "Greenish B2B | Pedidos"
      }, [])

    const confirma_alteracao = (carrrinhoId,id,nome) => {
        confirmDialog({
            message: 'Itens nao salvos no carrinho serao apagados. Confirma alteracao?',
            header: 'Confirmacao',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:"Sim",
            rejectLabel:"Nao",
            accept: () => alterar_pedido(carrrinhoId,id,nome)
        })
    }


    const alterar_pedido = (carrrinhoId,id,nome) =>{
        axios({
            method: 'GET',
            url: api_address+'/pedidos/retoma/'+carrrinhoId,
            headers: {'Authorization': 'Token '+token},
            params:{
                carrinhoAtualId:carrinhoAtualId
              },
          }).then(res => {
            if(res.data['confirmed']){
                setCarrinhoId(carrrinhoId)
                setClienteId(id)
                setClienteNome(nome)
                window.location.href = '/carrinho'
            }else{
                message.current.show([
                    { severity: 'error', summary: res.data['message'], sticky: false }
                ])
            }
          })
    }

    const processar = (pedidoId) =>{
        setDisplayModal(true)

        axios({
            method: 'GET',
            url: api_address+'/pedidos/processa/'+pedidoId,
            headers: {'Authorization': 'Token '+token}
          }).then(res => {
            setDisplayModal(false)
            if(res.data['confirmed']){
                console.log(res.data)
                getPedidos()
            }else{
                message.current.show([
                    { severity: 'error', summary: res.data['message'], sticky: true }
                ])
            }
          })
    }
    const getPedidos = () =>{
        let url = api_address+'/pedidos'
        axios({
            method: 'GET',
            url: url,
            headers: {'Authorization': 'Token '+token}
        }).then(res => {
            console.log(res.data)
            setPedidos(res.data['pedidos'])
        })
    }

    const lista = pedidos.slice()
    let pedidos_html = lista.map((val,index) => <div>
        <p>{val.id+" - "+val.user__name+" - "+val.cliente__nome+" - "+val.qtd_total+
            " - "+val.valor_total+" - "+val.liberado_cliente+" - "+val.liberado_rep+" - "+val.enviado_fabrica}
            </p>{val.liberado_rep ? <></>  : <Button label="Alterar" onClick={() => confirma_alteracao(val.id,val.cliente__id,val.cliente__nome)} />}
            {val.liberado_rep  ? <></>  : val.liberado_cliente  ? <Button label="Processar" onClick={() => processar(val.id)} /> : <></>}
        </div>)
    return (
        <div>
            <Messages ref={message} />
            <Dialog title="Processando" visible={displayModal} onHide={()=>""}><ProgressSpinner /></Dialog>
            {pedidos_html}
        </div>
    )
}