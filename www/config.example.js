/* =========================================================
   Frota — configuração do front-end
   ---------------------------------------------------------
   1. Copie este arquivo para  config.js
   2. Preencha os valores abaixo
   3. config.js está no .gitignore — não vai para o GitHub

   Para publicar no GitHub Pages, veja o README (seção Deploy):
   o config.js é gerado no build a partir de GitHub Secrets.
========================================================= */
window.FROTA_CONFIG = {
  // Project URL do Supabase (Settings → API)
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',

  // Chave PUBLISHABLE / anon. Nunca use a service_role aqui.
  supabaseKey: 'SUA_CHAVE_PUBLISHABLE',

  // Nº de veículos considerado "frota oficial" nos indicadores
  frotaOficial: 60,

  // Dados de recebimento exibidos na tela de cobrança.
  // ATENÇÃO: se o repositório for público, deixe em branco aqui
  // e preencha em runtime pelo console do navegador:
  //   localStorage.setItem('dpl_pix', JSON.stringify({chave:'...', titular:'...'}))
  pix: {
    chave: '',
    titular: '',
    instituicao: '',
    banco: '',
    agencia: '',
    conta: ''
  }
};
