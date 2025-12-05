# Uso de Ícones com Lucide React

## ✅ Vantagens

1. **Mudança de cores fácil**: Os ícones mudam de cor automaticamente via props `className`
2. **Sem exportação**: Não precisa exportar SVGs do Figma
3. **Leve e otimizado**: Biblioteca pequena e performática
4. **TypeScript**: Totalmente tipado
5. **Manutenção simples**: Fácil de atualizar e modificar

## 📦 Instalação

Execute no terminal:

```bash
npm install lucide-react
```

## 🎨 Como Funciona

Os ícones do Lucide React aceitam `className` para mudar cores:

```tsx
// Ícone ativo (verde)
<Home className="w-6 h-6 text-[#9fe870]" />

// Ícone inativo (cinza)
<Home className="w-6 h-6 text-[#e8ebe6]" />
```

## 🔄 Mapeamento de Ícones

Os ícones foram mapeados assim:

- **Página Inicial** → `Home`
- **Meu Plano** → `FileText`
- **Indicações** → `TrendingUp`
- **Carteira** → `Wallet`
- **Minhas indicações** → `Users`
- **Academy** → `GraduationCap`
- **Central de Ajuda** → `LifeBuoy`
- **Configurações** → `Settings`
- **Dropdown** → `ChevronDown`
- **Seta** → `ArrowRight`
- **Cadeado** → `Lock`

## 🎯 Personalização

Se quiser usar ícones diferentes do Lucide, basta trocar:

```tsx
// Trocar Home por outro ícone
import { Home, Building } from 'lucide-react';

// Usar Building em vez de Home
<Building className="w-6 h-6 text-[#9fe870]" />
```

## 📚 Documentação

Veja todos os ícones disponíveis em: https://lucide.dev/icons/

## 🆚 Comparação com SVGs Exportados

| Aspecto | Lucide React | SVGs Exportados |
|---------|--------------|-----------------|
| Mudança de cor | ✅ Fácil (via className) | ⚠️ Precisa editar SVG ou usar CSS complexo |
| Manutenção | ✅ Simples | ⚠️ Precisa re-exportar do Figma |
| Tamanho | ✅ Pequeno | ⚠️ Depende da quantidade |
| Performance | ✅ Otimizado | ✅ Bom |
| Customização | ⚠️ Limitado aos ícones disponíveis | ✅ Total controle |

## 💡 Dica

Se algum ícone do Lucide não corresponder exatamente ao design do Figma, você pode:
1. Usar um ícone similar do Lucide
2. Ou exportar apenas aquele ícone específico do Figma e usar como SVG inline

