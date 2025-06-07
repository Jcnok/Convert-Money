// Seleciona todos os elementos do DOM necessários
const convertButton = document.querySelector(".convert-button");
const currencySelectFrom = document.querySelector("#currency-select-from");
const currencySelectTo = document.querySelector("#currency-select-to");
const inputCurrencyValueElement = document.querySelector(".input-currency");

// Objeto para guardar informações de cada moeda, facilitando o acesso e a manutenção
const currencyData = {
  real: {
    name: "Real",
    img: "./assets/brasil.png",
    locale: "pt-BR",
    currency: "BRL",
  },
  dolar: {
    name: "Dólar Americano",
    img: "./assets/usa.png",
    locale: "en-US",
    currency: "USD",
  },
  euro: {
    name: "Euro",
    img: "./assets/euro.png",
    locale: "de-DE",
    currency: "EUR",
  },
  bitcoin: {
    name: "Bitcoin",
    img: "./assets/bitcoin.png",
    locale: "en-US",
    currency: "BTC",
    options: { minimumFractionDigits: 8 },
  },
};

/**
 * Função principal para converter os valores.
 */
async function convertValues() {
  const inputCurrencyValue =
    parseFloat(
      inputCurrencyValueElement.value.replace(".", "").replace(",", ".")
    ) || 0;
  const fromCurrency = currencySelectFrom.value;
  const toCurrency = currencySelectTo.value;

  // Elementos de exibição de valores
  const currencyValueToConvert = document.querySelector(
    ".currency-value-to-convert"
  );
  const currencyValueConverted = document.querySelector(".currency-value");

  // Exibe o valor de entrada formatado para a moeda de origem
  const fromData = currencyData[fromCurrency];
  currencyValueToConvert.innerHTML = new Intl.NumberFormat(fromData.locale, {
    style: "currency",
    currency: fromData.currency,
    ...(fromData.options || {}),
  }).format(inputCurrencyValue);

  // Se a moeda de origem e destino forem iguais, não faz nada
  if (fromCurrency === toCurrency) {
    currencyValueConverted.innerHTML = currencyValueToConvert.innerHTML;
    return;
  }

  // Mostra "Carregando..." enquanto busca os dados
  currencyValueConverted.innerHTML = "Carregando...";

  try {
    // A API nos dará as cotações em relação ao Real. Usaremos o Real como base para todas as conversões.
    const apiUrl =
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL";
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Cotações do dia
    const rates = {
      dolar: parseFloat(data.USDBRL.bid),
      euro: parseFloat(data.EURBRL.bid),
      bitcoin: parseFloat(data.BTCBRL.bid),
      real: 1, // A cotação do Real para ele mesmo é 1
    };

    // 1. Converte o valor de entrada para o valor base (Real)
    const valueInBRL = inputCurrencyValue * rates[fromCurrency];

    // 2. Converte o valor em Real para a moeda de destino
    const convertedValue = valueInBRL / rates[toCurrency];

    // Formata e exibe o valor final convertido
    const toData = currencyData[toCurrency];
    currencyValueConverted.innerHTML = new Intl.NumberFormat(toData.locale, {
      style: "currency",
      currency: toData.currency,
      ...(toData.options || {}),
    }).format(convertedValue);
  } catch (error) {
    console.error("Erro ao buscar cotações:", error);
    currencyValueConverted.innerHTML = "Erro nos dados.";
  }
}

/**
 * Função chamada quando qualquer um dos seletores de moeda é alterado.
 */
function handleCurrencyChange() {
  const fromCurrencyValue = currencySelectFrom.value;
  const toCurrencyValue = currencySelectTo.value;

  // Atualiza a exibição da moeda DE ORIGEM
  const fromCurrencyInfo = currencyData[fromCurrencyValue];
  document.getElementById("from-currency-name").textContent =
    fromCurrencyInfo.name;
  document.getElementById("from-currency-img").src = fromCurrencyInfo.img;

  // Atualiza a exibição da moeda PARA DESTINO
  const toCurrencyInfo = currencyData[toCurrencyValue];
  document.getElementById("to-currency-name").textContent = toCurrencyInfo.name;
  document.getElementById("to-currency-img").src = toCurrencyInfo.img;

  // Lógica para esconder a moeda de origem na lista de destino
  // Itera sobre todas as opções do seletor "PARA"
  for (const option of currencySelectTo.options) {
    // Se o valor da opção for igual à moeda de origem, esconde. Senão, mostra.
    option.style.display =
      option.value === fromCurrencyValue ? "none" : "block";
  }
  // Lógica para esconder a moeda de destino na lista de origem
  for (const option of currencySelectFrom.options) {
    option.style.display = option.value === toCurrencyValue ? "none" : "block";
  }

  // Se a moeda selecionada para conversão agora está escondida, muda para a primeira opção visível
  if (
    currencySelectTo.options[currencySelectTo.selectedIndex].style.display ===
    "none"
  ) {
    for (const option of currencySelectTo.options) {
      if (option.style.display !== "none") {
        currencySelectTo.value = option.value;
        handleCurrencyChange(); // Chama a função novamente para atualizar a imagem/nome
        break;
      }
    }
  }

  // Converte os valores automaticamente ao mudar a seleção
  convertValues();
}

// Adiciona os ouvintes de evento
convertButton.addEventListener("click", convertValues);
currencySelectFrom.addEventListener("change", handleCurrencyChange);
currencySelectTo.addEventListener("change", handleCurrencyChange);

// Chama a função uma vez no início para configurar o estado inicial da página
window.onload = handleCurrencyChange;
