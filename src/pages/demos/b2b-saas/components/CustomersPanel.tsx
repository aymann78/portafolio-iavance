import { formatCurrency } from '../utils';
import { Panel, DetailGrid, HealthBadge } from './Shared';
import { Account } from '../types';

export function CustomersPanel({
  accounts,
  selectedAccount,
  selectedAccountId,
  selectAccount,
}: {
  accounts: Account[];
  selectedAccount: Account;
  selectedAccountId: string;
  selectAccount: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
      <Panel title="Cartera operativa" eyebrow="Health view">
        <div className="space-y-3">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => selectAccount(account.id)}
              className={`w-full rounded-md border p-4 text-left transition ${
                account.id === selectedAccountId
                  ? 'border-cyan-300/25 bg-cyan-400/10'
                  : 'border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 hover:border-cyan-300/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{account.name}</p>
                  <p className="mt-2 text-sm text-[#8ea3a7]">
                    {account.segment} · tareas {account.openTasks} · facturas {account.pendingInvoices}
                  </p>
                </div>
                <HealthBadge health={account.health} />
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Cuenta seleccionada" eyebrow="Ficha accionable">
        <DetailGrid
          items={[
            ['Cliente', selectedAccount.name],
            ['Segmento', selectedAccount.segment],
            ['Credito', `${formatCurrency(selectedAccount.creditUsed)} / ${formatCurrency(selectedAccount.creditLimit)}`],
            ['Facturas', String(selectedAccount.pendingInvoices)],
            ['Salud', selectedAccount.health],
          ]}
        />
        <div className="mt-4 rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Que gana comercial</p>
          <p className="mt-3 text-sm leading-6 text-[#d5e0e2]">
            En una demo comercial se entiende que la cuenta no es solo CRM: es operativa, credito y seguimiento.
          </p>
        </div>
      </Panel>
    </div>
  );
}
