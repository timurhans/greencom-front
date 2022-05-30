import {MyMenu} from './menu-home/menu.js'
import {Home} from './menu-home/home.js'
import Login from './menu-home/login.js'
import Clientes from './menu-home/clientes.js'
import Pedidos from './menu-home/pedidos.js'
import Promocoes from './menu-home/promocoes.js'
import Conta from './menu-home/conta.js'
import Produtos from './produtos/produtos.js'
import Carrinho from './carrinho/carrinho.js'
import Pedido from './pedido/pedido.js'
import {Trade} from './trade/trade.js'
import DataTableBasicDemo from './tests/dataTableDemo.js'

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
      }
  }

  verificaLogin(){
    let loggedIn = JSON.parse(localStorage.getItem('loggedin'))
    if (loggedIn==null){
      loggedIn = false
    }
    return loggedIn
  }

  render(){
      const loggedIn = this.verificaLogin()

      
      return(
          <div>
            <div>
            <Router>
              <div>
                <nav>
                  <MyMenu loggedIn={loggedIn}></MyMenu>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                <Switch>
                  <Route path="/login" component={Login} />
                  <Route path="/clientes" component={Clientes} />
                  <Route path="/pedidos" component={Pedidos} />
                  <Route path="/promocoes" component={Promocoes} />
                  <Route path="/conta" component={Conta} />
                  <Route path="/carrinho" component={Carrinho} />
                  <Route path="/trade" component={Trade} />
                  <Route path="/busca" component={Produtos} />
                  <Route path="/teste" component={DataTableBasicDemo} />
                  <Route path="/pedido/:idPedido" component={Pedido} />
                  <Route path="/:linha/:categoria/:subcategoria">
                    {loggedIn ? <Produtos />  :  <Redirect to="/login"/>}
                  </Route>                  
                  {/* <Route path="/:linha/:categoria/:subcategoria" component={Produtos} /> */}
                  <Route path="/:linha/:categoria">
                    {loggedIn ? <Produtos /> :   <Redirect to="/login"/> }
                  </Route>   
                  <Route path='/' component={Home}/>
                </Switch>
              </div>
            </Router>             
            </div>
          </div>
      )
  }


}


export default App;