import React from 'react';
import axios from 'axios'
import { Button } from 'primereact/button';
import { useLocalStorage } from '../requests/greenHooks.js'
import { useState,useEffect } from 'react'


export default function Promocoes(props) {

    const [promocoes,setPromocoes] = useState([])
    const [carrinhoId,setCarrinhoId ] = useLocalStorage("carrinhoId",null)

  
    useEffect(() => {
        getPromocoes()
        document.title = "Greenish B2B | Promocoes"
      }, [])

    const computaPromo = (id_promocao,id_condicao) =>{
        let url = 'http://localhost:3000/promocoes/'+carrinhoId
        axios({
            method: 'GET',
            url: url,
            params:{
                id_promocao:id_promocao,
                id_condicao:id_condicao
              }
        }).then(res => {
            console.log(res.data['message'])
        })

    }

    const removePromo = () =>{
        let url = 'http://localhost:3000/promocoes/remove/'+carrinhoId
        axios({
            method: 'GET',
            url: url,
        }).then(res => {
            console.log(res.data['message'])
        })

    }

    const getPromocoes = () =>{
        let url = 'http://localhost:3000/promocoes'
        axios({
            method: 'GET',
            url: url,
        }).then(res => {
            setPromocoes(res.data['promocoes'])
            console.log(res.data['promocoes'])
        })
    } 

    const lista = promocoes.slice()
    let elems = []
    for (var idx in lista){
        let i = idx
        let lista_condicoes = lista[i]['condicoes']
        let condicoes = lista_condicoes.map((val,index) => <div>
        <Button label={val.condicao} onClick={() => computaPromo(lista[i].id_promocao,val.id)} />
        </div>)
        elems.push(
            <div>
                <p>{lista[i].descricao}</p>
                {condicoes}
            </div>
        )
    }
    elems.push(
        <div>
            <p>{"Remover"}</p>
            <Button label={"Remover"} onClick={() => removePromo()} />
        </div>        
    )
    let promocoes_html = elems.map((val) => val)
    return (
        <div>
            {promocoes_html}
        </div>
    )
}