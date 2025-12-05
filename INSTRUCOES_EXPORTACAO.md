# Instruções para Exportar SVGs do Figma

## Passo a Passo

### 1. Exportar os Ícones do Figma

Para cada ícone/componente SVG no design do Figma:

1. **Selecione o elemento** no Figma
2. **Clique com o botão direito** ou use o painel direito
3. **Escolha "Export"** ou "Copy as SVG"
4. **Se exportar:**
   - Escolha formato **SVG**
   - Clique em **Export [Nome]**
   - Salve na pasta `public/icons/` com o nome correspondente abaixo

### 2. Mapeamento de Arquivos

Use estes nomes ao exportar:

#### Ícones Principais
- `home.svg` - Ícone de casa (Página Inicial)
- `home-active.svg` - Versão ativa (verde)
- `home-inactive.svg` - Versão inativa (cinza)
- `base.svg` - Ícone base usado em vários lugares

#### Menu Principal
- `plano-1.svg` e `plano-2.svg` - Ícones de Meu Plano
- `indicacoes-1.svg` até `indicacoes-6.svg` - Ícones de Indicações
- `chevron-down.svg` - Seta para baixo (dropdown)
- `chevron-down-inner.svg` - Parte interna da seta

#### Submenu de Indicações
- `carteira-1.svg` e `carteira-2.svg` - Ícones de Carteira
- `minhas-indicacoes-1.svg` até `minhas-indicacoes-3.svg` - Ícones de Minhas Indicações

#### Outros Menus
- `academy-1.svg` até `academy-4.svg` - Ícones de Academy
- `ajuda-1.svg` até `ajuda-5.svg` - Ícones de Central de Ajuda
- `config-1.svg` - Ícone de Configurações

#### Ícones Especiais
- `arrow-right.svg` - Seta para direita (usada nos cards)
- `lock.svg` - Cadeado (usado no card bloqueado)

### 3. Exportar Imagens PNG

#### Logo da Wise
- Selecione o logo no Figma
- Exporte como **PNG**
- Salve como `wise-logo.png` na pasta `public/`

#### Avatar do Usuário
- Selecione o avatar no Figma
- Exporte como **PNG**
- Salve como `user-avatar.png` na pasta `public/`

### 4. Estrutura Final

Após exportar, sua estrutura deve ficar assim:

```
public/
  ├── wise-logo.png
  ├── user-avatar.png
  └── icons/
      ├── home.svg
      ├── home-active.svg
      ├── home-inactive.svg
      ├── base.svg
      ├── plano-1.svg
      ├── plano-2.svg
      ├── indicacoes-1.svg
      ├── indicacoes-2.svg
      ├── indicacoes-3.svg
      ├── indicacoes-4.svg
      ├── indicacoes-5.svg
      ├── indicacoes-6.svg
      ├── chevron-down.svg
      ├── chevron-down-inner.svg
      ├── carteira-1.svg
      ├── carteira-2.svg
      ├── minhas-indicacoes-1.svg
      ├── minhas-indicacoes-2.svg
      ├── minhas-indicacoes-3.svg
      ├── academy-1.svg
      ├── academy-2.svg
      ├── academy-3.svg
      ├── academy-4.svg
      ├── ajuda-1.svg
      ├── ajuda-2.svg
      ├── ajuda-3.svg
      ├── ajuda-4.svg
      ├── ajuda-5.svg
      ├── config-1.svg
      ├── arrow-right.svg
      └── lock.svg
```

### 5. Dica: Exportação em Lote

Se o Figma tiver muitos ícones, você pode:
1. Selecionar múltiplos elementos
2. Usar "Export" para exportar todos de uma vez
3. Renomear os arquivos conforme o mapeamento acima

### 6. Verificação

Após exportar todos os arquivos:
1. Verifique se todos os arquivos estão na pasta correta
2. Reinicie o servidor Next.js (`npm run dev`)
3. As imagens devem aparecer automaticamente

## Nota

Se algum ícone não aparecer, verifique:
- O nome do arquivo está correto?
- O arquivo está na pasta correta?
- O formato está correto (SVG ou PNG)?

