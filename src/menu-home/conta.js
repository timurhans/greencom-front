import React, {useEffect,useState,useRef} from "react";
import { Button } from 'primereact/button'
import axios from 'axios'
import {Password} from 'primereact/password';
import 'primeflex/primeflex.css';
import { Dialog } from 'primereact/dialog'
import { Messages } from 'primereact/messages'
import { useLocalStorage } from '../requests/greenHooks.js'
import  {api_address }  from '../proxy/proxy.js'

export default function Conta(props){
  const [senhaAtual,setSenhaAtual ] = useState("")
  const [senhaNova1,setSenhaNova1 ] = useState("")
  const [senhaNova2,setSenhaNova2 ] = useState("")
  const [token,setToken] = useLocalStorage("token",null)
  const [displayModalSenha, setDisplayModalSenha] = useState(false)
  const message = useRef(null)
    
  useEffect(() => {
      document.title = "Greenish B2B | Conta"
    }, [])

    const handleLogout = () =>{
        var config = {
          headers: {'Authorization': 'Token '+token}
        }
        axios.get(api_address+'/accounts/logout',config)
        .then(function (response){
            localStorage.clear()
            window.location.href = '/'
        })
    }

    const changePassword = () =>{
        if (senhaNova1 === senhaNova2){
          var data = {
            "senhaNova":senhaNova1,
            "senhaAtual":senhaAtual,
          }
          var config = {
            headers: {'Authorization': 'Token '+token}
          }
          axios.post(api_address+'/change_password/',data,config)
          .then(function (response){
              if (response.data['confirmed']){
                localStorage.clear()
                window.location.href = '/login'                
              }else{
                  message.current.show([
                      { severity: 'error', summary: response.data['message'], sticky: false }
                  ])
              }  
          })
      }else{
        message.current.show([
          { severity: 'error', summary: "Confirmacao de nova senha invalida", sticky: false }
      ])
      }
      setSenhaAtual("")
      setSenhaNova1("")
      setSenhaNova2("")
  }

    return(
      <div>
        <Dialog title="Alterar Senha" visible={displayModalSenha} onHide={()=>setDisplayModalSenha(false)}>
            <Messages ref={message} />
            <h5>Senha Atual</h5>
            <Password  value={senhaAtual} onChange={(e)=>setSenhaAtual(e.target.value)} feedback={false}/>
            <h5>Senha Nova</h5>
            <Password value={senhaNova1} onChange={(e)=>setSenhaNova1(e.target.value)} feedback={false}/>
            <h5>Confirme a Nova Senha</h5>
            <Password value={senhaNova2} onChange={(e)=>setSenhaNova2(e.target.value)} feedback={false}/>
            <h5></h5>
            <Button label="Confirmar" onClick={() => changePassword()} />
        </Dialog>
        
        <Button label="Alterar Senha" onClick={() => setDisplayModalSenha(true)} />
        <Button label="Logout" onClick={() => handleLogout()} />
      </div>
  
    )
  }