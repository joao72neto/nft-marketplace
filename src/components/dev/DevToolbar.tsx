import React, { useState, useEffect } from "react";
import {
  getActiveScenario,
  setActiveDevScenario,
  getNetworkConditions,
  setNetworkConditions,
} from "@/mocks/scenarios/active-scenario";
import type { ScenarioId } from "@/mocks/scenarios/types";
import { resetDatabase } from "@/mocks/db";
import {
  emitMockSocketEvent,
  getActiveSocketClientsCount,
} from "@/mocks/socket/emitter";

const SCENARIOS_LIST: { id: ScenarioId; label: string }[] = [
  { id: "default", label: "01. Default (Sucesso)" },
  { id: "empty-catalog", label: "02. Catálogo Vazio" },
  { id: "variable-latency", label: "03. Latência Variável / Fora de Ordem" },
  { id: "transient-errors", label: "04. Erros Transitórios 500/503" },
  { id: "network-failure", label: "05. Falha de Conexão (Offline)" },
  { id: "expired-session", label: "06. Sessão Expirada (401)" },
  { id: "register-conflict", label: "07. Conflito de Cadastro (409)" },
  { id: "coupon-expired", label: "08. Cupom Expirado (422)" },
  { id: "price-changed", label: "09. Preço Alterado (409)" },
  { id: "edition-sold-out", label: "10. Edição Esgotada (409)" },
  { id: "order-timeout", label: "11. Timeout no Pedido" },
  { id: "payment-refused", label: "12. Pagamento Recusado" },
];

export const DevToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState(getActiveScenario());
  const [network, setNetworkState] = useState(getNetworkConditions());
  const [clientsCount, setClientsCount] = useState(
    getActiveSocketClientsCount(),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInfo(getActiveScenario());
      setClientsCount(getActiveSocketClientsCount());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as ScenarioId;
    setActiveDevScenario(selected);
    setActiveInfo(getActiveScenario());
    setStatusMessage(`Cenário "${selected}" selecionado.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const latencyMs = parseInt(e.target.value, 10);
    setNetworkConditions({ latencyMs });
    setNetworkState(getNetworkConditions());
  };

  const handleReset = () => {
    resetDatabase();
    setStatusMessage("Mocks e estado restaurados para fixtures!");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSimulateNftUpdate = () => {
    emitMockSocketEvent("nft.updated", {
      eventId: `evt_dev_${Date.now()}`,
      resource: "nft",
      resourceId: "nft-01",
      version: Date.now(),
      timestamp: new Date().toISOString(),
      data: {
        priceEth: "0.59",
        availableEditions: 1,
        totalEditions: 50,
        isAvailable: true,
      },
    });
    setStatusMessage("Evento nft.updated disparado via Socket.IO!");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <aside
      aria-label="Painel de controle de simulação e cenários"
      className="fixed bottom-4 right-4 z-50 font-mono text-xs text-[#F5F1EB]"
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#241612] border border-[#D28A4C] px-3 py-2 rounded-md shadow-lg hover:bg-[#2F1D15] transition-colors"
          title="Abrir painel de cenários de teste"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#D28A4C] animate-pulse" />
          <span className="font-bold">DEV MOCKS</span>
          <span className="text-[#CFB28C]">({activeInfo.scenario})</span>
        </button>
      ) : (
        <div className="bg-[#241612] border border-[#3F2319] w-80 p-4 rounded-lg shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#3F2319] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D28A4C]" />
              <span className="font-bold text-sm text-[#F5F1EB]">
                Painel de Cenários (MSW)
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#CFB28C] hover:text-[#F5F1EB] px-1.5 py-0.5 rounded text-sm"
              title="Fechar painel"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="block text-[#CFB28C] mb-1">
              Cenário Ativo{" "}
              <span className="text-[10px] text-[#B39463]">
                ({activeInfo.source})
              </span>
              :
            </label>
            <select
              value={activeInfo.scenario}
              onChange={handleScenarioChange}
              className="w-full bg-[#140D0A] border border-[#3F2319] text-[#F5F1EB] rounded px-2 py-1.5 focus:outline-none focus:border-[#D28A4C]"
            >
              {SCENARIOS_LIST.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[#CFB28C] mb-1">
              <span>Latência Artificial:</span>
              <span>{network.latencyMs} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={network.latencyMs}
              onChange={handleLatencyChange}
              className="w-full accent-[#D28A4C]"
            />
          </div>

          <div className="bg-[#140D0A] p-2 rounded border border-[#3F2319] text-[11px] text-[#CFB28C] flex flex-col gap-1">
            <div>
              Status Socket:{" "}
              <span className="text-[#E89B55]">
                {clientsCount} cliente(s) ativo(s)
              </span>
            </div>
            <div>
              Precedência:{" "}
              <span className="text-[#F5F1EB]">URL &gt; Painel &gt; Env</span>
            </div>
          </div>

          {statusMessage && (
            <div className="bg-[#38220F] text-[#E89B55] p-1.5 rounded text-center text-[11px]">
              {statusMessage}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleReset}
              className="flex-1 bg-[#140D0A] border border-[#F0805F] text-[#F0805F] hover:bg-[#F0805F] hover:text-[#140D0A] py-1.5 rounded transition-colors text-center"
            >
              Reset Mock DB
            </button>
            <button
              onClick={handleSimulateNftUpdate}
              className="flex-1 bg-[#D28A4C] text-[#140D0A] font-bold hover:bg-[#E89B55] py-1.5 rounded transition-colors text-center"
            >
              Testar Socket
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
