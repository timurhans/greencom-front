import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import { useLocalStorage } from '../requests/greenHooks.js'
import { confirmDialog } from 'primereact/confirmdialog'

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [token,setToken] = useLocalStorage("token",null)
    const [, setClienteId] = useLocalStorage("clienteId",null)
    const [, setClienteNome] = useLocalStorage("clienteNome",null)
    const [carrinhoId, setCarrinhoId] = useLocalStorage("carrinhoId",null)

    const getClientes = () =>{
        let url = api_address+'/clientes/'
        axios({
            method: 'GET',
            headers: {'Authorization': 'Token '+token},
            url: url,
        }).then(res => {
            console.log(res.data['clientes'])
            setClientes(res.data['clientes'])
        })
    } 

    useEffect(() => {
        getClientes()
        document.title = "Greenish B2B | Clientes"
      }, [])

    const confirma_alteracao = (rowData) => {
        confirmDialog({
            message: 'Itens nao salvos no carrinho serao apagados. Confirma alteracao?',
            header: 'Confirmacao',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:"Sim",
            rejectLabel:"Nao",
            accept: () => altera_cliente(rowData.id,rowData.nome)
        })
    }

    const altera_cliente = (id,nome) =>{
        // axios({ --- EXCLUSAO INATIVADA
        //     method: 'GET',
        //     headers: {'Authorization': 'Token '+token},
        //     url: api_address+'/pedidos/deleta/'+carrinhoId,
        //   })
        setClienteId(id)
        setClienteNome(nome)
        setCarrinhoId(null)
        window.location.href = '/'
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="Selecionar" onClick={() => confirma_alteracao(rowData)} />
            </React.Fragment>
        );
    }

    return (
        <div>
            <div className="card">
                <DataTable value={clientes}>
                    <Column field="cnpj" header="CNPJ" filter filterPlaceholder="Buscar"></Column> 
                    <Column field="razao_social" header="Razao Social" filter filterPlaceholder="Buscar"></Column>             
                    <Column field="uf" header="UF"></Column>
                    <Column field="cidade" header="Cidade" filter filterPlaceholder="Buscar"></Column>
                    <Column field="tabela_precos" header="Tabela"></Column>
                    <Column field="desc_cond_pag" header="Condicao Pagamento"></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default Clientes