import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import { useLocalStorage } from '../requests/greenHooks.js'

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Carousel } from 'primereact/carousel';
import { InputTextarea } from 'primereact/inputtextarea';


const Solicitacoes = () => {
    const [token,setToken] = useLocalStorage("token",null)
    const [solicitacoes,setSolicitacoes] = useState([])
    const [solicitacao,setSolicitacao] = useState({})
    const [displayModal, setDisplayModal] = useState(false)

    const getSolicitacoes = () =>{
        let url = api_address+'/trade/get_solicitacoes'
        axios({
            method: 'GET',
            headers: {'Authorization': 'Token '+token},
            url: url,
        }).then(res => {
            console.log(res.data['solicitacoes'])
            setSolicitacoes(res.data['solicitacoes'])
        })
    } 

    useEffect(() => {
        getSolicitacoes()
        document.title = "Greenish B2B | Trade"
      }, [])

    const acao_tabela = (rowData) => {
        setSolicitacao(rowData)
        setDisplayModal(true)
    }

    const imagensSolicitacaoTemplate = (imagem) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3">
                        <img src={`https://ondasstr092020.blob.core.windows.net/greencom/${imagem.imagem_solicitacao_trade}`}  alt={"Sem Imagem"} className="product-image" />
                    </div>
                </div>
            </div>
        );
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="Visualizar" onClick={() => acao_tabela(rowData)} />
            </React.Fragment>
        );
    }

    return (
        <>
        <Dialog header={"Detalhes Solicitacao"} visible={displayModal} style={{ width: '75vw' }} onHide={() => setDisplayModal(false)}>
            <div className="p-grid">
                <div className="p-col-6">
                    <h4 >Material: {solicitacao.material}</h4>
                    <div className="card">
                        <div className="p-grid">
                        <div className="p-col-12">
                            <img src={`https://ondasstr092020.blob.core.windows.net/greencom/${solicitacao.material_opcao_imagem}`}
                                style={{ height: '200px'}}  alt={"escolher"} className="product-image" />
                            </div>
                        </div>
                        <div className="p-col-12">
                            <p >{solicitacao.material_descricao_longa}</p>
                        </div>
                    </div>
                </div>
                <div className="p-col-6">
                </div>
            </div>
            <h5>Observacoes</h5>
            <InputTextarea value={solicitacao.observacoes} rows={5} cols={30} disabled />
            <Carousel value={solicitacao.imagens} numVisible={3} numScroll={1} circular
                itemTemplate={imagensSolicitacaoTemplate} header={<h5>Imagens</h5>} />
        </Dialog>

        <div>
        <Button label="Fazer nova solicitacao" onClick={() => window.location.href = '/trade/solicitacao'} className="p-button p-button-rounded mr-2" />
            <div className="card">
                <DataTable value={solicitacoes}>
                    <Column field="cliente__razao_social" header="Cliente" filter filterPlaceholder="Buscar"></Column>
                    <Column field="material" header="Material"></Column>
                    <Column field="status" header="Status"></Column>     
                    <Column field="data_solicitacao" header="Data Solicitacao"></Column>
                    <Column field="previsao_envio" header="Previsao Envio"></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
        </div>
        </>

    );
}

export default Solicitacoes