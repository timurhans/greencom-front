import React, { useRef }  from 'react';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios'
import { useLocalStorage } from '../requests/greenHooks.js'
import { Dialog } from 'primereact/dialog';

//Menu com dropdown para pedidos,clientes e etc
const MenuPerfil = () => {
    const menu = useRef(null);
    const [username, ] = useLocalStorage("username",null)
    const items = [
        {   
            label:username,
            items: [
                {
                    label: 'Clientes',
                    icon: 'pi pi-external-link',
                    url: '/clientes'
                },
                {
                    label: 'Pedidos',
                    icon: 'pi pi-upload',
                    url: '/pedidos'
                },
                {
                    label: 'Conta',
                    icon: 'pi pi-user',
                    url: '/conta'
                }
            ]
        }
    ];

    return (
        <>
            <Menu model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-user" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
        </>
    );
}


export class MyMenu extends React.Component {
    constructor(props) {
      super(props)
        
      this.state = {
          items: [],
          query: '',
          lastUpdate: 1623533795696,
          displayModal : true
        }
    }
  
    componentDidMount() {
      this.updateCats();
    }
    // componentDidUpdate() {
    //     this.setState({displayModal: getDisplayModal()})
    // }

    handleSearch = (e) =>{
        if (this.state.query !== ''){
            e.preventDefault()
            // let base_url = window.location.href
            // base_url = base_url.split('?')[0] 
            window.location = '/busca?query='+this.state.query
            this.setState({query: ''})
        }

    }
    handleChangeSearch = (e) =>{
        //Faz submit automaticamente na busca caso seja codigo de barras
        this.setState({query: e.target.value})
        if (e.target.value.length >= 13 && /^\d+$/.test(e.target.value)){
            e.preventDefault()
            // let base_url = window.location.href
            // base_url = base_url.split('?')[0]
            console.log(this.state.query)
            window.location = '/busca?query='+e.target.value
            this.setState({query: ''})
        }

    }
  
    updateCats() {
        let intervalo = 900000
        let agora = Date.now()
        let diferenca = agora-this.state.lastUpdate
        
        if(diferenca>intervalo){
            this.setState({lastUpdate: agora})
            let url = 'http://localhost:3000/categorias'  
            axios({
              method: 'GET',
              url: url,
            }).then(res => {
              this.setState({items: res.data})
            })
        }

    }
  
    render() {
        const items = this.state.items
        const start = <a href="/"><img alt="logo" src="https://ondasstr092020.blob.core.windows.net/modelo/logo.png" height="40" className="p-mr-2"></img></a>
        //Mostra lateral do menu apenas para usuario logado
        let end = <a href="/login">Login</a>
        if(this.props.loggedIn){
            
            end = <> 
            <InputText onChange={this.handleChangeSearch} placeholder="Buscar" type="text" />
            <Button onClick={this.handleSearch} icon="pi pi-search" className="p-button-rounded p-button-secondary" />
            <Button icon="pi pi-shopping-cart" onClick={(e) => window.location.href="/carrinho"} aria-controls="popup_menu" aria-haspopup />
            <MenuPerfil></MenuPerfil>
            </>
        }
        return (
            <div>
                <div className="card">
                    <Menubar model={items} start={start} end={end} />
                    {/* <Dialog header={"teste"} visible={true}
                    style={{ width: '75vw' }} onHide={() => this.setState({displayModal: false})}>
                    </Dialog> */}
                </div>

            </div>
        )
    }
}

