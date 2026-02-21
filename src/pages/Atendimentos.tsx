import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockAtendimentos,
  mockAssistidos,
  mockUsuarios,
  TERAPIAS,
} from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

export default function Atendimentos() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Atendimentos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Registro de sessões por terapia
          </p>
        </div>

        {TERAPIAS.map((terapia) => {
          const atendimentosTerapia = mockAtendimentos.filter(
            (a) => a.tipoTerapia === terapia.nome,
          );
          if (atendimentosTerapia.length === 0) return null;

          return (
            <div key={terapia.nome}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-6 h-6 rounded ${terapia.cor} flex items-center justify-center text-sm`}
                >
                  <terapia.icone className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">
                  {terapia.nome}
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({atendimentosTerapia.length})
                </span>
              </div>

              <div className="grid gap-3 mb-6">
                {atendimentosTerapia.map((at) => {
                  const assistido = mockAssistidos.find(
                    (a) => a.id === at.assistidoId,
                  );
                  const terapeuta = mockUsuarios.find(
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
                          <p className="font-semibold text-foreground text-sm">
                            {assistido?.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Terapeuta: {terapeuta?.nome}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            {presencas}/10
                          </p>
                          <p className="text-xs text-muted-foreground">
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
