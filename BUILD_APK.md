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

---

# Versão de RELEASE assinada (Play Store)

Além do APK de debug, há o workflow **"Build Signed Release (AAB + APK)"**
(`.github/workflows/build-release.yml`) que gera:

- `Frota-release.aab` → o arquivo para subir na **Google Play Console**.
- `Frota-release.apk` → APK assinado com a chave de release (instalação direta).

## Passo único: configurar os Secrets no GitHub

O build de release assina com uma **keystore** — a chave que identifica o app na
Play Store. **Guarde a keystore com muito cuidado:** se perdê-la, você não consegue
mais atualizar o app publicado. Ela nunca fica no repositório; entra como *secrets*.

Em **Settings → Secrets and variables → Actions → New repository secret**, crie:

| Secret | Valor |
|---|---|
| `KEYSTORE_BASE64` | conteúdo do arquivo `frota-release.keystore.b64` (o base64 da keystore) |
| `KEYSTORE_PASSWORD` | a senha da keystore |
| `KEY_ALIAS` | `frota` |
| `KEY_PASSWORD` | a senha da chave (a mesma da keystore) |

> A keystore, o base64 e as senhas foram entregues a você separadamente (fora do repositório).
> Se preferir gerar a sua própria keystore:
> ```bash
> keytool -genkeypair -v -keystore frota-release.keystore \
>   -alias frota -keyalg RSA -keysize 2048 -validity 10000
> base64 -w0 frota-release.keystore   # cole o resultado em KEYSTORE_BASE64
> ```

## Rodar

- **Actions → "Build Signed Release (AAB + APK)" → Run workflow**, ou
- crie uma tag `vX.Y.Z` (`git tag v1.0.0 && git push --tags`).

O AAB/APK assinados aparecem em **Releases** e em **Artifacts** do run.

## Versionamento

Para cada envio novo à Play Store, incremente em `android/app/build.gradle`:
`versionCode` (inteiro, sempre maior) e `versionName` (ex.: `"1.1"`).
