export function formatMoney(number) {
    if(number == null){
      return ""
    }
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }