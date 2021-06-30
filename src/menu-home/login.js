import React from "react";
import {  useState,useEffect,useRef } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import {Password} from 'primereact/password';
import axios from 'axios'
import Cookies from 'js-cookie'
import { useLocalStorage } from '../requests/greenHooks.js'
import { Messages } from 'primereact/messages'

export default function Login(props){

    const [login,setLogin] = useState("")
    const [senha,setSenha] = useState("")
    const [,setLoggedin] = useLocalStorage("loggedin",null)
    const [,setClienteId] = useLocalStorage("clienteId",null)
    const [,setClienteNome] = useLocalStorage("clienteNome",null)
    const [isRep,setIsRep] = useLocalStorage("isRep",null)
    const [,setUsername] = useLocalStorage("username",null)
    const [,setCarrinhoId] = useLocalStorage("carrinhoId",null)
    const message = useRef(null)

    useEffect(() => {
      document.title = "Greenish B2B | Login"
    }, [])

    const handleSubmit = () =>{
        axios.get('accounts/login/')
      
        var csrftoken = Cookies.get('csrftoken')
        let data = new FormData()
        data.append("username",login)
        data.append("password",senha)
        data.append("csrfmiddlewaretoken", csrftoken) 
        var config = {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken" : csrftoken
          }
        }
    
        axios.post('login/',data,config,{ withCredentials: true })
        .then(function (response){
            if(response.data['confirmed']){
              Cookies.set("sessionid",response.data['sessionid'])
              setLoggedin(true)
              setClienteId(response.data['clienteId'])
              setClienteNome(response.data['clienteNome'])
              setIsRep(response.data['isRep'])
              setUsername(response.data['username'])
              setCarrinhoId(null)
              window.location.href = '/'
            }else{
              message.current.show([
                { severity: 'error', summary: response.data['message'], sticky: false }
            ])
            setLogin("")
            setSenha("")
            }

        })
    
      }

    return(
      <div>
        <Messages ref={message} />
        <div className="p-field">
          <label htmlFor="login" >Login</label>
            <InputText id="login" value={login} onChange={(e) => setLogin(e.target.value)}/>
        </div>
        <div className="p-field">
            <label htmlFor="senha">Senha</label>
            <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} feedback={false}  />
        </div>
        <Button label="Entrar" onClick={() => handleSubmit()} />
      </div>
  
    )
  }