export type TipoTerapia = 'Diálogo Fraterno' | 'Reiki' | 'Acupuntura' | 'Barra de Access' | 'Meditação Guiada';

export type StatusEvolucao = 'Melhora' | 'Estável' | 'Piora';

export interface Assistido {
  id: string;
  nome: string;
  status: 'Ativo' | 'Inativo';
  dataInicio: string;
}

export interface Sessao {
  numero: number;
  data: string | null;
  presente: boolean;
  observacoes: string;
}

export interface Atendimento {
  id: string;
  assistidoId: string;
  terapeutaId: string;
  tipoTerapia: TipoTerapia;
  sessoes: Sessao[];
}

export interface Avaliacao {
  id: string;
  assistidoId: string;
  tipoTerapia: TipoTerapia;
  statusEvolucao: StatusEvolucao;
  dataAvaliacao: string;
  observacoes: string;
  encaminhamentos: string[];
}

export interface Usuario {
  id: string;
  nome: string;
  role: 'admin' | 'terapeuta';
  email: string;
}

export const TERAPIAS: { nome: TipoTerapia; cor: string; icone: string }[] = [
  { nome: 'Diálogo Fraterno', cor: 'therapy-dialogo', icone: '💬' },
  { nome: 'Reiki', cor: 'therapy-reiki', icone: '🙌' },
  { nome: 'Acupuntura', cor: 'therapy-acupuntura', icone: '📍' },
  { nome: 'Barra de Access', cor: 'therapy-barra', icone: '✨' },
  { nome: 'Meditação Guiada', cor: 'therapy-meditacao', icone: '🧘' },
];

export const ENCAMINHAMENTOS = [
  'Evangelhoterapia / Passe',
  'ATE',
  'ESDE',
  'Evangelho no lar',
  'Leituras Edificantes',
  'Rede de apoio',
  'Retorno',
];

export const mockUsuarios: Usuario[] = [
  { id: '1', nome: 'Maria Silva', role: 'admin', email: 'admin@greme.org' },
  { id: '2', nome: 'João Santos', role: 'terapeuta', email: 'joao@greme.org' },
  { id: '3', nome: 'Ana Oliveira', role: 'terapeuta', email: 'ana@greme.org' },
];

export const mockAssistidos: Assistido[] = [
  { id: '1', nome: 'Carlos Mendes', status: 'Ativo', dataInicio: '2025-11-02' },
  { id: '2', nome: 'Fernanda Lima', status: 'Ativo', dataInicio: '2025-10-15' },
  { id: '3', nome: 'Roberto Alves', status: 'Ativo', dataInicio: '2026-01-10' },
  { id: '4', nome: 'Patrícia Costa', status: 'Inativo', dataInicio: '2025-08-20' },
  { id: '5', nome: 'Lucas Ferreira', status: 'Ativo', dataInicio: '2026-02-01' },
];

function criarSessoes(preenchidas: number): Sessao[] {
  return Array.from({ length: 10 }, (_, i) => ({
    numero: i + 1,
    data: i < preenchidas ? `2026-0${Math.min(i + 1, 2)}-${String((i + 1) * 7).padStart(2, '0').slice(0, 2)}` : null,
    presente: i < preenchidas,
    observacoes: i < preenchidas ? 'Sessão realizada com sucesso.' : '',
  }));
}

export const mockAtendimentos: Atendimento[] = [
  { id: '1', assistidoId: '1', terapeutaId: '2', tipoTerapia: 'Reiki', sessoes: criarSessoes(4) },
  { id: '2', assistidoId: '1', terapeutaId: '2', tipoTerapia: 'Diálogo Fraterno', sessoes: criarSessoes(1) },
  { id: '3', assistidoId: '2', terapeutaId: '3', tipoTerapia: 'Acupuntura', sessoes: criarSessoes(6) },
  { id: '4', assistidoId: '3', terapeutaId: '2', tipoTerapia: 'Barra de Access', sessoes: criarSessoes(2) },
  { id: '5', assistidoId: '5', terapeutaId: '3', tipoTerapia: 'Meditação Guiada', sessoes: criarSessoes(3) },
];

export const mockAvaliacoes: Avaliacao[] = [
  {
    id: '1', assistidoId: '2', tipoTerapia: 'Acupuntura', statusEvolucao: 'Melhora',
    dataAvaliacao: '2026-02-15', observacoes: 'Paciente relata melhora significativa.',
    encaminhamentos: ['Evangelho no lar', 'Leituras Edificantes'],
  },
];
