import React, { useState,useRef }  from 'react';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useLocalStorage } from '../requests/greenHooks.js'

//Menu com dropdown para pedidos,clientes e etc
const MenuPerfil = () => {
    const menu = useRef(null);
    const [username, ] = useLocalStorage("username",null)
    const [isRep, ] = useLocalStorage("isRep",null)
    
    let items_perfil = [
            {
                label: 'Conta',
                icon: 'pi pi-user',
                url: '/conta'
            },
            {
                label: 'Pedidos',
                icon: 'pi pi-book',
                url: '/pedidos'
            },

        ]
        if (isRep){
            items_perfil.push({
                label: 'Clientes',
                icon: 'pi pi-users',
                url: '/clientes'
            })
            items_perfil.push({
                label: 'Promocoes',
                icon: 'pi pi-percentage',
                url: '/promocoes'
            })
            items_perfil.push({
                label: 'Trade',
                icon: 'pi pi-flag',
                url: '/trade'
            })

        }    
    const items = [
        {   
            label:username,
            items: items_perfil
        }
    ]



    return (
        <>
            <Menu model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-bars" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
        </>
    );
}


export function MyMenu(props){
    const [items,] = useLocalStorage("categorias",[])
    const [query,setQuery] = useState('')
    const [tipoConta,] = useLocalStorage("tipoConta",[])

    const handleSearch = (e) =>{
        if (query !== ''){
            e.preventDefault()
            window.location = '/busca?query='+query
            setQuery('')
        }

    }
    const handleChangeSearch = (e) =>{
        //Faz submit automaticamente na busca caso seja codigo de barras
        setQuery(e.target.value)
        if (e.target.value.length >= 13 && /^\d+$/.test(e.target.value)){
            e.preventDefault()
            window.location = '/busca?query='+e.target.value
            setQuery('')
        }

    }


    const start = <a href="/"><img alt="logo" src="https://ondasstr092020.blob.core.windows.net/modelo/logo.png" height="40" className="p-mr-2"></img></a>
    //Mostra lateral do menu apenas para usuario logado
    let end = <a href="/login">Login</a>
    if(props.loggedIn){
        
        end = <> 
        <InputText ref={props.searchInput} onChange={handleChangeSearch} placeholder="Buscar" type="text" />
        <Button onClick={handleSearch} icon="pi pi-search" className="p-button-rounded p-button-secondary" />
        <Button icon="pi pi-shopping-cart" onClick={(e) => window.location.href="/carrinho"} aria-controls="popup_menu" aria-haspopup />
        {tipoConta==="visitante" ? <Button icon="pi pi-user" onClick={(e) => window.location.href="/conta"} aria-controls="popup_menu" aria-haspopup /> : <MenuPerfil></MenuPerfil> }
        </>
    }

    return (
        <div>
            <div className="card">
                <Menubar model={items} start={start} end={end} />
            </div>

        </div>
    )
}