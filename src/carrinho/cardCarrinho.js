import { InputNumber } from 'primereact/inputnumber';
import { useEffect, useState,useRef } from 'react'
import { Messages } from 'primereact/messages'
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import  UsePeriodos,{useLocalStorage }  from '../requests/greenHooks.js'
import Cookies from 'js-cookie'
import axios from 'axios'
import { confirmDialog } from 'primereact/confirmdialog'
import 'primeflex/primeflex.css';
import  {api_address }  from '../proxy/proxy.js'

export default function CardCarrinho(props) {
    const [displayModal, setDisplayModal] = useState(false)
    const [token,setToken] = useLocalStorage("token",null)


    const onClick = () => {
        setDisplayModal(true)
    }
    const onHide = () => {
        setDisplayModal(false)
    }
    const confirma_exclusao = () => {
        confirmDialog({
            message: 'Confirma a exclusao do produto?',
            header: 'Confirmacao',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:"Sim",
            rejectLabel:"Nao",
            accept: () => handleDelete()
        })
    }
    const handleDelete = () => {
        axios({
            method: 'GET',
            url: api_address+'/carrinho/delete_item/'+props.produto.id,
            headers: {'Authorization': 'Token '+token}
          }).then(res => {
            props.forceUpdate()
          })
    }

    const preco_desc = props.produto.preco-props.produto.desconto
    const preco_normal =  props.produto.preco//colocar linha cortando text
    const header = <div>
        <h3>{props.produto.produto__descricao}</h3>
        <p>{props.produto.qtd_item +" - R$"+ props.produto.valor_item}</p>
        <p>{props.produto.produto__produto +" - R$"+ props.produto.preco}</p>
        {props.produto.desconto>0 ?  <p>{preco_normal +" - R$"+ preco_desc}</p>  : <p>{props.produto.produto__produto +" - R$"+ props.produto.preco}</p>  }
        </div>

    return (
        <div className="p-shadow-2 p-m-2">
        <Card header={header}>
            <img top width="100%" src={props.produto.produto__url_imagem} alt="Sem Imagem" />
            <div className="p-grid">
                <Button label="Alterar" onClick={() => onClick()} className="p-mr-2" />
                <Button label="Remover" onClick={() => confirma_exclusao()}  />
                <div className="p-field p-col-12 p-md-3">

                    <Dialog header={props.produto.produto__produto} maximizable visible={displayModal} style={{ width: '75vw' }} onHide={() => onHide()}>
                        <div className="p-grid">
                            <div className="p-col">
                                <img top width="100%" src={props.produto.produto__url_imagem} alt="Sem Imagem" />
                            </div>
                            <div className="p-col-fixed" style={{ width: '500px'}}>
                                <TableProds
                                 periodoAtual={props.periodoAtual} produto={props.produto} 
                                 forceUpdate={props.forceUpdate} hideModal={onHide}>

                                 </TableProds>
                            </div>  
                        </div>

                    </Dialog>
                </div>
            </div>
        </Card>
        </div>
        
    )
}

