# Sistema de Gerenciamento do PSIS

> Sistema desenvolvido para digitalização e gestão das atividades terapêuticas do Programa Saúde Integral do Ser (PSIS) do GREME - Grupo Espírita Meimei.

## 📚 Contexto Acadêmico

Este projeto foi desenvolvido como parte do **Projeto de Extensão IV (PEX IV)** da **Faculdade Descomplica**, com o objetivo de aplicar conhecimentos técnicos em uma solução real que beneficia a comunidade atendida pelo GREME.

## 🌟 Sobre o PSIS

O **PSIS (Programa Saúde Integral do Ser)** é um programa de assistência terapêutica integral realizado no **GREME (Grupo Espírita Meimei)**, que acontece todos os sábados e atende até 50 pessoas por dia.

### Abordagem Integral

O programa trata o ser humano de forma holística, abrangendo:

- **Dimensão Espiritual**: Através do estudo do evangelho (obrigatório para participação)
- **Corpo Mental**: Com o Diálogo Fraterno
- **Corpos Sutis**: Através de terapias complementares
- **Corpo Físico**: Distribuição de refeições

### Fluxo de Atendimento

1. **Primeira Sessão**: Todo paciente inicia com o **Diálogo Fraterno obrigatório**
2. **Indicação Terapêutica**: O terapeuta identifica e indica a terapia mais adequada:
   - Acupuntura
   - Barra de Access
   - Reiki
   - Meditação Guiada
3. **Ciclo Terapêutico**: 5 sessões da terapia indicada
4. **Reavaliação**: Na 6ª sessão, retorna ao Diálogo Fraterno para avaliação da evolução

### Funcionamento aos Sábados

- **Passe Espiritual**: 50 fichas distribuídas
- **Recepção**: Direcionamento para a terapia do dia
- **Terapias Adicionais** (sem necessidade de ficha):
  - Sol de Primavera (alfabetização de adultos)
  - Acolhimento de gestantes
  - Acolhimento de crianças

## 💻 Sobre o Sistema

### Problema Identificado

O controle de frequência e avaliação dos pacientes era feito manualmente através de fichas físicas, dificultando:

- Acompanhamento longitudinal dos pacientes
- Geração de métricas e estatísticas
- Avaliação da eficácia das terapias
- Gestão integrada das informações

### Solução Implementada

Sistema web completo para digitalização e gestão das atividades do PSIS, incluindo:

#### Funcionalidades Principais

✅ **Gestão de Assistidos**

- Cadastro de pacientes
- Histórico completo de atendimentos
- Acompanhamento por terapia

✅ **Controle de Atendimentos**

- Registro de presença nas sessões (até 10 sessões por terapia)
- Controle de frequência automático
- Organização por tipo de terapia

✅ **Sistema de Avaliações**

- Registro de evolução (Melhora, Estável, Piora)
- Observações detalhadas dos terapeutas
- Indicação de encaminhamentos

✅ **Dashboard e Métricas**

- Visão geral dos atendimentos
- Estatísticas por terapia
- Taxa de melhora dos assistidos
- Gráficos e indicadores

✅ **Gestão de Terapias**

- Cadastro de tipos de terapia
- Métricas específicas por terapia
- Acompanhamento de pacientes atendidos

✅ **Controle de Acesso**

- **Administrador**: Gestão completa (cadastro de usuários, terapias e pacientes)
- **Terapeuta**: Controle de frequência, avaliações e cadastro de pacientes

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React** + **TypeScript**: Framework e tipagem
- **Vite**: Build tool e dev server
- **TailwindCSS**: Estilização
- **shadcn/ui**: Componentes UI
- **Recharts**: Gráficos e visualizações
- **React Router**: Navegação

### Backend & Infraestrutura

- **Firebase**:
  - Authentication (autenticação de usuários)
  - Firestore (banco de dados NoSQL)
  - Hosting (deploy)

### Ferramentas de Desenvolvimento

- **ESLint**: Linting
- **Vitest**: Testes unitários
- **Bun**: Gerenciador de pacotes

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ ou Bun
- Conta no Firebase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/flaviare1s/psis.git
cd psis

# Instale as dependências
npm install
# ou
bun install
```

### Configuração

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Configure Authentication (Email/Password)
3. Crie um banco Firestore
4. Copie as credenciais e configure em `src/firebase/config.js`

### Executar em Desenvolvimento

```bash
npm run dev
# ou
bun dev
```

Acesse: `http://localhost:8080`

### Build para Produção

```bash
npm run build
# ou
bun run build
```

### Deploy

```bash
# Firebase Hosting
firebase deploy --only hosting
```

## 📁 Estrutura do Projeto

```
psis/
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes shadcn/ui
│   │   ├── AppSidebar.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ...
│   ├── pages/           # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── Assistidos.tsx
│   │   ├── Atendimentos.tsx
│   │   ├── Avaliacoes.tsx
│   │   └── ...
│   ├── firebase/        # Serviços Firebase
│   │   ├── auth.js
│   │   ├── assistidos.js
│   │   ├── atendimentos.js
│   │   └── ...
│   ├── lib/            # Utilitários e contextos
│   └── hooks/          # Custom hooks
├── public/             # Arquivos estáticos
└── firebase.json       # Configuração Firebase
```

## 👥 Contribuição

Este projeto foi desenvolvido como solução para uma necessidade real do GREME, buscando impactar positivamente a vida dos assistidos através da tecnologia.

## 📄 Licença

Este projeto é de uso interno do GREME - Grupo Espírita Meimei.

---

**Desenvolvido com ❤️ para o PSIS - Programa Saúde Integral do Ser**

_Faculdade Descomplica - Projeto de Extensão IV (PEX IV)_
