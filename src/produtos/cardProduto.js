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
  let desconto;
  if (props.produto.produto__desconto > 0) {
    desconto =
      " - " +
      parseFloat(props.produto.produto__desconto * 100).toFixed() +
      "% OFF";
  } else {
    desconto = "";
  }
  const header = (
    <div>
      <h4>{props.produto.produto__descricao}</h4>
      <p>{props.produto.produto__produto}</p>
      <Chip label={formatMoney(props.produto.preco) + desconto} />
    </div>
  );
  return (
    <div className="p-shadow-2 p-m-2"  style={{padding: '.25rem', fontSize: 'smaller', display: 'flex', width: '100%', flexDirection: 'column', gap: 5, border: 'none'}}>
      <Card header={header}>
        <img
          top
          width="100%"
          src={props.produto.produto__url_imagem}
          alt="Sem Imagem"
        />
        <div className="p-grid">
          <div className="p-field p-col-12 p-md-3" style={{padding: '.25rem', fontSize: 'smaller', display: 'flex', width: '100%', flexDirection: 'column', gap: 5}}>
            <Button
              label="Detalhes"
              icon="pi pi-external-link"
              onClick={() => {
                onClick();
                console.log(props.periodo);
              }}
              style={{width: '75%', margin: '6px 0 6px 0'}}
            />
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
            {!(props.produto.dados_periodo == undefined) ?<div>
                {
                props.produto.dados_periodo.map((e, key) => {
                  if (count <= 1) {
                  count++;
                  return (
                      <div key={key}>
                        <div><b>{e.desc_cor}</b></div>
                        <div style={{padding: 0, margin: 0, display: 'flex', gap: '.75rem', textAlign: 'center'}}>
                        {e.qtds.map( (qtd, count) => {
                          let tam = ['PP','P','M','G','GG']
                          count++
                          return (
                            
                              <div>
                              <p>
                              {tam[count - 1]}
                            </p>
                            <p>
                                {qtd}
                              </p>
                              </div>
                          )
                        })}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>: null}
          </div>
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
      <Dropdown
        placeholder="Selecione Período"
        id="dropdown"
        value={periodo}
        options={JSON.parse(props.produto.produto__periodos)}
        onChange={(e) => setPeriodo(e.value)}
      />
      <Chip label={"Qtd Total Produto : " + pedidoTotal} />
      <div className="p-grid">
        <div className="p-col">TIPO</div>
        <div className="p-col">COR</div>
        {renderTamanhosGrid(props)}
      </div>
      {linhasDados}
      <Button
        label="Observação"
        onClick={() => setDisplayModalObs(true)}
        className="p-mr-2"
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
      <Button label="Adicionar" onClick={handleSubmit} />
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
    <div className="p-grid">
      <div className="p-col">{props.dados.desc_liberacao}</div>
      <div className="p-col">
        {props.dados.cor + " - " + props.dados.desc_cor}
      </div>
      {renderButtons(props)}
    </div>
  );
}
