import React from "react";
import { useCartSearch,useLocalStorage } from '../requests/greenHooks.js'
import 'primeflex/primeflex.css';
import { useEffect, useState } from 'react'
import { Card } from 'primereact/card';
// import CardCarrinho from './cardCarrinho.js'
import CardCarrinho from './cardCarrinhoNovo.js'
import { Button } from 'primereact/button';
import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import  {api_address }  from '../proxy/proxy.js'
import { ToggleButton } from 'primereact/togglebutton';
import { SelectButton } from 'primereact/selectbutton';



export default function Carrinho() {

  const [listItems,setListItems] = useState(<div></div>)
  const [counter,setCounter] = useState(0)
  const [clienteId,setClienteId ] = useLocalStorage("clienteId",null)
  const [clienteNome,setClienteNome ] = useLocalStorage("clienteNome",null)
  const [carrinhoId,setCarrinhoId ] = useLocalStorage("carrinhoId",null)
  const [token,setToken] = useLocalStorage("token",null)
  const [isRep,setIsRep ] = useLocalStorage("isRep",null)
  const [displayModal, setDisplayModal] = useState(false)
  const [tipoPedido, setTipoPedido] = useState("Teste")
  const [tipoConta,] = useLocalStorage("tipoConta",null)

  const {
    carrinho,
    emptyMessage,
    observacoes,
    valorTotal,
    qtdTotal,
    razaoSocial
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

    if(tipoConta==="visitante"){
      axios({
        method: 'GET',
        url: api_address+'/pedidos/gera_pdf/'+carrinhoId+'/',
        headers: {'Authorization': 'Token '+token},        
      }).then(res => {
        if(res.data['confirmed']){
          window.open(api_address+'/'+res.data['file'],'popUpWindow')
          // window.location.href = 
        }else{
          console.log(res.data)
        }
      })
    }else{
      let isTeste = false
      if(tipoPedido === "Teste"){
        isTeste = true
      }
      axios({
          method: 'GET',
          url: api_address+'/pedidos/salva/'+carrinhoId+'/',
          headers: {'Authorization': 'Token '+token},
          params:{
            observacoes:observacoesNovo,
            isTeste: isTeste
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


  }

  return (
    <>
    <p>{emptyMessage}</p>
    
    <p>{"Cliente: "+razaoSocial + " | Valor Total: "+valorTotal+ " | Quantidade Total: "+qtdTotal}</p>
    <Button label="Salvar" onClick={() => setDisplayModal(true)} className="p-mr-2" />
    <Dialog header="Observacoes" visible={displayModal} onHide={()=>setDisplayModal(false)}>     
      <div>
          <InputTextarea rows={10} cols={50} value={observacoesNovo} onChange={(e) => setObservacoesNovo(e.target.value)} />
      </div>
      <div>
         <SelectButton value={tipoPedido} className="p-d-block p-mx-auto p-mt-2" options={["Teste","Real"]} onChange={(e) => setTipoPedido(e.value)} />
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





