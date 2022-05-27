import { InputNumber } from 'primereact/inputnumber';
import { useEffect, useState,useRef } from 'react'
import { Messages } from 'primereact/messages'
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { formatMoney } from '../utils/utils.js';
import  UsePeriodos,{useLocalStorage }  from '../requests/greenHooks.js'
import { Chip } from 'primereact/chip';

import 'primeflex/primeflex.css';

export default function CardItemPedido(props) {
    const [displayModal, setDisplayModal] = useState(false)
    const [token,] = useLocalStorage("token",null)
    const [panelCollapsed,setPanelCollapsed] = useState(true)
    const message = useRef(null)


    const onClick = () => {
        setDisplayModal(true)
    }
    const onHide = () => {
        setDisplayModal(false)
    }


    const preco_desc = props.produto.preco-props.produto.desconto
    const preco_normal =  props.produto.preco//colocar linha cortando text
    const header = <div>
        <h4>{props.produto.produto__descricao + " - " + props.produto.produto__produto}</h4>
        <p>{"Qtd: "+props.produto.qtd_item +" | Valor: "+ formatMoney(props.produto.valor_item) }</p>
        <p>{"Qtd Entregar: "+props.produto.qtd_item_entregar}</p>
        {props.produto.desconto>0 ?  <Chip label={"Preço: De "+formatMoney(preco_normal)+" por R$"+ formatMoney(preco_desc)} />  : <Chip label={"Preço: "+ formatMoney(props.produto.preco)} />  }
        </div>

    return (
        <div className="p-shadow-2 p-m-2">
        <Card header={header}>
            <Messages ref={message} />
            <img top width="100%" src={props.produto.produto__url_imagem} alt="Sem Imagem" />
            <div className="p-grid">
            <Button label="Detalhes" onClick={() => onClick()} className="p-mr-2" />
            </div>
                <div className="p-field p-col-12 p-md-3">

                    <Dialog header={props.produto.produto__produto} maximizable visible={displayModal} style={{ width: '75vw' }} onHide={() => onHide()}>
                        <div className="p-grid">
                            <div className="p-col">
                                <img top width="100%" src={props.produto.produto__url_imagem} alt="Sem Imagem" />
                            </div>
                            <div className="p-col-fixed" style={{ width: '500px'}}>
                                <TableProds
                                 periodoAtual={props.periodoAtual} produto={props.produto} 
                                 hideModal={onHide}>
                                 </TableProds>
                            </div>  
                        </div>

                    </Dialog>
                </div>
        </Card>
        </div>
        
    )
}
function TableProds(props) {
    const [produto, ] = useState(props.produto)
    const [periodo, ] = useState(props.periodoAtual)
    const [pedido, setPedido] = useState({})
    const message = useRef(null)
    const [linhasDados, setLinhasDados] = useState(<div></div>)    

      useEffect(() => {
          let map_list = calculatePedido(produto)
          let pedido = JSON.parse(produto.qtds)
        if (periodo !== ''){
            console.log(pedido)
            let tams = map_list.map((val) => <LinhaDados dados={val} pedido={pedido}></LinhaDados>)
            setLinhasDados(tams)
        }
      }, [])  



    const renderTamanhosGrid = () => {
        let prods_tams = JSON.parse(produto.produto__tamanhos)
        let tams = prods_tams.map((val) => <div className="p-col-1">{val}</div>)
        return tams
    }
        
    return (
        <div>
            <Messages ref={message} />
            <div className="p-grid">
                <div className="p-col">COR</div>
                {renderTamanhosGrid()}
            </div>
            {linhasDados}
        </div>

    )
}

function LinhaDados(props){

    const renderButtons = (props) => {
        let elems = []
        if(Object.keys(props.pedido).length === 0){
            return elems.map((val) => val)
        }
        for (var idx in props.dados.qtds){

            let i = idx

            elems.push(
            <div className="p-col-1 p-mt-4">
                    <InputNumber min={0} id={props.dados.cor+i} disabled={true}
                    value={props.pedido[props.dados.cor][i]} mode="decimal" showButtons buttonLayout="vertical"
                    style={{width: '2.5em'}} decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            </div>
            )
        
    }
    return elems.map((val) => val)
}
 
    return (
        <div className="p-grid">
            <div className="p-col">{props.dados.cor}</div>
            {renderButtons(props)}

        </div>
    )

}



function calculatePedido(produto){
    let order = {}
    let orderAtual = JSON.parse(produto.qtds)
    order = []
    for(var key in orderAtual){
        let order_item = {}
        order_item['cor'] = key
        order_item['qtds'] = orderAtual[key]
        order.push(order_item)
    }
    return order
}

