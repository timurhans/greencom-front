import React from "react";
import { useEffect, useState } from "react";
import { useProductSearchOnline, useLocalStorage } from "../requests/greenHooks.js";
import CardProduto from "./cardProdutoOnline.js";
import "primeflex/primeflex.css";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import "./produtos.css";

export default function ProdutosOnline(props) {
  const [listItems, setListItems] = useState(<div></div>);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [qtd, setQtd] = useState(0);
  const [periodo, setPeriodo] = useState("Imediato");
  const [tamColuna, setTamColuna] = useLocalStorage("tamColuna", 3);
  const [classColuna, setclassColuna] = useState(
    "p-col-12 p-md-6 p-lg-" + tamColuna
  );
  const [displayModal, setDisplayModal] = useState(false);

  const tamColOptions = [2, 3, 4, 6, 12];
  const orderByOptions = ["produto", "estoque", "desconto"];

  const onClick = () => {
    setDisplayModal(true);
  };
  const onHide = () => {
    setDisplayModal(false);
  };

  useEffect(() => {
    document.title = "Greenish B2B | Produtos";
  }, []);

  //-------------------

  const { produtos, isBarCode } = useProductSearchOnline();

  console.log(isBarCode);

  const handlePageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    if ("lista" in produtos) {
      setQtd(produtos["lista"].length);
      const lista = produtos["lista"].slice(first, first + rows);
      let listItemsProv = <div className={classColuna}>Entrou</div>;
      listItemsProv = lista.map((val, index) => (
        <div className={classColuna}>
          <CardProduto
            produto={val}
            isBarCode={isBarCode}
            key={index}
            searchInput={props.searchInput}
          ></CardProduto>
        </div>
      ));
      setListItems(listItemsProv);
      window.scrollTo(0, 0);
    }
  }, [produtos, classColuna, first, rows, isBarCode]);

  useEffect(() => {
    setclassColuna("p-col-12 p-md-" + tamColuna + " p-lg-" + tamColuna);
  }, [tamColuna]);

  return (
    <div className="main">
      <div className="p-grid">{listItems}</div>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={qtd}
        rowsPerPageOptions={[12, 24, 36]}
        onPageChange={handlePageChange}
      ></Paginator>
    </div>
  );
}
