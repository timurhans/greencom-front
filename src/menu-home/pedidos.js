import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import { useLocalStorage } from '../requests/greenHooks.js'
import { confirmDialog } from 'primereact/confirmdialog'

import React, { useState, useEffect,useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Dialog } from 'primereact/dialog'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row';
import { formatMoney } from '../utils/utils.js';
import moment from 'moment';


const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [token,setToken] = useLocalStorage("token",null)
    const [, setClienteId] = useLocalStorage("clienteId",null)
    const [, setClienteNome] = useLocalStorage("clienteNome",null)
    const [carrinhoAtualId, setCarrinhoId] = useLocalStorage("carrinhoId",null)
    const [displayModal, setDisplayModal] = useState(false)
    const message = useRef(null)
    const [isRep,] = useLocalStorage("isRep",null)

    const getPedidos = () =>{
        let url = api_address+'/pedidos/'
        axios({
            method: 'GET',
            url: url,
            headers: {'Authorization': 'Token '+token}
        }).then(res => {
            setPedidos(res.data['pedidos'])
        })
    }

    useEffect(() => {
        getPedidos()
        document.title = "Greenish B2B | Pedidos"
      }, [])

      const confirma_alteracao = (rowData) => {
        confirmDialog({
            message: 'Itens nao salvos no carrinho serao apagados. Confirma alteracao?',
            header: 'Confirmacao',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:"Sim",
            rejectLabel:"Nao",
            accept: () => alterar_pedido(rowData.id,rowData.cliente__id,rowData.cliente__nome)
        })
    }


    const alterar_pedido = (carrrinhoId,id,nome) =>{
        axios({
            method: 'GET',
            url: api_address+'/pedidos/retoma/'+carrrinhoId+'/',
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


    const visualizar_pedido = (carrrinhoId,id,nome) =>{
        axios({
            method: 'GET',
            url: api_address+'/pedidos/retoma/'+carrrinhoId+'/',
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

    const processar = (rowData) =>{
        setDisplayModal(true)

        axios({
            method: 'GET',
            url: api_address+'/pedidos/processa/'+rowData.id+'/',
            headers: {'Authorization': 'Token '+token}
          }).then(res => {
            setDisplayModal(false)
            if(res.data['confirmed']){
                getPedidos()
            }else{
                message.current.show([
                    { severity: 'error', summary: res.data['message'], sticky: true }
                ])
            }
          })
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.liberado_rep ? <Button label="Visualizar" onClick={() => window.location.href = '/pedido/'+rowData.id} />  : <Button label="Alterar" onClick={() => confirma_alteracao(rowData)} />}
                {rowData.liberado_rep  ? <></>  : rowData.liberado_cliente && isRep ? <Button label="Processar" onClick={() => processar(rowData)} /> : <></>}
            </React.Fragment>
        );
    }

    console.log(pedidos)

    const enviado_template = (rowData) => {
        return rowData.enviado_fabrica ? <>Sim</>  : <>Não</>
    }
    const liberado_template = (rowData) => {
        return rowData.liberado_rep ? <>Sim</>  : <>Não</>
    }
    const is_teste_template = (rowData) => {
        return rowData.is_teste ? <>Sim</>  : <>Não</>
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'BRL'});
    }

    const valorTotalTemplate = (rowData) => {
        return `${formatCurrency(rowData.valor_total)}`;
    }

    const dateTemplate = (rowData) => {
        if(rowData.data_liberacao == null){
            return "..."
        }
        return moment(rowData.data_liberacao, "YYYY-MM-DDTHH:mm:ssZ").format('DD/MM/YYYY');
    }


    return (
        <div>
            <Messages ref={message} />
            <Dialog title="Processando" visible={displayModal} onHide={()=>""}><ProgressSpinner /></Dialog>
            <div className="card">
                <DataTable value={pedidos}>
                    <Column field="cliente__razao_social" header="Razao Social" filter filterPlaceholder="Buscar"></Column>
                    <Column field="colecao" header="Colecao" filter filterPlaceholder="Buscar"></Column>
                    <Column header="Valor" body={valorTotalTemplate}></Column>
                    <Column field="qtd_total" header="Qtd"></Column>
                    <Column field="cliente__desc_cond_pag" header="Cond Pag"></Column>
                    <Column body={dateTemplate} header="Data"></Column>
                    <Column field="liberado_rep" header="Liberado" body={liberado_template}></Column>
                    <Column field="enviado_fabrica" header="Enviado" body={enviado_template}></Column>
                    <Column field="codigo_erp" header="ID Ondas"></Column>
                    <Column header="Teste" body={is_teste_template}></Column>
                    <Column header="Acoes" body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default Pedidos