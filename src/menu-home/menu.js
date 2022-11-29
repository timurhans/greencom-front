import React, { useState, useRef, useEffect } from "react";
import "./menu.css";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { SlideMenu } from "primereact/slidemenu";
import { InputText } from "primereact/inputtext";
import { useLocalStorage } from "../requests/greenHooks.js";
import { Sidebar } from "primereact/sidebar";
import { Image } from "react-bootstrap";
//Menu com dropdown para pedidos,clientes e etc
const MenuPerfil = () => {
  const menu = useRef(null);
  const [username] = useLocalStorage("username", null);
  const [isRep] = useLocalStorage("isRep", null);

  let items_perfil = [
    {
      label: "Conta",
      icon: "pi pi-user",
      url: "/conta",
    },
    {
      label: "Pedidos",
      icon: "pi pi-book",
      url: "/pedidos",
    },
  ];
  if (isRep) {
    items_perfil.push({
      label: "Clientes",
      icon: "pi pi-users",
      url: "/clientes",
    });
    items_perfil.push({
      label: "Promocoes",
      icon: "pi pi-percentage",
      url: "/promocoes",
    });
    items_perfil.push({
      label: "Trade",
      icon: "pi pi-flag",
      url: "/trade",
    });
  }
  const items = [
    {
      label: username,
      items: items_perfil,
    },
  ];

  return (
    <>
      <Menu model={items} popup ref={menu} id="popup_menu" />
      <Button
        icon="pi pi-bars"
        onClick={(event) => menu.current.toggle(event)}
        aria-controls="popup_menu"
        aria-haspopup
      />
    </>
  );
};

export function MyMenu(props) {
  const [itemsDesk] = useLocalStorage("categorias",[])
  const [itemMob,] = useLocalStorage("categoriasMobile",[])
  const [visibleRight, setVisibleRight] = useState(false);
  const [query, setQuery] = useState("");
  const [tipoConta] = useLocalStorage("tipoConta", []);

  const handleSearch = (e) => {
    if (query !== "") {
      e.preventDefault();
      window.location = "/busca?query=" + query;
      setQuery("");
    }
  };
  const handleChangeSearch = (e) => {
    //Faz submit automaticamente na busca caso seja codigo de barras
    setQuery(e.target.value);
    if (e.target.value.length >= 13 && /^\d+$/.test(e.target.value)) {
      e.preventDefault();
      window.location = "/busca?query=" + e.target.value;
      setQuery("");
    }
  };

  const start = (
    <a href="/" >
      <img
        alt="logo"
        src="https://ondasstr092020.blob.core.windows.net/modelo/logo.png"
        className="p-mr-2"
      />
    </a>
  );
  //Mostra lateral do menu apenas para usuario logado
  const button = (
    <div className="btnMenu" onClick={() => setVisibleRight(true)}>
      <Image 
      src="https://cdn-icons-png.flaticon.com/512/55/55003.png"
      width={35} height={30}
      />
    </div>
  );
  let end = <a href="/login" style={{textDecoration: 'none'}}><Button>Login</Button></a>;
  if (props.loggedIn) {
    end = (
      <div className="endMenu">
        <div className="search">
          <InputText
            ref={props.searchInput}
            onChange={handleChangeSearch}
            placeholder="Buscar"
            type="text"
          />
          <Button
            onClick={handleSearch}
            icon="pi pi-search"
            className="p-button-rounded p-button-secondary"
          />
        </div>
        <div className="btns">
          <Button
            icon="pi pi-shopping-cart"
            onClick={(e) => (window.location.href = "/carrinho")}
            aria-controls="popup_menu"
            aria-haspopup
          />
          {tipoConta === "visitante" ? (
            <Button
              icon="pi pi-user"
              onClick={(e) => (window.location.href = "/conta")}
              aria-controls="popup_menu"
              aria-haspopup
            />
          ) : (
            <MenuPerfil />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card menu">
        <Menubar model={itemsDesk} start={start} end={end} className="menu" />
      </div>
      <div className="card menuMobile">
        <header className="menuMobile">
          {start} {button}
        </header>
      </div>
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <p>{end}</p>
        <SlideMenu model={itemMob} />
      </Sidebar>
    </>
  );
}
