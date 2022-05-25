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
    const [clienteId, ] = useLocalStorage("clienteId",null)
    const [carrinhoId, ] = useLocalStorage("carrinhoId",null)
    const [observacaoItem, setObservacaoItem] = useState(props.produto.observacao_item)
    const [token,] = useLocalStorage("token",null)
    
    const {
        dadosPeriodo,
      } = UsePeriodos(produto.produto__produto,periodo)
    
      useEffect(() => {
        let [order,has_message] = calculatePedido(dadosPeriodo,produto)
        setPedido(order)    
      }, [dadosPeriodo])

      useEffect(() => {
        if (periodo !== ''){
            let tams = dadosPeriodo.map((val) => <LinhaDados dados={val} pedido={pedido} setPedido={setPedido}></LinhaDados>)
            setLinhasDados(tams)
        }
      }, [pedido])  



    const renderTamanhosGrid = () => {
        let prods_tams = JSON.parse(produto.produto__tamanhos)
        let tams = prods_tams.map((val) => <div className="p-col-1">{val}</div>)
        return tams
    }

        
    return (
        <div>
            <Messages ref={message} />
            <div className="p-grid">
                <div className="p-col">TIPO</div>
                <div className="p-col">COR</div>
                {renderTamanhosGrid()}
            </div>
            {linhasDados}
        </div>

    )
}

function LinhaDados(props){

    const handleChange = (valor,props,ordem) => {
        let ped_prov = props.pedido
        ped_prov[props.dados.cor][ordem] = valor
        props.setPedido(ped_prov)
    }

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
                    value={props.pedido[props.dados.cor][i]} onValueChange={(e) => handleChange(e.value,props,i)} mode="decimal" showButtons buttonLayout="vertical"
                    style={{width: '2.5em'}} decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />

            </div>
            )
        
    }
    return elems.map((val) => val)
}
 
    return (
        <div className="p-grid">
            <div className="p-col">{props.dados.desc_liberacao}</div>
            <div className="p-col">{props.dados.cor+" - "+props.dados.desc_cor}</div>
            {renderButtons(props)}

        </div>
    )

}


function validaQtdsPedido(qtdAtual,qtdMaxima){
    let qtds = []
    let item_has_message = false
    for (var i in qtdAtual){
        let dif = qtdMaxima[i]-qtdAtual[i]
        if (dif<0){
            qtds.push(qtdMaxima[i])
            item_has_message = true
        }else{
            qtds.push(qtdAtual[i])
        }
        
    }
    return [qtds,item_has_message]
}

function calculatePedido(dadosPeriodo,produto){
    let order = {}
    let orderAtual = JSON.parse(produto.qtds)
    let has_message = false
    for (var index in dadosPeriodo){
        let item = dadosPeriodo[index]
        let cor = item['cor']
        let qtds = new Array(produto.produto__qtd_tamanhos).fill(0)
        if(cor in orderAtual){
            if(item['liberacao']){
                qtds = orderAtual[cor]               
            }else{
                let [qtds_x,item_has_message] = validaQtdsPedido(orderAtual[cor],item['qtds'])
                qtds = qtds_x
                if (item_has_message) has_message=true
            }                
        }
        order[cor] = qtds
    }
    return [order,has_message]
}