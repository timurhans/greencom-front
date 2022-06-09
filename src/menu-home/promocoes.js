import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import { useLocalStorage } from '../requests/greenHooks.js'

import React, { useState, useEffect,useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages'

const Promocoes = () => {
    const [token,setToken] = useLocalStorage("token",null)
    const [carrinhoId, setCarrinhoId] = useLocalStorage("carrinhoId",null)
    const message = useRef(null)
    const [promocoes,setPromocoes] = useState([])
    const [clienteId, ] = useLocalStorage("clienteId",null)

  
    useEffect(() => {
        getPromocoes()
        document.title = "Greenish B2B | Promocoes"
      }, [])

    const computaPromo = (id_promocao,id_condicao) =>{
        let url = api_address+'/promocoes/'+carrinhoId+'/'
        axios({
            method: 'GET',
            url: url,
            headers:{'Authorization': 'Token '+token},
            params:{
                id_promocao:id_promocao,
                id_condicao:id_condicao
              }
        }).then(res => {
            console.log(res)
            if(res['data']['confirmed']){
                message.current.show([
                    { severity: 'success', summary: res['data']['message'], sticky: false }
                ])
            }else{
                message.current.show([
                    { severity: 'error', summary: res['data']['message'], sticky: false }
                ])                
            }

        })

    }

    const removePromo = () =>{
        let url = api_address+'/promocoes/remove/'+carrinhoId+'/'
        axios({
            method: 'GET',
            headers:{'Authorization': 'Token '+token},
            url: url, 
        }).then(res => {
            message.current.show([
                { severity: 'success', summary: "Promoções Removidas com sucesso", sticky: false }
            ])
        })

    }

    const getPromocoes = () =>{
        let url = api_address+'/promocoes'
        if(clienteId != null){
            url = url +'/'+ clienteId
        }
        let params = {}
        if(carrinhoId != null){
            params['carrinhoId'] = carrinhoId
        }
        axios({
            method: 'GET',
            headers:{'Authorization': 'Token '+token},
            url: url,
            params:params
        }).then(res => {
            setPromocoes(res.data['promocoes'])
            console.log(res.data['promocoes'])
        })
    } 



    const actionBodyTemplate = (rowData) => {
        const elems = rowData.condicoes.slice()
        let elems_html = elems.map((val,index) =>
        <Button className="p-mr-2" label={val.desc_condicao} onClick={() => computaPromo(rowData.id_promocao,val.id)} />)
        return (
            <React.Fragment>
                {elems_html}
            </React.Fragment>
        );
    }

    return (
        <div>
            <Messages ref={message} />
            <div className="card">
                <DataTable value={promocoes} resizableColumns columnResizeMode="fit">
                    <Column field="descricao" header="Promocao" style={{width:'15%'}}></Column>
                    <Column field="atingido" header="Atingido" style={{width:'10%'}}></Column>
                    <Column header="Acoes" body={actionBodyTemplate} style={{width:'85%'}}></Column>
                </DataTable>
            </div>
            <Button className="p-d-block p-mx-auto p-mt-6" label={"Remover Promoções"} onClick={() => removePromo()} />
        </div>
    );
}

export default Promocoes