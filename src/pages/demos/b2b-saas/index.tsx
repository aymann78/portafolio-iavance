import { useB2bState } from './useB2bState';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OperationalBoard } from './components/OperationalBoard';
import { OrdersQueue } from './components/OrdersQueue';
import { InventoryPanel } from './components/InventoryPanel';
import { CustomersPanel } from './components/CustomersPanel';
import { FinancePanel } from './components/FinancePanel';
import { IntegrationsPanel } from './components/IntegrationsPanel';
import { InsightSidebar, RightSidebar } from './components/InsightSidebar';
import { Seo } from '../../../components/Seo';

export function B2bSaasLanding() {
  const { state, computed, actions } = useB2bState();

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-[#eef5f5]">
      <Seo 
        title="Demo: B2B Autoflow ERP | iavance.es" 
        description="Explora un centro de mando operativo interactivo." 
        path="/demo/b2b-saas-platform" 
      />
      <div className="absolute inset-x-0 top-0 h-96 bg-transparent" />
      <main className="relative mx-auto grid w-full max-w-[1580px] gap-4 px-4 py-4 xl:grid-cols-[236px_minmax(0,1fr)_336px]">
        
        {/* Left Sidebar */}
        <Sidebar
          activeModule={state.activeModule}
          switchModule={actions.switchModule}
          connectorState={state.connectorState}
        />

        {/* Center Area */}
        <section className="min-w-0 space-y-4">
          <Header
            currentModule={computed.currentModule}
            summary={computed.summary}
            resetDemo={actions.resetDemo}
          />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <div className="min-w-0 space-y-4">
              {state.activeModule === 'overview' && (
                <OperationalBoard
                  orders={state.orders}
                  selectedOrderId={state.selectedOrderId}
                  selectOrder={actions.selectOrder}
                />
              )}

              {state.activeModule === 'orders' && (
                <OrdersQueue
                  orders={state.orders}
                  selectedOrder={computed.selectedOrder}
                  selectedOrderId={state.selectedOrderId}
                  selectOrder={actions.selectOrder}
                  approveBlockedOrder={actions.approveBlockedOrder}
                />
              )}

              {state.activeModule === 'inventory' && (
                <InventoryPanel
                  stock={state.stock}
                  replenishStock={actions.replenishStock}
                />
              )}

              {state.activeModule === 'customers' && (
                <CustomersPanel
                  accounts={state.accounts}
                  selectedAccount={computed.selectedAccount}
                  selectedAccountId={state.selectedAccountId}
                  selectAccount={actions.selectAccount}
                />
              )}

              {state.activeModule === 'finance' && (
                <FinancePanel
                  orders={state.orders}
                  approveBlockedOrder={actions.approveBlockedOrder}
                />
              )}

              {state.activeModule === 'integrations' && (
                <IntegrationsPanel
                  connectorState={state.connectorState}
                  syncConnector={actions.syncConnector}
                />
              )}
            </div>

            {/* Inner Right Sidebar (Insight) */}
            <InsightSidebar
              activeModule={state.activeModule}
              selectedOrder={computed.selectedOrder}
              selectedAccount={computed.selectedAccount}
              lowStockItem={computed.lowStockItem}
              connectorState={state.connectorState}
              orders={state.orders}
              tasks={state.tasks}
              activity={state.activity}
              completeTask={actions.completeTask}
            />
          </div>
        </section>

        {/* Global Right Sidebar (Live Status) */}
        <RightSidebar
          orders={state.orders}
          tasks={state.tasks}
          activity={state.activity}
          completeTask={actions.completeTask}
        />
        
      </main>
    </div>
  );
}
