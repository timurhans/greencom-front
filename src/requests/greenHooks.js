import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import  {api_address }  from '../proxy/proxy.js'


function getSavedValue(key,initialValue){
  let savedValue = false
  try{
    savedValue= JSON.parse(localStorage.getItem(key))
  }catch (e){
    savedValue = false
  }
  
  if (savedValue) return savedValue

  return initialValue
  }

export function useLocalStorage(key,initialValue){
  const [value,setValue] = useState(() => {return getSavedValue(key,initialValue)})

  useEffect(() => {
    localStorage.setItem(key,JSON.stringify(value))
  },[value])

  return [value,setValue]
}


export function useProductSearch(colecao,periodo,clienteId,orderBy) {
    const [produtos, setProdutos] = useState({})
    const [isBarCode, setIsBarCode] = useState(false)
    const location = useLocation()
    const [token,setToken] = useLocalStorage("token",null)

      
    useEffect(() => {
      const values = queryString.parse(window.location.search) //busca get parameters
      let url = api_address+location.pathname+'/'
      let colecao_busca = colecao
      if (colecao_busca === "Todas")colecao_busca = null
      let periodo_busca = periodo
      if (periodo_busca === "Todos")periodo_busca = null 
     
      axios({
        method: 'GET',
        url: url,
        headers:{'Authorization': 'Token '+token},
        params:{
          query:values.query,
          colecao:colecao_busca,
          periodo:periodo_busca,
          order_by:orderBy,
          "clienteId":clienteId
        }
      }).then(res => {
        setProdutos(res.data)
        console.log(res.data['isBarCode'])
        setIsBarCode(res.data['isBarCode'])
      })
    }, [location,colecao,periodo,clienteId,orderBy])
    return { produtos,isBarCode }
}

export default function usePeriodos(produto,periodo,periodo_atual=null) {
  const [dadosPeriodo, setDadosPeriodo] = useState([])
  const [token,setToken] = useLocalStorage("token",null)
    
  useEffect(() => {
    let url = api_address+'/periodos/'
    if(periodo !== ''){
      let params = {
        produto:produto,
        periodo:periodo
      }
      axios({
        method: 'GET',
        headers:{'Authorization': 'Token '+token},
        url: url,
        params:params
      }).then(res => {
        setDadosPeriodo(res.data['dados'])
      })
    }

  }, [produto,periodo,periodo_atual])
  return { dadosPeriodo }
}

export function useCartSearch(counter,clienteId) {
  const [carrinho, setCarrinho] = useState([])
  const [valorTotal, setValorTotal] = useState(0)
  const [qtdTotal, setQtdTotal] = useState(0)
  const [observacoes, setObservacoes] = useState("")
  const [razaoSocial, setRazaoSocial] = useState("")
  const [emptyMessage, setEmptyMessage] = useState(null)
  const [carrinhoId,setCarrinhoId ] = useLocalStorage("carrinhoId",null)
  const [token,setToken] = useLocalStorage("token",null)
    
  useEffect(() => {
    let url = api_address+'/carrinho/'
    let params = {
      carrinhoId:carrinhoId,
      clienteId:clienteId
    }
    axios({
      method: 'GET',
      headers:{'Authorization': 'Token '+token},
      url: url,
      params:params
    }).then(res => {
      console.log(res.data)
      if(res.data['confirmed']){
        setCarrinhoId(res.data['carrinhoId'])
      }
      setCarrinho(res.data['dados'])
      setObservacoes(res.data['observacoes'])
      setRazaoSocial(res.data['razao_social'])
      setEmptyMessage(res.data['message'])
      setValorTotal(res.data['valor_total'])
      setQtdTotal(res.data['qtd_total'])
      
    })

  },[counter,carrinhoId,observacoes,valorTotal,qtdTotal,razaoSocial])

  return { carrinho, emptyMessage,observacoes,valorTotal,qtdTotal,razaoSocial }
}

export function useFilterOptions() {
  const [colecoes, setColecoes] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [token,setToken] = useLocalStorage("token",null)
    
  useEffect(() => {
    let url = api_address+'/filterOptions/'
    axios({
      method: 'GET',
      headers:{'Authorization': 'Token '+token},
      url: url,
    }).then(res => {
      console.log(res.data)
      setColecoes(res.data['colecoes'])
      setPeriodos(res.data['periodos'])
    })

  },[colecoes,periodos])

  return { colecoes, periodos }
}

export function useClients() {
  const [clientes, setClientes] = useState([])
  const [token,setToken] = useLocalStorage("token",null)
    
  useEffect(() => {
    let url = api_address+'/clientes/'
    axios({
      method: 'GET',
      headers:{'Authorization': 'Token '+token},
      url: url,
    }).then(res => {
      console.log(res.data)
      setClientes(res.data['clientes'])
    })

  },[])

  return { clientes }
}



  