function TableProds(props) {
    const [produto, ] = useState(props.produto)
    const [periodo, setPeriodo] = useState('')
    const [pedido, setPedido] = useState({})
    const [optionsPeriodos, ] = useState(calculateOptionsPeriodos(produto.produto__periodos,props.periodoAtual))
    const [messageDifs, setMessageDifs] = useState(false)
    const message = useRef(null)
    const [linhasDados, setLinhasDados] = useState(<div></div>)
    const [clienteId, ] = useLocalStorage("clienteId",null)
    const [carrinhoId, ] = useLocalStorage("carrinhoId",null)
    const [token,setToken] = useLocalStorage("token",null)
    
    const {
        dadosPeriodo,
      } = UsePeriodos(produto.produto__produto,periodo)
    
      useEffect(() => {
        let order = calculatePedido(dadosPeriodo,produto)
        setPedido(order)

        if (messageDifs){
            message.current.show([
                { severity: 'error',
                 summary: "Periodo selecionado nao tem disponivel todas as quantidades digitadas - Verifique as quantidades digitadas",
                sticky: true }
            ])            
        }else{
            message.current.clear()
        }
    
      }, [dadosPeriodo,messageDifs])

      useEffect(() => {
        if (periodo !== ''){
            let tams = dadosPeriodo.map((val) => <LinhaDados dados={val} pedido={pedido} setPedido={setPedido}></LinhaDados>)
            setLinhasDados(tams)
        }
      }, [pedido])  

    const validaQtdsPedido = (qtdAtual,qtdMaxima) =>{
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


    const calculatePedido = (dadosPeriodo,produto) =>{
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
        setMessageDifs(has_message)

        return order
    }


    const renderTamanhosGrid = () => {
        let prods_tams = JSON.parse(produto.produto__tamanhos)
        let tams = prods_tams.map((val) => <div className="p-col-1">{val}</div>)
        return tams
    }

    const handleSubmit = () => {
        let qtd_total = 0
        for (var index in pedido){
            let qtds_cor = pedido[index]
            qtd_total = qtd_total + qtds_cor.reduce((a,b) => a+b,0)
        }
        var data = {
            "produto":produto,
            "periodo":periodo,
            "qtds":pedido,
            "qtd_total":qtd_total,
            "clienteId":clienteId,
            "carrinhoId":carrinhoId,
        }
        var config = {
            headers: {'Authorization': 'Token '+token}
        }
    
        axios.post(api_address+'/carrinho/update/'+produto.id,data,config,)
        .then(function (response){
            if (response.data['confirmed']){
                message.current.show([
                    { severity: 'success', summary: response.data['message'], sticky: true }
                ])
                props.forceUpdate()
                props.hideModal()
            }else{
                message.current.show([
                    { severity: 'error', summary: response.data['message'], sticky: true }
                ])
            }

        }).catch(error => {
            console.log(error.message)
       })
    }
        
    return (
        <div>
            <Messages ref={message} />
            <Dropdown id="dropdown" value={periodo} options={optionsPeriodos}
            onChange={(e) => setPeriodo(e.value)}
            />
            <div className="p-grid">
                <div className="p-col">TIPO</div>
                <div className="p-col">COR</div>
                {renderTamanhosGrid()}
            </div>
            {linhasDados}
            <Button label="Alterar" onClick={handleSubmit}/>
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

            if (props.dados.liberacao){
                elems.push(
                <div className="p-col-1 p-mt-4">
                        <InputNumber min={0} id={props.dados.cor+i}
                        value={props.pedido[props.dados.cor][i]} onValueChange={(e) => handleChange(e.value,props,i)} mode="decimal" showButtons buttonLayout="vertical"
                        style={{width: '2.5em'}} decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />

                </div>
                )
            }else{
                elems.push(
                <div className="p-col-1 p-mt-4">
                    <span className="p-float-label">
                        <InputNumber max={props.dados.qtds[i]} min={0} id={props.dados.cor+i}
                        value={props.pedido[props.dados.cor][i]} onValueChange={(e) => handleChange(e.value,props,i)} mode="decimal" showButtons buttonLayout="vertical"
                        style={{width: '2.5em'}} decrementButtonClassName="p-button-secondary"
                            incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                        <label htmlFor={props.dados.cor+i}>{props.dados.qtds[i]}</label>
                    </span>
                </div>
                )
            }
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

//FUNCOES AUXILIARES

function calculateOptionsPeriodos(periodos,periodoAtual){
    // CALCULA OPCOES DE PERIODOS REMOVENDO A OPCAO DO PERIODO ATUAL e PRE-SELECIONADOS
    periodos = JSON.parse(periodos)
    let index = periodos.indexOf(periodoAtual);
    if (index > -1) {
        periodos.splice(index, 1);
    }
    index = periodos.indexOf("Pre-selecionados");
    if (index > -1) {
        periodos.splice(index, 1);
    }

    return periodos
}



