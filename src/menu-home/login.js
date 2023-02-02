import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import axios from "axios";
import ReactGA from "react-ga4";
import { useLocalStorage } from "../requests/greenHooks.js";
import { Messages } from "primereact/messages";
import { api_address } from "../proxy/proxy.js";

export default function Login(props) {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useLocalStorage("token", null);
  const [, setLoggedin] = useLocalStorage("loggedin", null);
  const [, setClienteId] = useLocalStorage("clienteId", null);
  const [, setClienteNome] = useLocalStorage("clienteNome", null);
  const [isRep, setIsRep] = useLocalStorage("isRep", null);
  const [, setUsername] = useLocalStorage("username", null);
  const [, setCarrinhoId] = useLocalStorage("carrinhoId", null);
  const [, setCategorias] = useLocalStorage("categorias", []);
  const [, setCategoriasMobile] = useLocalStorage("categoriasMobile", []);
  const [, setColecoes] = useLocalStorage("colecoes", []);
  const [, setPeriodos] = useLocalStorage("periodos", []);
  const [, setTipoConta] = useLocalStorage("tipoConta", []);

  const [colecao, setColecao] = useLocalStorage("colecao", "Todas");
  const [periodo, setPeriodo] = useLocalStorage("periodo", "Todos");
  const [orderBy, setOrderBy] = useLocalStorage("orderBy", "produto");
  
  const message = useRef(null);

  useEffect(() => {
    document.title = "Greenish B2B | Login";
  }, []);

  const handleSubmit = () => {
    let data = new FormData();
    data.append("username", login);
    data.append("password", senha);

    axios
      .post(api_address + "/api-token-auth/", data)
      .then((response) => {
        let config = {
          headers: { Authorization: "Token " + response.data["token"] },
        };
        console.log(config);
        setToken(response.data["token"]);
        axios.get(api_address + "/login/", config).then((response) => {
          console.log(response.data);
          setLoggedin(true);
          setClienteId(response.data["clienteId"]);
          setClienteNome(response.data["clienteNome"]);
          setIsRep(response.data["isRep"]);
          setUsername(response.data["username"]);
          setCarrinhoId(null);
          setCategorias(response.data["cats"]);
          setCategoriasMobile(response.data["cats_mobile"]);
          setColecoes(response.data["colecoes"]);
          setPeriodos(response.data["periodos"]);
          setTipoConta(response.data["tipo_conta"]);
          window.location.href = "/";
          ReactGA.event({
            action: "login",
            user_type: response.data["tipo_conta"],
          });

          if(!response.data["isRep"]){
            setPeriodo("Imediato")
            setOrderBy("estoque")
          }

        });
      })
      .catch(function (err) {
        message.current.show([
          {
            severity: "error",
            summary: "Usuario ou senha Incorretos",
            sticky: false,
          },
        ]);
        setLogin("");
        setSenha("");
      });
  };

  return (
    <div>
      <Messages ref={message} />
      <div className="p-field">
        <label htmlFor="login">Login</label>
        <InputText
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div className="p-field">
        <label htmlFor="senha">Senha</label>
        <Password
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          feedback={false}
        />
      </div>
      <Button label="Entrar" onClick={() => handleSubmit()} />
    </div>
  );
}
