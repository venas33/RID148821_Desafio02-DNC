document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cep");
  const latitudeInput = document.querySelector('input[placeholder="Latitude"]');
  const longitudeInput = document.querySelector('input[placeholder="Longitude"]');
  const cepResultBody = document.getElementById("cep-result-body");
  const weatherResultBody = document.getElementById("weather-result-body");
  const acessarButton = document.getElementById("Acessar");
  const errorMessage = document.getElementById("error-message");


  function exibirErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.style.display = "block";

    
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  }

 
  async function buscarEndereco(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        exibirErro("CEP não encontrado! Verifique o número e tente novamente.");
        return;
      }

      
      cepResultBody.innerHTML = `
        <tr>
          <td>${data.logradouro || "N/A"}</td>
          <td>${data.bairro || "N/A"}</td>
          <td>${data.localidade || "N/A"}/${data.uf || "N/A"}</td>
        </tr>
      `;
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      exibirErro("Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.");
    }
  }

 
  async function buscarPrevisaoDoTempo(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
      );
      const data = await response.json();

      if (data.hourly && data.hourly.temperature_2m) {
        const temperatura = data.hourly.temperature_2m[0];

        
        weatherResultBody.innerHTML = `
          <tr>
            <td style="border-radius: 20px;">
              <strong>Previsão de tempo de acordo com a região: ${temperatura}° C</strong>
            </td>
          </tr>
        `;
      } else {
        exibirErro("Não foi possível obter a previsão do tempo.");
      }
    } catch (error) {
      console.error("Erro ao buscar previsão do tempo:", error);
      exibirErro("Erro ao buscar a previsão do tempo. Tente novamente mais tarde.");
    }
  }

  
  acessarButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const cep = cepInput.value.trim();
    const latitude = latitudeInput.value.trim();
    const longitude = longitudeInput.value.trim();

   
    cepResultBody.innerHTML = "";
    weatherResultBody.innerHTML = "";

   
    if (cep) {
      await buscarEndereco(cep);
    } else {
      exibirErro("Por favor, insira um CEP válido.");
    }

    if (latitude && longitude) {
      await buscarPrevisaoDoTempo(latitude, longitude);
    } else {
      exibirErro("Por favor, insira latitude e longitude para a previsão do tempo.");
    }
  });
});
