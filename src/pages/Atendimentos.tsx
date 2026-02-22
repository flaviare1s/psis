import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { getAtendimentos } from "@/firebase/atendimentos";
import { getAssistidos } from "@/firebase/assistidos";
import { getUsuarios } from "@/firebase/usuarios";
import { getTerapias } from "@/firebase/terapias";

interface Sessao {
  numero: number;
  data: string | null;
  presente: boolean;
  observacoes: string;
}

interface Atendimento {
  id: string;
  assistidoId: string;
  terapeutaId: string;
  tipoTerapia: string;
  sessoes: Sessao[];
}

interface Assistido {
  id: string;
  nome: string;
}

interface Usuario {
  id: string;
  nome: string;
}

interface Terapia {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

export default function Atendimentos() {
  const navigate = useNavigate();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [terapias, setTerapias] = useState<Terapia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [atendimentosData, assistidosData, usuariosData, terapiasData] =
        await Promise.all([
          getAtendimentos(),
          getAssistidos(),
          getUsuarios(),
          getTerapias(),
        ]);

      setAtendimentos(atendimentosData as Atendimento[]);
      setAssistidos(assistidosData as Assistido[]);
      setUsuarios(usuariosData as Usuario[]);
      setTerapias(terapiasData as Terapia[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Circle;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Atendimentos
          </h1>
          <p className="text-muted-foreground text-base mt-1">
            Registro de sessões por terapia
          </p>
        </div>

        {terapias.map((terapia) => {
          const atendimentosTerapia = atendimentos.filter(
            (a) => a.tipoTerapia === terapia.nome,
          );
          if (atendimentosTerapia.length === 0) return null;

          const IconComponent = getIconComponent(terapia.icone);

          return (
            <div key={terapia.id}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-6 h-6 rounded ${terapia.cor} flex items-center justify-center text-base`}
                >
                  <IconComponent className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">
                  {terapia.nome}
                </h2>
                <span className="text-base text-muted-foreground">
                  ({atendimentosTerapia.length})
                </span>
              </div>

              <div className="grid gap-3 mb-6">
                {atendimentosTerapia.map((at) => {
                  const assistido = assistidos.find(
                    (a) => a.id === at.assistidoId,
                  );
                  const terapeuta = usuarios.find(
                    (u) => u.id === at.terapeutaId,
                  );
                  const presencas = at.sessoes.filter((s) => s.presente).length;

                  return (
                    <Card
                      key={at.id}
                      className="cursor-pointer hover:shadow-md transition-all border-border/50"
                      onClick={() => navigate(`/assistidos/${at.assistidoId}`)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-base">
                            {assistido?.nome}
                          </p>
                          <p className="text-base text-muted-foreground">
                            Terapeuta: {terapeuta?.nome}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-foreground">
                            {presencas}/10
                          </p>
                          <p className="text-base text-muted-foreground">
                            sessões
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
