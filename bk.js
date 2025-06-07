// Seleciona o botão de conversão do DOM.
const convertButton = document.querySelector('.convert-button');
// Seleciona o elemento de seleção de moeda do DOM.
const currencySelect = document.querySelector('.currency-select');

/**
 * Função para converter os valores das moedas.
 */
async function convertValues() {
  // Obtém o valor inserido pelo usuário no campo de entrada.
  const inputCurrencyValue = document.querySelector('.input-currency').value;
  // Seleciona o elemento DOM onde o valor a ser convertido é exibido.
  const currencyValueToConvert = document.querySelector(
    '.currency-value-to-convert'
  );
  // Seleciona o elemento DOM onde o valor convertido é exibido.
  const currencyValueConverted = document.querySelector('.currency-value');
  // Mensagem de "carregando" enquanto a API é consultada.
  currencyValueConverted.innerHTML = 'Carregando...';
  try {
    // URL da API para buscar as cotações de Dólar, Euro e Bitcoin em relação ao Real.
    const apiUrl =
      'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL';

    // Faz a chamada à API e espera a resposta.
    const response = await fetch(apiUrl);

    // Converte a resposta para JSON.
    const data = await response.json();

    // Extrai as cotações da resposta da API.
    const dolarToday = parseFloat(data.USDBRL.bid);
    const euroToday = parseFloat(data.EURBRL.bid);
    // O valor do Bitcoin vem em milhares, então multiplicamos por 1000.
    const bitcoinToday = parseFloat(data.BTCBRL.bid) * 1000;

    let convertedValue;
    let formatOptions;

    // Verifica se a moeda selecionada é dólar.
    if (currencySelect.value == 'dolar') {
      // Calcula o valor convertido para dólar.
      const convertedValue = inputCurrencyValue / dolarToday;
      // Formata e exibe o valor convertido em dólar.
      currencyValueConverted.innerHTML = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(convertedValue);
    }
    // Verifica se a moeda selecionada é euro.
    if (currencySelect.value == 'euro') {
      // Calcula o valor convertido para euro.
      const convertedValue = inputCurrencyValue / euroToday;
      // Formata e exibe o valor convertido em euro.
      currencyValueConverted.innerHTML = new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'EUR',
      }).format(convertedValue);
    }
    // Verifica se a moeda selecionada é bitcoin
    if (currencySelect.value == 'bitcoin') {
      // Calcula o valor convertido para bitcoin.
      const convertedValue = inputCurrencyValue / bitcoinToday;
      // Formata e exibe o valor convertido em bitcoin.
      currencyValueConverted.innerHTML = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'BTC',
        minimumFractionDigits: 6,
      }).format(convertedValue);
    }
  } catch (error) {
    // Em caso de erro na API, exibe uma mensagem amigável.
    console.error('Erro ao buscar cotações:', error);
    currencyValueConverted.innerHTML = 'Erro ao buscar dados.';
  }

  // Formata e exibe o valor original em reais (BRL).
  currencyValueToConvert.innerHTML = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(inputCurrencyValue);
}

/**
 * Função para alterar a moeda e a imagem associada.
 */
function changeCurrency() {
  // Seleciona o elemento DOM onde o nome da moeda é exibido.
  const currencyName = document.getElementById('currency-name');
  // Seleciona o elemento DOM onde a imagem da moeda é exibida.
  const currencyImage = document.querySelector('.currency-img');
  // Verifica se a moeda selecionada é dólar.
  if (currencySelect.value == 'dolar') {
    // Atualiza o nome da moeda para "Dólar Americano".
    currencyName.innerHTML = 'Dólar Americano';
    // Atualiza a imagem da moeda para a bandeira dos EUA.
    currencyImage.src = './assets/usa.png';
  }
  // Verifica se a moeda selecionada é euro.
  if (currencySelect.value == 'euro') {
    // Atualiza o nome da moeda para "Euro".
    currencyName.innerHTML = 'Euro';
    // Atualiza a imagem da moeda para a bandeira da União Europeia.
    currencyImage.src = './assets/euro.png';
  }
  if (currencySelect.value == 'bitcoin') {
    currencyName.innerHTML = 'Bitcoin';
    currencyImage.src = './assets/bitcoin.png';
  }

  // Chama a função para converter os valores, atualizando a exibição.
  convertValues();
}

// Adiciona um ouvinte de evento para o elemento de seleção de moeda, chamando a função `changeCurrency` quando a seleção mudar.
currencySelect.addEventListener('change', changeCurrency);

// Adiciona um ouvinte de evento para o botão de conversão, chamando a função `convertValues` quando o botão for clicado.
convertButton.addEventListener('click', convertValues);
