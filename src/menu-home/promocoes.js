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
            message.current.show([
                { severity: 'success', summary: "Promoção computada com sucesso", sticky: false }
            ])
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
        let url = api_address+'/promocoes/'
        axios({
            method: 'GET',
            headers:{'Authorization': 'Token '+token},
            url: url,
        }).then(res => {
            setPromocoes(res.data['promocoes'])
            console.log(res.data['promocoes'])
        })
    } 



    const actionBodyTemplate = (rowData) => {
        const elems = rowData.condicoes.slice()
        let elems_html = elems.map((val,index) =>
        <Button className="p-mr-2" label={rowData.tipo_condicao+" - "+val.condicao} onClick={() => computaPromo(rowData.id_promocao,val.id)} />)
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
                <DataTable value={promocoes}>
                    <Column field="descricao" header="Promocao"></Column>
                    <Column header="Acoes" body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
            <Button className="p-d-block p-mx-auto p-mt-6" label={"Remover Promoções"} onClick={() => removePromo()} />
        </div>
    );
}

export default Promocoes