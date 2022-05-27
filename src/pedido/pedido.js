import React from "react";
import { useCartSearch,useLocalStorage } from '../requests/greenHooks.js'
import 'primeflex/primeflex.css';
import { useEffect, useState } from 'react'
import { Card } from 'primereact/card';
// import CardCarrinho from './cardCarrinho.js'
import CardItemPedido from './cardItemPedido.js'
import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { formatMoney } from '../utils/utils.js';


export default function Pedido() {

  const [listItems,setListItems] = useState(<div></div>)  
  const [token,setToken] = useLocalStorage("token",null)

  const [pedido,setPedido ] = useState([])
  const [emptyMessage,setEmptyMessage ] = useState(null)
  const [valorTotal,setValorTotal ] = useState(null)
  const [qtdTotal,setQtdTotal ] = useState(null)
  const [valorTotalEntregar,setValorTotalEntregar ] = useState(null)
  const [qtdTotalEntregar,setQtdTotalEntregar ] = useState(null)
  const [razaoSocial,setRazaoSocial ] = useState(null)

  useEffect(() => {
    document.title = "Greenish B2B | Carrinho"


    const pathIdPedido = window.location.href
    const idPedido = pathIdPedido.substring(pathIdPedido.lastIndexOf('/') + 1)

    let url = api_address+'/pedido/'+idPedido
    axios({
      method: 'GET',
      headers:{'Authorization': 'Token '+token},
      url: url,
    }).then(res => {
      console.log(res.data)
      if(res.data['confirmed']){
        setPedido(res.data['dados'])
        setRazaoSocial(res.data['razao_social'])
        setEmptyMessage(res.data['message'])
        setValorTotal(res.data['valor_total'])
        setQtdTotal(res.data['qtd_total'])
        setValorTotalEntregar(res.data['valor_total_entregar'])
        setQtdTotalEntregar(res.data['qtd_total_entregar'])
      }

      console.log(res.data['dados'])
    })

    
  
  }, [])


  useEffect(() => {
    const lista = pedido
    let listItemsProv = <div className="p-col-12 p-md-6 p-lg-3"></div>
    if (lista.length>0){
      listItemsProv = lista.map((val,index) => 
      <div className="p-col-12 p-md-12 p-lg-12">
        <CardPeriodo periodoAtual={val.periodo} qtd_periodo={val.qtd_periodo} valor_periodo={val.valor_periodo}
        qtd_periodo_entregar={val.qtd_periodo_entregar} valor_periodo_entregar={val.valor_periodo_entregar}
        itens={val.itens} key={index}></CardPeriodo>
        </div>)
    }
    setListItems(listItemsProv)
  }, [pedido,emptyMessage])


  return (
    <>
    <p>{emptyMessage}</p>
    <Chip label={"Cliente: "+razaoSocial} />
    <Chip label={"Quantidade Total: "+qtdTotal} />
    <Chip label={"Quantidade a Total Entregar: "+qtdTotalEntregar} />
    <Chip label={"Valor Total: "+formatMoney(valorTotal)} />
    <Chip label={"Valor Total a Entregar: "+formatMoney(valorTotalEntregar)} />
    {/* <Button className="p-button-secondary" label={"Cliente: "+razaoSocial} disabled />
    <Button className="p-button-secondary" label={"Valor Total: "+formatMoney(valorTotal)} disabled />
    <Button className="p-button-secondary" label={"Quantidade Total: "+qtdTotal} disabled />  */}
    
    {/* <p>{"Cliente: "+razaoSocial + " | Valor Total: "+valorTotal+ " | Quantidade Total: "+qtdTotal}</p> */}
    <div className="p-grid">{listItems}</div>
    </>
  )
}


function CardPeriodo(props){
  console.log(props)
  const lista = props.itens.slice()
  let listItemsProv = <div className="p-col-12 p-md-6 p-lg-3">Entrou</div>
  listItemsProv = lista.map((val,index) => <div className="p-col-6 p-md-6 p-lg-2">
    <CardItemPedido periodoAtual={props.periodoAtual} produto={val} key={index}></CardItemPedido>
    </div>)

  return (
    <Card title={props.periodoAtual}>
    <p>{"Quantidade Periodo: "+props.qtd_periodo + " | Valor Periodo: "+ formatMoney(props.valor_periodo)}</p>
    <p>{"Quantidade Periodo a Entregar: "+props.qtd_periodo_entregar + " | Valor Periodo a Entregar: "+ formatMoney(props.valor_periodo_entregar)}</p>
    <div className="p-grid">

    {listItemsProv}
    </div>
  </Card>
  )
}





