import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import './trade.css';
import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import { useCartSearch,useLocalStorage } from '../requests/greenHooks.js'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';


const Trade = () => {
    const [token,setToken] = useLocalStorage("token",null)
    const [materials, setMaterials] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [materialEscolhido, setMaterialEscolhido] = useState({});
    const [materialOpcaoEscolhido, setMaterialOpcaoEscolhido] = useState({});
    const [displayModal, setDisplayModal] = useState(false)
    const [observacoes,setObservacoes] = useState("")
    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        document.title = "Greenish B2B | Trade Marketing"
        
        let url = api_address+'/trade/get_materiais'
        axios({
          method: 'GET',
          headers:{'Authorization': 'Token '+token},
          url: url,
        }).then(res => {
          console.log(res.data)
          if(res.data['confirmed']){
            setMaterials(res.data['materiais'])
            setClientes(res.data['clientes'])
          }
    
          console.log(res.data['clientes'])
        })
    
        
      
      }, [])


    const handleSave = () => {

        axios({
            method: 'GET',
            url: api_address+'/trade/salva_solicitacao',
            headers: {'Authorization': 'Token '+token},
            params:{
            observacoes:observacoes,
            clienteId: cliente.id,
            materialOpcaoId:materialOpcaoEscolhido.id
            }
            
        }).then(res => {
            if(res.data['confirmed']){
            window.location.href = '/trade/solicitacoes'
            }else{
            console.log(res.data)//Fazer Logica para mostrar mensagem de erro
            }
        })


    }


    const setMaterial = (material) => {
        setMaterialEscolhido(material)
        setDisplayModal(true)
    }

    const setMaterialOpcao = (materialOpcao) => {
        setMaterialOpcaoEscolhido(materialOpcao)
        setDisplayModal(false)
    }

    const materialTemplate = (material) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3">
                        <img src={`https://ondasstr092020.blob.core.windows.net/greencom/${material.imagem_material}`}  alt={material.descricao} className="product-image" />
                    </div>
                    <div>
                        <h4 className="mb-1">{material.descricao}</h4>
                        <h6 className="mt-0 mb-3">{material.descricao_longa}</h6>
                        <div className="car-buttons mt-5">
                            <Button icon="pi pi-search" onClick={() => setMaterial(material)} className="p-button p-button-rounded mr-2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const materialOpcaoTemplate = (materialOpcao) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3">
                        <img src={`https://ondasstr092020.blob.core.windows.net/greencom/${materialOpcao.imagem_material_opcao}`}  alt={materialOpcao.descricao} className="product-image" />
                    </div>
                    <div>
                        <h4 className="mb-1">{materialOpcao.descricao_opcao}</h4>
                        <h6 className="mt-0 mb-3">{`Prazo de Envio: ${materialOpcao.prazo_envio} dias`}</h6>
                        {/* <h6 className="mt-0 mb-3">{materialOpcao.descricao_longa}</h6> */}
                        <div className="car-buttons mt-5">
                            <Button icon="pi pi-search" className="p-button p-button-rounded mr-2" onClick={() => setMaterialOpcao(materialOpcao)}   />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <>
            <Dropdown placeholder="Selecione Cliente" id="dropdown" value={cliente} options={clientes}
            onChange={(e) => setCliente(e.value) } optionLabel="nome" //optionValue="id"
            />
            <InputTextarea rows={3} cols={200} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

        <Dialog header={"Escolha opcao de material"} maximizable visible={displayModal} style={{ width: '75vw' }} onHide={() => setDisplayModal(false)}>
            <div className="carousel-demo">

                <div className="card">
                    <Carousel value={materialEscolhido.opcoes} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                        itemTemplate={materialOpcaoTemplate} />
                </div>
            </div>

        </Dialog>
        <div className="carousel-demo">

            <div className="card">
                <Carousel value={materials} numVisible={2} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                    itemTemplate={materialTemplate} header={<h5>Teste</h5>} />
            </div>
        </div>

        

        <Button label="Salvar" className="p-d-block p-mx-auto p-mt-2" onClick={() => handleSave()} />

        </>
    );
}

export {Trade}
     