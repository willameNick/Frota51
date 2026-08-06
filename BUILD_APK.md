# Gerar o APK do Frota

O app é um PWA (single-file `index.html` + Supabase) empacotado como **APK Android via Capacitor**.
O ambiente onde ele foi montado bloqueia o download do Android SDK (política de rede), então o APK
é compilado automaticamente no **GitHub Actions**, que já tem o SDK e rede liberada.

## Como baixar o APK (jeito fácil)

1. Faça push nesta branch (`claude/transform-apk-qzr6w7`) ou rode o workflow manualmente:
   **Actions → "Build Android APK" → Run workflow**.
2. Quando terminar (verde), baixe o APK de um dos dois lugares:
   - **Releases** → `Frota APK (build N)` → arquivo `Frota.apk` (mais fácil).
   - **Actions → run → Artifacts → `Frota-apk`**.
3. No celular Android, instale o `Frota.apk` (permita "instalar de fontes desconhecidas").

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html`, `config.js`, `manifest.json`, `sw.js`, `icon-*.png` | O PWA (fonte de verdade) |
| `www/` | Cópia dos assets web que o Capacitor empacota (`webDir`) |
| `capacitor.config.json` | Config do app (`appId` = `br.com.frota.app`, `appName` = `Frota`) |
| `android/` | Projeto Android nativo gerado pelo Capacitor |
| `.github/workflows/build-apk.yml` | Pipeline que compila o APK |

## Build local (se você tiver o Android SDK instalado)

```bash
npm install
# atualiza os assets web dentro do projeto Android
npx cap sync android
# compila o APK de debug
cd android && ./gradlew assembleDebug
# resultado:
#   android/app/build/outputs/apk/debug/app-debug.apk
```

Se editar o app, mude **apenas** os arquivos web da raiz e rode `npx cap sync android` de novo —
nunca edite o HTML dentro de `android/`.

## Sobre o APK

- É um **APK de debug** (assinado com a chave de debug), instalável direto no aparelho.
- Para publicar na Play Store é preciso um **APK/AAB de release assinado** com sua própria keystore.
