import React from "react";
import { useEffect, useState } from 'react'
import { useProductSearch,useLocalStorage } from '../requests/greenHooks.js'
import CardProduto from './cardProduto.js'
import 'primeflex/primeflex.css';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'


export default function Produtos() {

  const [listItems,setListItems] = useState(<div></div>)  
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(12)
  const [qtd, setQtd] = useState(0)
  const [token,setToken] = useLocalStorage("token",null)
  const [colecao, setColecao] = useLocalStorage("colecao",null)
  const [periodo, setPeriodo] = useLocalStorage("periodo",null)
  const [clienteId, ] = useLocalStorage("clienteId",null)
  const [tamColuna,setTamColuna] = useLocalStorage("tamColuna",2)
  const [classColuna,setclassColuna] = useState("p-col-12 p-md-6 p-lg-"+tamColuna)
  const [displayModal, setDisplayModal] = useState(false);

  //------------FILTROS

  const updateFilterOptions = () =>{
      
    let url = api_address+'/filterOptions'
    axios({
      method: 'GET',
      headers:{'Authorization': 'Token '+token},
      url: url,
    }).then(res => {
      console.log(res.data)
      setColecoesOptions(res.data['colecoes']) 
      setPeriodosOptions(res.data['periodos'])
    })
  }
  const [colecoesOptions,setColecoesOptions] = useState([]) //['Todas','Verao 2021','Inverno 2021','Verao 2020','Outras Coleções']
  const [periodosOptions,setPeriodosOptions] = useState([])// ['Todos','Junho','Julho']

  console.log(colecoesOptions)
  const tamColOptions = [2,3,4]

  const onClick = () => {
    setDisplayModal(true)
  }
  const onHide = () => {
      setDisplayModal(false)
  }

  useEffect(() => {
    updateFilterOptions()
    document.title = "Greenish B2B | Produtos"
  }, [])

  //-------------------

  const {
    produtos,
  } = useProductSearch(colecao,periodo,clienteId)



  const handlePageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  }
  
  useEffect(() => {
    if ('lista' in produtos){
      setQtd(produtos['lista'].length)
      const lista = produtos['lista'].slice(first,first+rows)
      let listItemsProv = <div className={classColuna}>Entrou</div>
      listItemsProv = lista.map((val,index) => <div className={classColuna}><CardProduto produto={val} key={index}></CardProduto></div>)
      setListItems(listItemsProv)
      window.scrollTo(0, 0)
    }
  }, [produtos,classColuna,first,rows])

  useEffect(() => {
    setclassColuna("p-col-12 p-md-6 p-lg-"+tamColuna)
  }, [tamColuna])


  return (
    <>
      <div>
        
        <Button label="Filtrar" onClick={() => onClick()} className="p-mr-2" />
            <Dialog header={"Filtros"} visible={displayModal} style={{ width: '75vw' }} onHide={() => onHide()}>
                <div className="p-grid">
                    <div className="p-col-12 p-md-6 p-lg-2">
                        <h3>Colecao</h3>
                        <Dropdown id="dropdown" value={colecao} options={colecoesOptions}
                        onChange={(e) => setColecao(e.value)}
                        />
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-2">
                        <h3>Periodo</h3>
                        <Dropdown id="dropdown" value={periodo} options={periodosOptions}
                        onChange={(e) => setPeriodo(e.value)}
                        />
                    </div>                  
                    <div className="p-col-12 p-md-6 p-lg-2">
                        <h3>Coluna</h3>
                        <Dropdown id="dropdown" value={tamColuna} options={tamColOptions}
                        onChange={(e) => setTamColuna(e.value)}
                        />
                    </div>                                             
                </div>
            </Dialog>
      </ div>
      <div className="p-grid">{listItems}</div>
      <Paginator first={first} rows={rows} totalRecords={qtd} rowsPerPageOptions={[12, 24, 36]} onPageChange={handlePageChange}></Paginator>
    </>
  )
}

