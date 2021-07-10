import React from "react";
import { useCartSearch,useLocalStorage } from '../requests/greenHooks.js'
import 'primeflex/primeflex.css';
import { useEffect, useState } from 'react'
import { Card } from 'primereact/card';
import CardCarrinho from './cardCarrinho.js'
import { Button } from 'primereact/button';
import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import  {api_address }  from '../proxy/proxy.js'
import { ToggleButton } from 'primereact/togglebutton';



export default function Carrinho() {

  const [listItems,setListItems] = useState(<div></div>)
  const [counter,setCounter] = useState(0)
  const [clienteId,setClienteId ] = useLocalStorage("clienteId",null)
  const [clienteNome,setClienteNome ] = useLocalStorage("clienteNome",null)
  const [carrinhoId,setCarrinhoId ] = useLocalStorage("carrinhoId",null)
  const [token,setToken] = useLocalStorage("token",null)
  const [isRep,setIsRep ] = useLocalStorage("isRep",null)
  const [displayModal, setDisplayModal] = useState(false)
  const [isReal, setIsReal] = useState(false)

  const {
    carrinho,
    emptyMessage,
    observacoes,
    valorTotal,
    qtdTotal
  } = useCartSearch(counter,clienteId)

  const [observacoesNovo,setObservacoesNovo] = useState("")

  const updateCounter = () => {
    setCounter(prevCounter => prevCounter+1)
  }

  useEffect(() => {
    document.title = "Greenish B2B | Carrinho"
  }, [])

  useEffect(() => {
    setObservacoesNovo(observacoes)
  }, [observacoes])

  useEffect(() => {
    const lista = carrinho
    let listItemsProv = <div className="p-col-12 p-md-6 p-lg-3"></div>
    if (lista.length>0){
      listItemsProv = lista.map((val,index) => 
      <div className="p-col-12 p-md-12 p-lg-12">
        <CardPeriodo forceUpdate={updateCounter} periodoAtual={val.periodo} qtd_periodo={val.qtd_periodo}
        valor_periodo={val.valor_periodo} itens={val.itens} key={index}></CardPeriodo>
        </div>)
    }
    setListItems(listItemsProv)
  }, [carrinho,emptyMessage,carrinhoId,counter])

  const handleSave = () => {
    console.log(!isReal)
    axios({
        method: 'GET',
        url: api_address+'/pedidos/salva/'+carrinhoId+'/',
        headers: {'Authorization': 'Token '+token},
        params:{
          observacoes:observacoesNovo,
          isTeste: !isReal
        }
        
      }).then(res => {
        if(res.data['confirmed']){
          if(isRep){
            setClienteId(null)
            setClienteNome(null)
            setCarrinhoId(null)
          }else{
            setCarrinhoId(null)
          }
          window.location.href = '/pedidos'
        }else{
          console.log(res.data)//Fazer Logica para mostrar mensagem de erro
        }
      })
  }

  return (
    <>
    <p>{emptyMessage}</p>
    
    <p>{"Cliente: "+clienteNome + " | Valor Total: "+valorTotal+ " | Quantidade Total: "+qtdTotal}</p>
    <Button label="Salvar" onClick={() => setDisplayModal(true)} className="p-mr-2" />
    <Dialog header="Observacoes" visible={displayModal} onHide={()=>setDisplayModal(false)}>     
      <div>
          <InputTextarea rows={10} cols={50} value={observacoesNovo} onChange={(e) => setObservacoesNovo(e.target.value)} />
      </div>
      <div>
        <ToggleButton checked={isReal} className="p-d-block p-mx-auto p-mt-2" onChange={(e) => setIsReal(e.value)}
         onLabel="Real" offLabel="Teste" onIcon="pi pi-check" offIcon="pi pi-times" style={{width: '10em'}} />
      </div>
      <div>
        <Button label="Salvar" className="p-d-block p-mx-auto p-mt-2" onClick={() => handleSave()} />
      </div>


      
      
    </Dialog>
    <div className="p-grid">{listItems}</div>
    </>
  )
}


function CardPeriodo(props){
  const lista = props.itens.slice()
  let listItemsProv = <div className="p-col-12 p-md-6 p-lg-3">Entrou</div>
  listItemsProv = lista.map((val,index) => <div className="p-col-6 p-md-6 p-lg-2">
    <CardCarrinho periodoAtual={props.periodoAtual} forceUpdate={props.forceUpdate} produto={val} key={index}></CardCarrinho>
    </div>)

  return (
    <Card title={props.periodoAtual+" - "+props.qtd_periodo+" - "+props.valor_periodo}>
      <div className="p-grid">
    {listItemsProv}
    </div>
  </Card>
  )
}





