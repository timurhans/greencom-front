import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState, useRef } from "react";
import { Messages } from "primereact/messages";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import usePeriodos, { useLocalStorage } from "../requests/greenHooks.js";
import axios from "axios";
import "primeflex/primeflex.css";
import { api_address } from "../proxy/proxy.js";
import { InputTextarea } from "primereact/inputtextarea";
import { formatMoney } from "../utils/utils.js";
import { Chip } from "primereact/chip";
import "./card.css";

export default function CardProduto(props) {
  let count = 0;
  const [displayModal, setDisplayModal] = useState(false);
  
  useEffect(() => {
    setDisplayModal(props.isBarCode);
  }, [props.isBarCode]);

  const onClick = () => {
    setDisplayModal(true);
  };
  const onHide = () => {
    setDisplayModal(false);
  };
  let condicao;
  let desconto;
  if (props.produto.produto__desconto > 0) {
    desconto =<div style={{display: 'flex', gap: 8}}>
    <s>{formatMoney(props.produto.preco)}</s>
      <span>{formatMoney(props.produto.preco - (props.produto.produto__desconto * props.produto.preco))}</span>
    </div>
  } else {
    desconto = "";
  }
  return (
    <div className="p-shadow-2 p-m-2">
      <Card className="card">
        <div
          className="img"
          >
        {props.produto.produto__desconto > 0 && 
        <div className="tag"><p>
          {
            parseFloat(props.produto.produto__desconto * 100).toFixed() + '%'
          }
          </p>
        </div>
        }
        <img
          top
          width="100%"
          src={props.produto.produto__url_imagem}
          alt="Sem Imagem"
          onClick={() => {
            onClick();
          }}
        />
        </div>

        <div className="header">
          <div>
            <p id="p1">{props.produto.produto__descricao}</p>
            <p>{props.produto.produto__produto}</p>
          </div>
          <div className="chip">
            {props.produto.produto__desconto > 0 ? 
            <p id="desconto">{desconto}</p>
            :
            <p>{formatMoney(props.produto.preco)}</p>
          }
          </div>
        </div>
        <div className="cardIn">
          <Dialog
            header={props.produto.produto__produto}
            maximizable
            visible={displayModal}
            style={{ width: "75vw" }}
            onHide={() => onHide()}
          >
            <div className="p-grid">
              <div className="p-col">
                <img
                  top
                  width="100%"
                  src={props.produto.produto__url_imagem}
                  alt="Sem Imagem"
                />
              </div>
              <div className="p-col-fixed" style={{ width: "500px" }}>
                <TableProds
                  isBarcode={props.isBarCode}
                  searchInput={props.searchInput}
                  onSave={onHide}
                  produto={props.produto}
                  periodo={props.periodo}
                ></TableProds>
              </div>
            </div>
          </Dialog>
          {!(props.produto.dados_periodo == undefined) ? (
            <div style={{ width: "100%" }}>
              {props.produto.dados_periodo.map((e, key) => {
                let tamanhos = JSON.parse(props.produto.produto__tamanhos);
                condicao = props.produto.dados_periodo.map((a) =>
                  a.qtds.reduce(function (soma, i) {
                    return soma + i;
                  })
                );

                if (count <= 0) {
                  if (
                    condicao.reduce(function (soma, i) {
                      return soma + i;
                    }) > 0
                  ) {
                    count++;
                    return (
                      <div key={key} className="disponivel">
                        <div>
                          <strong>Disponível</strong>
                        </div>
                        <div className="table">
                          {tamanhos.map((tam, index) => {
                            return (
                              <div>
                                <span>{tam}</span>
                                <p>
                                  {props.produto.dados_periodo.reduce(
                                    (accumulator, currentValue) =>
                                      accumulator + currentValue.qtds[index],
                                    0
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                }
              })}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function definePeriodo(isBarcode) {
  if (isBarcode) {
    return "Pre-selecionados";
  } else {
    return "";
  }
}
const renderTamanhosGrid = (props) => {
  let prods_tams = JSON.parse(props.produto.produto__tamanhos);
  let tams = prods_tams.map((val) => <div className="p-col-1">{val}</div>);
  return tams;
};
function TableProds(props) {
  const [produto] = useState(props.produto);
  const [periodo, setPeriodo] = useState(props.periodo);
  const [pedido, setPedido] = useState({});
  const [pedidoTotal, setPedidoTotal] = useState(0);
  const [changePedidoTotal, setChangePedidoTotal] = useState({
    change: 0,
    anterior: 0,
    novo: 0,
  });
  const [linhasDados, setLinhasDados] = useState(<div></div>);
  const [token, setToken] = useLocalStorage("token", null);
  const [clienteId] = useLocalStorage("clienteId", null);
  const [carrinhoId, setCarrinhoId] = useLocalStorage("carrinhoId", null);
  const [displayModalObs, setDisplayModalObs] = useState(false);
  const [observacaoItem, setObservacaoItem] = useState("");
  const message = useRef(null);
  const { dadosPeriodo } = usePeriodos(produto.produto__produto, periodo);

  useEffect(() => {
    let total = 0;
    let order = {};
    for (var index in dadosPeriodo) {
      let item = dadosPeriodo[index];
      let cor = item["cor"];
      let qtds = new Array(produto.produto__qtd_tamanhos).fill(0);
      order[cor] = qtds;
    }
    setPedido(order);
    setPedidoTotal(0);
  }, [dadosPeriodo]);

  useEffect(() => {
    setPedidoTotal(pedidoTotal + changePedidoTotal["change"]);
  }, [changePedidoTotal]);

  useEffect(() => {
    if (periodo !== "") {
      let tams = dadosPeriodo.map((val) => (
        <LinhaDados
          dados={val}
          pedido={pedido}
          produto={props.produto}
          setPedido={setPedido}
          setChangePedidoTotal={setChangePedidoTotal}
        ></LinhaDados>
      ));
      setLinhasDados(tams);
    }
  }, [pedido, periodo]);

  const renderTamanhosGrid = (props) => {
    let prods_tams = JSON.parse(props.produto.produto__tamanhos);
    let tams = prods_tams.map((val) => <div className="p-col-1">{val}</div>);
    return tams;
  };

  const handleSubmit = () => {
    let qtd_total = 0;
    for (var index in pedido) {
      let qtds_cor = pedido[index];
      qtd_total = qtd_total + qtds_cor.reduce((a, b) => a + b, 0);
    }
    var data = {
      produto: produto,
      periodo: periodo,
      qtds: pedido,
      qtd_total: qtd_total,
      clienteId: clienteId,
      carrinhoId: carrinhoId,
      observacao_item: observacaoItem,
    };
    var config = {
      headers: { Authorization: "Token " + token },
    };

    console.log(data);
    console.log(config["headers"]);
    if (qtd_total > 0) {
      axios
        .post(api_address + "/carrinho/", data, config)
        .then((response) => {
          if (response.data["confirmed"]) {
            props.onSave();
            // message.current.show([
            //     { severity: 'success', summary: response.data['message'], sticky: true }
            // ])
            setCarrinhoId(response.data["carrinhoId"]);
          } else {
            message.current.show([
              {
                severity: "error",
                summary: response.data["message"],
                sticky: true,
              },
            ]);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      message.current.show([
        {
          severity: "error",
          summary: "Quantidade deve ser maior que 0",
          sticky: false,
        },
      ]);
    }
    props.searchInput.current.focus();
  };

  return (
    <div>
      <Messages ref={message} />
      <div className="header">
        <Dropdown
          placeholder="Selecione Período"
          id="dropdown"
          value={periodo}
          options={JSON.parse(props.produto.produto__periodos)}
          onChange={(e) => setPeriodo(e.value)}
        />
        <div className="chip">
        <span id="qtd">Quantidade Total:</span>
        <p id="quantidade">{pedidoTotal}</p>
        </div>
      </div>
      {linhasDados}
      <Button
        style={{ marginTop: "1.5rem" }}
        label="Observação"
        onClick={() => setDisplayModalObs(true)}
        className="p-mr-2"
      />
      <Button
        style={{ marginTop: "1.5rem" }}
        label="Adicionar"
        onClick={handleSubmit}
      />
      <Dialog
        header="Observação Item"
        visible={displayModalObs}
        onHide={() => setDisplayModalObs(false)}
      >
        <div>
          <InputTextarea
            rows={2}
            cols={50}
            value={observacaoItem}
            onChange={(e) => setObservacaoItem(e.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
}

function LinhaDados(props) {
  const handleChange = (valor, props, ordem) => {
    if (valor == null) {
      valor = 0;
    }
    props.setChangePedidoTotal(0);
    let ped_prov = props.pedido;
    let qtd_anterior = ped_prov[props.dados.cor][ordem];
    ped_prov[props.dados.cor][ordem] = valor;
    props.setPedido(ped_prov);
    console.log("change");
    console.log(valor - qtd_anterior);
    props.setChangePedidoTotal({
      change: valor - qtd_anterior,
      anterior: qtd_anterior,
      novo: valor,
    });
    //props.setPedidoTotal(0)
  };
  const renderTamanhosGrid = (props) => {
    let prods_tams = JSON.parse(props.produto.produto__tamanhos);
    let tams = prods_tams.map((val) => (
      <div
        className="p-col-1"
        style={{ fontSize: 12, marginBottom: "-.75rem", marginLeft: ".25rem" }}
      >
        {val}
      </div>
    ));
    return tams;
  };

  const renderButtons = (props) => {
    let elems = [];
    if (Object.keys(props.pedido).length === 0) {
      return elems.map((val) => val);
    }
    for (var idx in props.dados.qtds) {
      let i = idx;

      if (props.dados.liberacao) {
        elems.push(
          <div className="p-col-1 p-mt-4">
            <InputNumber
              min={0}
              id={props.dados.cor + i}
              value={props.pedido[props.dados.cor][i]}
              onValueChange={(e) => handleChange(e.value, props, i)}
              mode="decimal"
              showButtons
              buttonLayout="vertical"
              style={{ width: "2.5em" }}
              decrementButtonClassName="p-button-secondary"
              incrementButtonClassName="p-button-secondary"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
        );
      } else {
        elems.push(
          <div className="p-col-1 p-mt-4">
            <span className="p-float-label">
              <InputNumber
                max={props.dados.qtds[i]}
                min={0}
                id={props.dados.cor + i}
                value={props.pedido[props.dados.cor][i]}
                onValueChange={(e) => handleChange(e.value, props, i)}
                mode="decimal"
                showButtons
                buttonLayout="vertical"
                style={{ width: "2.5em" }}
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
              <label htmlFor={props.dados.cor + i}>{props.dados.qtds[i]}</label>
            </span>
          </div>
        );
      }
    }

    return elems.map((val) => val);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}
    >
      <div>
        <div>
          <b>{props.dados.cor + " - " + props.dados.desc_cor}</b>
        </div>
        <div>
          <p style={{ fontSize: 12, marginBottom: "-.1rem" }}>
            {props.dados.desc_liberacao}
          </p>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", gap: ".25rem" }}>
          {renderTamanhosGrid(props)}
        </div>
        <div style={{ display: "flex", gap: ".25rem" }}>
          {renderButtons(props)}
        </div>
      </div>
    </div>
  );
}
