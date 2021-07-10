// import React from 'react';
// import axios from 'axios'
// import { Button } from 'primereact/button';
// import { useLocalStorage } from '../requests/greenHooks.js'
// import { useState,useEffect } from 'react'
// import { confirmDialog } from 'primereact/confirmdialog'
// import  {api_address }  from '../proxy/proxy.js'


// export default function Clientes(props) {

//     const [clientes,setClientes] = useState([])
//     const [token,setToken] = useLocalStorage("token",null)
//     const [, setClienteId] = useLocalStorage("clienteId",null)
//     const [, setClienteNome] = useLocalStorage("clienteNome",null)
//     const [carrinhoId, setCarrinhoId] = useLocalStorage("carrinhoId",null)
  
//     useEffect(() => {
//         getClientes()
//         document.title = "Greenish B2B | Clientes"
//       }, [])

//     const confirma_alteracao = (id,nome) => {
//         confirmDialog({
//             message: 'Itens nao salvos no carrinho serao apagados. Confirma alteracao?',
//             header: 'Confirmacao',
//             icon: 'pi pi-exclamation-triangle',
//             acceptLabel:"Sim",
//             rejectLabel:"Nao",
//             accept: () => altera_cliente(id,nome)
//         })
//     }

//     const altera_cliente = (id,nome) =>{
//         axios({
//             method: 'GET',
//             headers: {'Authorization': 'Token '+token},
//             url: api_address+'/pedidos/deleta/'+carrinhoId,
//           })
//         setClienteId(id)
//         setClienteNome(nome)
//         setCarrinhoId(null)
//         window.location.href = '/'
//     }
    

//     const getClientes = () =>{
//         let url = api_address+'/clientes'
//         axios({
//             method: 'GET',
//             headers: {'Authorization': 'Token '+token},
//             url: url,
//         }).then(res => {
//             setClientes(res.data['clientes'])
//         })
//     } 
//     console.log(clientes)
//     const lista = clientes.slice()
//     let clientes_html = lista.map((val,index) => <div>
//         <p>{val.nome+" - "+val.tabela_precos}</p><Button label="Selecionar" onClick={() => confirma_alteracao(val.id,val.nome)} />
//         </div>)
//     return (
//         <div>
//             {clientes_html}
//         </div>
//     )
// }


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
        let url = api_address+'/clientes'
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
                    <Column field="razao_social" header="Razao Social" filter filterPlaceholder="Busca por Razao Social"></Column>             
                    <Column field="uf" header="UF"></Column>
                    <Column field="cidade" header="Cidade" filter filterPlaceholder="Busca por Cidade"></Column>
                    <Column field="tabela_precos" header="Tabela"></Column>
                    <Column field="desc_cond_pag" header="Condicao Pagamento"></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default Clientes