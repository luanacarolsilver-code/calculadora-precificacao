// ==========================================================================
// STATE MANAGEMENT & DATA DEFINITIONS
// ==========================================================================

const categoryNames = {
    infra: 'Infraestrutura e Utilidades',
    equipe: 'Equipe e Salários',
    operacional: 'Operacional e Geral',
    conselhos: 'Anualidades e Conselhos'
};

const categoryIcons = {
    infra: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    equipe: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    operacional: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    conselhos: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`
};

const defaultFixedCosts = [
    // Infraestrutura e Utilidades
    { id: 'fc-aluguel', name: 'Aluguel', category: 'infra', value: 1800 },
    { id: 'fc-condominio', name: 'Condomínio', category: 'infra', value: 450 },
    { id: 'fc-iptu', name: 'IPTU', category: 'infra', value: 100 },
    { id: 'fc-agua', name: 'Água', category: 'infra', value: 60 },
    { id: 'fc-energia', name: 'Energia', category: 'infra', value: 250 },
    { id: 'fc-internet', name: 'Internet', category: 'infra', value: 120 },
    { id: 'fc-telefone', name: 'Telefone', category: 'infra', value: 50 },
    { id: 'fc-celular', name: 'Celular', category: 'infra', value: 70 },
    
    // Equipe e Salários
    { id: 'fc-secretaria', name: 'Salário da Secretária', category: 'equipe', value: 1500 },
    { id: 'fc-prolabore', name: 'Pró-Labores (Sócios)', category: 'equipe', value: 4000 },
    { id: 'fc-bolsa-estagio', name: 'Bolsa dos Estagiários', category: 'equipe', value: 1600 },
    { id: 'fc-arquiteto-colab', name: 'Salário do Arquiteto Colaborador', category: 'equipe', value: 0 },
    { id: 'fc-13th', name: '1/12 do 13º Salário dos Funcionários', category: 'equipe', value: 200 },
    { id: 'fc-vacations', name: '1/12 das Férias dos Funcionários', category: 'equipe', value: 200 },
    { id: 'fc-inss', name: 'INSS', category: 'equipe', value: 350 },
    { id: 'fc-fgts', name: 'FGTS', category: 'equipe', value: 200 },
    { id: 'fc-transporte', name: 'Vale Transporte / Combustível', category: 'equipe', value: 250 },
    { id: 'fc-alimentacao', name: 'Auxílio Alimentação', category: 'equipe', value: 350 },

    // Operacional e Geral
    { id: 'fc-contador', name: 'Contador', category: 'operacional', value: 500 },
    { id: 'fc-faxina', name: 'Faxina', category: 'operacional', value: 180 },
    { id: 'fc-cafe', name: 'Despesas com Café', category: 'operacional', value: 80 },
    { id: 'fc-papelaria', name: 'Papelaria e Material', category: 'operacional', value: 100 },
    { id: 'fc-cartuchos', name: 'Cartuchos para Impressora', category: 'operacional', value: 60 },
    { id: 'fc-manutencao', name: 'Manutenção de Equipamentos', category: 'operacional', value: 100 },
    { id: 'fc-tarifas', name: 'Tarifas Bancárias', category: 'operacional', value: 40 },
    { id: 'fc-maquininha', name: 'Máquina de Cartão de Crédito', category: 'operacional', value: 50 },

    // Conselhos
    { id: 'fc-cau-crea-pj', name: 'Anuidade Conselho (PJ)', category: 'conselhos', value: 60 },
    { id: 'fc-cau-crea-pf', name: 'Anuidade Conselho (PF)', category: 'conselhos', value: 40 }
];

const defaultProjectPhases = [
    { id: 'ph-propostas', name: 'Elaboração de Propostas', hours: 8 },
    { id: 'ph-medicoes', name: 'Medições e Conferências', hours: 12 },
    { id: 'ph-estudo-preliminar', name: 'Estudo Preliminar do Projeto', hours: 40 },
    { id: 'ph-rev-estudo', name: 'Revisões do Estudo Preliminar', hours: 15 },
    { id: 'ph-projeto-legal', name: 'Projeto Legal (Prefeitura e Órgãos)', hours: 30 },
    { id: 'ph-rev-legal', name: 'Revisões do Projeto Legal', hours: 10 },
    { id: 'ph-complementares', name: 'Projetos Complementares e Compatibilizações', hours: 25 },
    { id: 'ph-rev-complementares', name: 'Revisões de Projetos Complementares', hours: 8 },
    { id: 'ph-projeto-executivo', name: 'Projeto Executivo', hours: 60 },
    { id: 'ph-rev-executivo', name: 'Revisões do Projeto Executivo', hours: 20 },
    { id: 'ph-planilhas', name: 'Planilhas Orçamentárias', hours: 12 },
    { id: 'ph-visita-lojas', name: 'Visitas a Lojas e Fornecedores', hours: 10 },
    { id: 'ph-visita-obra', name: 'Visita a Obra', hours: 25 }
];

const defaultVariableCosts = [
    { id: 'vc-uber', name: 'Uber para deslocamento de clientes/obra', value: 150 },
    { id: 'vc-combustivel', name: 'Combustível para deslocamento', value: 200 },
    { id: 'vc-pedagio', name: 'Pedágio (quando houver)', value: 0 },
    { id: 'vc-estacionamento', name: 'Despesas com estacionamento', value: 50 },
    { id: 'vc-rrt', name: 'RRT\'s / ART\'s (Registro de Responsabilidade)', value: 120 },
    { id: 'vc-terceirizado', name: 'Mão de obra terceirizada', value: 0 },
    { id: 'vc-plotagem', name: 'Plotagem e Impressões dos Projetos', value: 180 },
    { id: 'vc-comissao', name: 'Comissões / Presentes de Indicação', value: 0 },
    { id: 'vc-pastas-mimos', name: 'Pastas e Mimos na entrega do projeto', value: 100 }
];

// App State
let state = {
    fixedCosts: [],
    workdays: 20,
    team: {
        owner: { hours: 6, qty: 1 },
        collaborators: { hours: 6, qty: 0 },
        interns: { hours: 4, qty: 2 }
    },
    projectPhases: [],
    variableCosts: [],
    profitMargin: 30,
    taxRate: 6,
    taxMethod: 'inside', // 'inside' or 'outside'
    savedProjects: []
};

// ==========================================================================
// INITIALIZATION & LOCAL STORAGE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    // Load from local storage or use defaults
    const savedState = localStorage.getItem('precificacao_state');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            // Merge loaded state to ensure new keys aren't broken
            state = { ...state, ...parsed };
        } catch (e) {
            console.error('Erro ao ler estado do localStorage, usando padrões.', e);
            loadDefaults();
        }
    } else {
        loadDefaults();
    }

    // Set date in report
    const today = new Date();
    document.getElementById('report-date').textContent = today.toLocaleDateString('pt-BR');

    // Render initial UI elements
    renderFixedCosts();
    renderProductivity();
    renderProjectPhases();
    renderVariableCosts();
    updateTogglesAndSliders();
    loadSavedProjects();
    
    // Trigger calculation
    calculateAll();
}

function loadDefaults() {
    state.fixedCosts = JSON.parse(JSON.stringify(defaultFixedCosts));
    state.projectPhases = JSON.parse(JSON.stringify(defaultProjectPhases));
    state.variableCosts = JSON.parse(JSON.stringify(defaultVariableCosts));
    state.workdays = 20;
    state.team = {
        owner: { hours: 6, qty: 1 },
        collaborators: { hours: 6, qty: 0 },
        interns: { hours: 4, qty: 2 }
    };
    state.profitMargin = 30;
    state.taxRate = 6;
    state.taxMethod = 'inside';
}

function saveStateToLocalStorage() {
    localStorage.setItem('precificacao_state', JSON.stringify(state));
}

// ==========================================================================
// RENDERING FUNCTIONS
// ==========================================================================

function renderFixedCosts(searchTerm = '') {
    const container = document.getElementById('fixed-costs-groups');
    container.innerHTML = '';

    // Group fixed costs by category
    const grouped = { infra: [], equipe: [], operacional: [], conselhos: [] };
    
    state.fixedCosts.forEach(cost => {
        if (searchTerm === '' || cost.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            grouped[cost.category].push(cost);
        }
    });

    Object.keys(grouped).forEach(cat => {
        if (grouped[cat].length === 0 && searchTerm !== '') return; // Hide empty search categories

        const catCard = document.createElement('div');
        catCard.className = 'card card-glass cost-category-card';
        
        // Sum of category
        const catSum = grouped[cat].reduce((sum, cost) => sum + (Number(cost.value) || 0), 0);

        catCard.innerHTML = `
            <div class="category-header">
                <h3>${categoryIcons[cat]} ${categoryNames[cat]}</h3>
                <span class="category-total" id="cat-total-${cat}">Subtotal: R$ ${formatMoney(catSum)}</span>
            </div>
            <div class="inputs-grid" id="cat-grid-${cat}"></div>
        `;
        
        container.appendChild(catCard);
        const grid = document.getElementById(`cat-grid-${cat}`);

        grouped[cat].forEach(cost => {
            const inputItem = document.createElement('div');
            inputItem.className = 'cost-input-item';
            inputItem.innerHTML = `
                <div class="cost-input-header">
                    <label for="fc-input-${cost.id}" title="${cost.name}">${cost.name}</label>
                    <button type="button" class="btn-delete-item" onclick="deleteFixedCost('${cost.id}')" title="Excluir Custo">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
                <div class="input-currency">
                    <span class="currency-symbol">R$</span>
                    <input type="number" id="fc-input-${cost.id}" value="${cost.value}" min="0" step="0.01" class="form-input cost-val-input" data-id="${cost.id}">
                </div>
            `;
            grid.appendChild(inputItem);

            // Bind real-time inputs
            const input = inputItem.querySelector('input');
            input.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 0;
                cost.value = val;
                saveStateToLocalStorage();
                calculateAll();
                updateCategoryTotal(cat);
            });
        });
    });
}

function updateCategoryTotal(cat) {
    const subtotal = state.fixedCosts
        .filter(c => c.category === cat)
        .reduce((sum, cost) => sum + (Number(cost.value) || 0), 0);
    const totalEl = document.getElementById(`cat-total-${cat}`);
    if (totalEl) {
        totalEl.textContent = `Subtotal: R$ ${formatMoney(subtotal)}`;
    }
}

function renderProductivity() {
    document.getElementById('input-workdays').value = state.workdays;
    
    // Owner
    document.getElementById('hours-owner').value = state.team.owner.hours;
    document.getElementById('qty-owner').value = state.team.owner.qty;
    
    // Collaborators
    document.getElementById('hours-collaborators').value = state.team.collaborators.hours;
    document.getElementById('qty-collaborators').value = state.team.collaborators.qty;
    
    // Interns
    document.getElementById('hours-interns').value = state.team.interns.hours;
    document.getElementById('qty-interns').value = state.team.interns.qty;

    updateProductivitySubtotals();
}

function updateProductivitySubtotals() {
    const days = state.workdays;
    
    const ownerSub = state.team.owner.hours * state.team.owner.qty * days;
    document.getElementById('subtotal-owner').textContent = `${ownerSub}h`;

    const collabSub = state.team.collaborators.hours * state.team.collaborators.qty * days;
    document.getElementById('subtotal-collaborators').textContent = `${collabSub}h`;

    const internsSub = state.team.interns.hours * state.team.interns.qty * days;
    document.getElementById('subtotal-interns').textContent = `${internsSub}h`;
}

function renderProjectPhases() {
    const tbody = document.getElementById('project-phases-list');
    tbody.innerHTML = '';

    state.projectPhases.forEach(phase => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${phase.name}</td>
            <td>
                <input type="number" value="${phase.hours}" min="0" step="0.5" class="form-input phase-hour-input" data-id="${phase.id}" style="padding: 8px 12px; font-size: 0.9rem;">
            </td>
            <td>
                <span class="phase-row-cost" id="phase-cost-${phase.id}">R$ 0,00</span>
            </td>
            <td style="width: 50px; text-align: center;">
                <button type="button" class="btn-delete-item" onclick="deleteProjectPhase('${phase.id}')" title="Excluir Etapa">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Bind input event
        tr.querySelector('.phase-hour-input').addEventListener('input', (e) => {
            const hrs = parseFloat(e.target.value) || 0;
            phase.hours = hrs;
            saveStateToLocalStorage();
            calculateAll();
        });
    });
}

function renderVariableCosts() {
    const tbody = document.getElementById('variable-costs-list');
    tbody.innerHTML = '';

    state.variableCosts.forEach(cost => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cost.name}</td>
            <td>
                <div class="input-currency" style="max-width: 160px;">
                    <span class="currency-symbol">R$</span>
                    <input type="number" value="${cost.value}" min="0" step="0.01" class="form-input var-val-input" data-id="${cost.id}" style="padding: 8px 12px 8px 36px; font-size: 0.9rem;">
                </div>
            </td>
            <td style="width: 50px; text-align: center;">
                <button type="button" class="btn-delete-item" onclick="deleteVariableCost('${cost.id}')" title="Excluir Custo">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Bind input event
        tr.querySelector('.var-val-input').addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            cost.value = val;
            saveStateToLocalStorage();
            calculateAll();
        });
    });
}

function updateTogglesAndSliders() {
    // Profit margin slider
    document.getElementById('input-profit').value = state.profitMargin;
    document.getElementById('profit-display').textContent = `${state.profitMargin}%`;
    
    // Tax slider
    document.getElementById('input-tax').value = state.taxRate;
    document.getElementById('tax-display').textContent = `${state.taxRate}%`;

    // Tax Method checked state
    const radios = document.getElementsByName('tax-method');
    radios.forEach(radio => {
        if (radio.value === state.taxMethod) {
            radio.checked = true;
        }
    });
}

// ==========================================================================
// CALCULATOR CORE LOGIC
// ==========================================================================

function calculateAll() {
    // 1. SUM FIXED COSTS
    const totalFixedCosts = state.fixedCosts.reduce((sum, cost) => sum + (Number(cost.value) || 0), 0);
    
    // 2. CAPACITY (PRODUCTIVITY HOURS)
    const ownerHours = state.team.owner.hours * state.team.owner.qty * state.workdays;
    const collabHours = state.team.collaborators.hours * state.team.collaborators.qty * state.workdays;
    const internHours = state.team.interns.hours * state.team.interns.qty * state.workdays;
    const totalCapacityHours = ownerHours + collabHours + internHours;

    // 3. HOURLY RATE
    const hourlyRate = totalCapacityHours > 0 ? (totalFixedCosts / totalCapacityHours) : 0;

    // 4. PROJECT HOURS COST
    const totalProjectHours = state.projectPhases.reduce((sum, phase) => sum + (Number(phase.hours) || 0), 0);
    const projectHoursCost = totalProjectHours * hourlyRate;

    // Update individual phase costs in Table UI
    state.projectPhases.forEach(phase => {
        const cell = document.getElementById(`phase-cost-${phase.id}`);
        if (cell) {
            cell.textContent = `R$ ${formatMoney(phase.hours * hourlyRate)}`;
        }
    });

    // 5. VARIABLE COSTS
    const totalVariableCosts = state.variableCosts.reduce((sum, cost) => sum + (Number(cost.value) || 0), 0);
    
    // 6. TOTAL COST
    const totalProjectCost = projectHoursCost + totalVariableCosts;

    // 7. PROFIT & TAX
    const profitPct = state.profitMargin / 100;
    const taxPct = state.taxRate / 100;

    let profitAmount = 0;
    let taxAmount = 0;
    let finalPrice = 0;
    let subtotalWithProfit = 0;

    if (state.taxMethod === 'inside') {
        // Cálculo "por dentro" (Típico brasileiro: Imposto incide sobre a NF final)
        // Preço bruto = (Custo + Lucro) / (1 - Imposto%)
        subtotalWithProfit = totalProjectCost * (1 + profitPct);
        profitAmount = totalProjectCost * profitPct;
        
        if (taxPct < 1) {
            finalPrice = subtotalWithProfit / (1 - taxPct);
            taxAmount = finalPrice * taxPct;
        } else {
            // Safe fallback if tax rate gets to 100%
            finalPrice = subtotalWithProfit;
            taxAmount = 0;
        }
    } else {
        // Markup simples (Cálculo "por fora")
        // Preço bruto = (Custo + Lucro) * (1 + Imposto%)
        subtotalWithProfit = totalProjectCost * (1 + profitPct);
        profitAmount = totalProjectCost * profitPct;
        taxAmount = subtotalWithProfit * taxPct;
        finalPrice = subtotalWithProfit + taxAmount;
    }

    // ==========================================================================
    // UPDATE GENERAL UI ELEMENTS
    // ==========================================================================
    
    // Summary Sidebar Panel
    document.getElementById('summary-fixed-costs').textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    document.getElementById('summary-hourly-rate').textContent = `R$ ${formatMoney(hourlyRate)}`;
    document.getElementById('summary-hours-desc').textContent = `baseado em ${totalCapacityHours}h/mês`;
    
    document.getElementById('summary-proj-hours').textContent = `${totalProjectHours}h`;
    document.getElementById('summary-proj-hours-cost').textContent = `R$ ${formatMoney(projectHoursCost)}`;
    document.getElementById('summary-proj-vars').textContent = `R$ ${formatMoney(totalVariableCosts)}`;
    
    document.getElementById('summary-profit').textContent = `R$ ${formatMoney(profitAmount)}`;
    document.getElementById('summary-tax').textContent = `R$ ${formatMoney(taxAmount)}`;
    document.getElementById('summary-final-price').textContent = `R$ ${formatMoney(finalPrice)}`;

    // Tab 3 Custo da Hora Math Box
    document.getElementById('math-fixed-cost').textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    document.getElementById('math-hours-capacity').textContent = `${totalCapacityHours}h`;
    document.getElementById('math-hourly-rate').textContent = `R$ ${formatMoney(hourlyRate)}`;

    // Tab 7 Relatório Completo Panel
    document.getElementById('rep-fixed-costs').textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    document.getElementById('rep-monthly-hours').textContent = `${totalCapacityHours}h / mês`;
    document.getElementById('rep-hourly-rate').textContent = `R$ ${formatMoney(hourlyRate)} / h`;
    
    document.getElementById('rep-project-hours').textContent = `${totalProjectHours}h`;
    document.getElementById('rep-project-hours-cost').textContent = `R$ ${formatMoney(projectHoursCost)}`;
    document.getElementById('rep-project-variables').textContent = `R$ ${formatMoney(totalVariableCosts)}`;
    document.getElementById('rep-project-total-cost').textContent = `R$ ${formatMoney(totalProjectCost)}`;

    document.getElementById('row-costs').textContent = `R$ ${formatMoney(totalProjectCost)}`;
    document.getElementById('rep-profit-pct').textContent = `${state.profitMargin}%`;
    document.getElementById('row-profit').textContent = `R$ ${formatMoney(profitAmount)}`;
    document.getElementById('row-subtotal').textContent = `R$ ${formatMoney(subtotalWithProfit)}`;
    document.getElementById('rep-tax-pct').textContent = `${state.taxRate}%`;
    document.getElementById('row-tax').textContent = `R$ ${formatMoney(taxAmount)}`;
    document.getElementById('row-final-price').textContent = `R$ ${formatMoney(finalPrice)}`;

    // Checklist Tracker (sidebar states)
    updateChecklistTracker(totalFixedCosts, totalCapacityHours, totalProjectHours);

    // Render Donut Chart SVG
    renderDonutChart(totalProjectCost, profitAmount, taxAmount, finalPrice);
}

function updateChecklistTracker(fixedCosts, capacityHours, projectHours) {
    const chkFixed = document.getElementById('chk-fixed');
    const chkProd = document.getElementById('chk-productivity');
    const chkHours = document.getElementById('chk-hours');
    const chkMargin = document.getElementById('chk-margin');

    if (fixedCosts > 0) chkFixed.classList.add('checked');
    else chkFixed.classList.remove('checked');

    if (capacityHours > 0) chkProd.classList.add('checked');
    else chkProd.classList.remove('checked');

    if (projectHours > 0) chkHours.classList.add('checked');
    else chkHours.classList.remove('checked');

    if (state.profitMargin > 0) chkMargin.classList.add('checked');
    else chkMargin.classList.remove('checked');
}

function renderDonutChart(costs, profit, tax, total) {
    const svg = document.getElementById('svg-donut');
    if (!svg) return;

    // Clear old segments (remove all paths with class donut-segment)
    svg.querySelectorAll('.donut-segment').forEach(el => el.remove());
    
    // Draw center price text
    document.getElementById('donut-center-price').textContent = `R$ ${formatCompactMoney(total)}`;

    const legendContainer = document.getElementById('donut-legend');
    legendContainer.innerHTML = '';

    if (total === 0) return;

    const radius = 70;
    const circumference = 2 * Math.PI * radius; // 439.82

    const slices = [
        { name: 'Custo Operacional', value: costs, color: 'var(--color-primary)' },
        { name: 'Lucro Esperado', value: profit, color: 'var(--color-success)' },
        { name: 'Impostos', value: tax, color: 'var(--color-warning)' }
    ];

    let currentOffset = 0;

    slices.forEach((slice) => {
        const pct = slice.value / total;
        if (pct <= 0) return;

        const strokeLength = circumference * pct;
        const strokeSpace = circumference - strokeLength;
        const dashOffset = -currentOffset;

        // Create SVG path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        path.setAttribute('cx', '100');
        path.setAttribute('cy', '100');
        path.setAttribute('r', radius.toString());
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', slice.color);
        path.setAttribute('stroke-width', '20');
        path.setAttribute('class', 'donut-segment');
        path.setAttribute('stroke-dasharray', `${strokeLength} ${strokeSpace}`);
        path.setAttribute('stroke-dashoffset', dashOffset.toString());

        svg.appendChild(path);

        currentOffset += strokeLength;

        // Legend item
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${slice.color}"></div>
            <div class="legend-info">
                <span class="legend-name">${slice.name}</span>
                <span class="legend-val">R$ ${formatMoney(slice.value)} (${(pct * 100).toFixed(0)}%)</span>
            </div>
        `;
        legendContainer.appendChild(legendItem);
    });
}

// ==========================================================================
// INTERACTIVE ADDERS & DELETERS
// ==========================================================================

// FIXED COSTS
function deleteFixedCost(id) {
    state.fixedCosts = state.fixedCosts.filter(c => c.id !== id);
    saveStateToLocalStorage();
    renderFixedCosts(document.getElementById('fixed-costs-search').value);
    calculateAll();
}

document.getElementById('btn-add-fixed').addEventListener('click', () => {
    const nameInput = document.getElementById('custom-fixed-name');
    const catSelect = document.getElementById('custom-fixed-category');
    const valInput = document.getElementById('custom-fixed-value');

    const name = nameInput.value.trim();
    const category = catSelect.value;
    const value = parseFloat(valInput.value) || 0;

    if (!name) {
        alert('Por favor, informe o nome do custo fixo.');
        nameInput.focus();
        return;
    }

    const newId = `fc-custom-${Date.now()}`;
    state.fixedCosts.push({ id: newId, name, category, value });
    saveStateToLocalStorage();
    
    // Clear inputs
    nameInput.value = '';
    valInput.value = '';
    
    renderFixedCosts(document.getElementById('fixed-costs-search').value);
    calculateAll();
});

// PROJECT PHASES
function deleteProjectPhase(id) {
    state.projectPhases = state.projectPhases.filter(p => p.id !== id);
    saveStateToLocalStorage();
    renderProjectPhases();
    calculateAll();
}

document.getElementById('btn-add-phase').addEventListener('click', () => {
    const nameInput = document.getElementById('custom-phase-name');
    const hoursInput = document.getElementById('custom-phase-hours');

    const name = nameInput.value.trim();
    const hours = parseFloat(hoursInput.value) || 0;

    if (!name) {
        alert('Por favor, informe o nome da etapa.');
        nameInput.focus();
        return;
    }

    const newId = `ph-custom-${Date.now()}`;
    state.projectPhases.push({ id: newId, name, hours });
    saveStateToLocalStorage();

    // Clear inputs
    nameInput.value = '';
    hoursInput.value = '';

    renderProjectPhases();
    calculateAll();
});

// VARIABLE COSTS
function deleteVariableCost(id) {
    state.variableCosts = state.variableCosts.filter(v => v.id !== id);
    saveStateToLocalStorage();
    renderVariableCosts();
    calculateAll();
}

document.getElementById('btn-add-variable').addEventListener('click', () => {
    const nameInput = document.getElementById('custom-var-name');
    const valInput = document.getElementById('custom-var-value');

    const name = nameInput.value.trim();
    const value = parseFloat(valInput.value) || 0;

    if (!name) {
        alert('Por favor, informe o nome da despesa.');
        nameInput.focus();
        return;
    }

    const newId = `vc-custom-${Date.now()}`;
    state.variableCosts.push({ id: newId, name, value });
    saveStateToLocalStorage();

    // Clear inputs
    nameInput.value = '';
    valInput.value = '';

    renderVariableCosts();
    calculateAll();
});

// ==========================================================================
// SIMULATIONS SAVE & LOAD (localStorage)
// ==========================================================================

document.getElementById('btn-save-project').addEventListener('click', () => {
    const name = prompt('Informe um nome para esta simulação de orçamento (ex: Projeto Residência Silva):');
    if (name === null) return; // Cancelled
    const trimmedName = name.trim();
    if (!trimmedName) {
        alert('Nome inválido.');
        return;
    }

    // Calculate details for saving
    const totalFixedCosts = state.fixedCosts.reduce((sum, cost) => sum + (Number(cost.value) || 0), 0);
    const ownerHours = state.team.owner.hours * state.team.owner.qty * state.workdays;
    const collabHours = state.team.collaborators.hours * state.team.collaborators.qty * state.workdays;
    const internHours = state.team.interns.hours * state.team.interns.qty * state.workdays;
    const totalCapacityHours = ownerHours + collabHours + internHours;
    const hourlyRate = totalCapacityHours > 0 ? (totalFixedCosts / totalCapacityHours) : 0;
    const totalProjectHours = state.projectPhases.reduce((sum, phase) => sum + (Number(phase.hours) || 0), 0);
    const totalVariableCosts = state.variableCosts.reduce((sum, cost) => sum + (Number(cost.value) || 0), 0);
    const totalProjectCost = (totalProjectHours * hourlyRate) + totalVariableCosts;
    const profitPct = state.profitMargin / 100;
    const taxPct = state.taxRate / 100;

    let finalPrice = 0;
    if (state.taxMethod === 'inside') {
        finalPrice = (totalProjectCost * (1 + profitPct)) / (1 - taxPct);
    } else {
        finalPrice = (totalProjectCost * (1 + profitPct)) * (1 + taxPct);
    }

    const projectData = {
        id: `project-${Date.now()}`,
        name: trimmedName,
        date: new Date().toLocaleDateString('pt-BR'),
        finalPrice: finalPrice,
        hours: totalProjectHours,
        stateSnapshot: JSON.parse(JSON.stringify(state)) // Clone state
    };

    // Load existing projects list
    let saved = [];
    const raw = localStorage.getItem('precificacao_saved_projects');
    if (raw) {
        try { saved = JSON.parse(raw); } catch (e) { saved = []; }
    }

    saved.push(projectData);
    localStorage.setItem('precificacao_saved_projects', JSON.stringify(saved));
    
    alert('Simulação de orçamento salva com sucesso!');
    loadSavedProjects();
});

function loadSavedProjects() {
    const listEl = document.getElementById('saved-projects-list');
    listEl.innerHTML = '';

    let saved = [];
    const raw = localStorage.getItem('precificacao_saved_projects');
    if (raw) {
        try { saved = JSON.parse(raw); } catch (e) { saved = []; }
    }

    if (saved.length === 0) {
        listEl.innerHTML = '<p class="empty-state">Nenhuma simulação salva ainda. Configure e clique em "Salvar Projeto" acima.</p>';
        return;
    }

    saved.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'saved-project-card';
        card.innerHTML = `
            <button class="btn-delete-project" onclick="deleteSavedProject(event, '${proj.id}')" title="Excluir Simulação">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <div class="saved-project-click" onclick="loadProjectFromData('${proj.id}')">
                <div class="saved-project-title" title="${proj.name}">${proj.name}</div>
                <div class="saved-project-date">Salvo em: ${proj.date}</div>
                <div class="saved-project-price">R$ ${formatMoney(proj.finalPrice)}</div>
                <div class="saved-project-details">
                    <span>Etapas: ${proj.hours}h</span>
                    <span>Ver detalhado →</span>
                </div>
            </div>
        `;
        listEl.appendChild(card);
    });
}

window.deleteSavedProject = function(event, id) {
    event.stopPropagation();
    if (!confirm('Deseja realmente excluir esta simulação?')) return;
    
    let saved = [];
    const raw = localStorage.getItem('precificacao_saved_projects');
    if (raw) {
        try { saved = JSON.parse(raw); } catch (e) { saved = []; }
    }

    saved = saved.filter(p => p.id !== id);
    localStorage.setItem('precificacao_saved_projects', JSON.stringify(saved));
    loadSavedProjects();
};

window.loadProjectFromData = function(id) {
    let saved = [];
    const raw = localStorage.getItem('precificacao_saved_projects');
    if (raw) {
        try { saved = JSON.parse(raw); } catch (e) { saved = []; }
    }

    const found = saved.find(p => p.id === id);
    if (!found) return;

    if (!confirm(`Deseja carregar a simulação "${found.name}"? Isso substituirá os dados atuais da tela.`)) return;

    state = found.stateSnapshot;
    saveStateToLocalStorage();
    
    // Rerender all components
    renderFixedCosts();
    renderProductivity();
    renderProjectPhases();
    renderVariableCosts();
    updateTogglesAndSliders();
    
    calculateAll();
    
    // Auto jump to Step 7 (Result tab)
    switchTab('resultado');
    
    // Scroll to report
    document.getElementById('proposal-report').scrollIntoView({ behavior: 'smooth' });
};

// ==========================================================================
// NAVIGATION & EVENT BINDINGS
// ==========================================================================

function setupEventListeners() {
    // Tab switching
    const stepLinks = document.querySelectorAll('.step-link');
    stepLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Next/Prev buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextTab = btn.getAttribute('data-next');
            switchTab(nextTab);
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevTab = btn.getAttribute('data-prev');
            switchTab(prevTab);
        });
    });

    // Go-to-final button in summary card
    document.querySelector('.btn-go-final').addEventListener('click', () => {
        switchTab('resultado');
    });

    // Fixed Costs Search
    document.getElementById('fixed-costs-search').addEventListener('input', (e) => {
        renderFixedCosts(e.target.value);
    });

    // Theme toggler
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const body = document.body;
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            document.querySelector('.sun-icon').style.display = 'none';
            document.querySelector('.moon-icon').style.display = 'block';
            state.theme = 'light';
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            document.querySelector('.sun-icon').style.display = 'block';
            document.querySelector('.moon-icon').style.display = 'none';
            state.theme = 'dark';
        }
        saveStateToLocalStorage();
    });

    // Handle initial theme set from state
    if (state.theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        document.querySelector('.sun-icon').style.display = 'none';
        document.querySelector('.moon-icon').style.display = 'block';
    }

    // Reset button
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (!confirm('Deseja limpar todos os dados do formulário de precificação?')) return;
        localStorage.removeItem('precificacao_state');
        loadDefaults();
        initApp();
    });

    // Productivity event triggers
    const productivityInputs = [
        'input-workdays',
        'hours-owner', 'qty-owner',
        'hours-collaborators', 'qty-collaborators',
        'hours-interns', 'qty-interns'
    ];

    productivityInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            
            if (id === 'input-workdays') state.workdays = Math.max(1, val);
            else if (id === 'hours-owner') state.team.owner.hours = val;
            else if (id === 'qty-owner') state.team.owner.qty = val;
            else if (id === 'hours-collaborators') state.team.collaborators.hours = val;
            else if (id === 'qty-collaborators') state.team.collaborators.qty = val;
            else if (id === 'hours-interns') state.team.interns.hours = val;
            else if (id === 'qty-interns') state.team.interns.qty = val;

            updateProductivitySubtotals();
            saveStateToLocalStorage();
            calculateAll();
        });
    });

    // Margin and Tax Sliders
    document.getElementById('input-profit').addEventListener('input', (e) => {
        const val = parseInt(e.target.value) || 0;
        state.profitMargin = val;
        document.getElementById('profit-display').textContent = `${val}%`;
        saveStateToLocalStorage();
        calculateAll();
    });

    document.getElementById('input-tax').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        state.taxRate = val;
        document.getElementById('tax-display').textContent = `${val}%`;
        saveStateToLocalStorage();
        calculateAll();
    });

    // Tax Method Radios
    const radios = document.getElementsByName('tax-method');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.taxMethod = e.target.value;
            saveStateToLocalStorage();
            calculateAll();
        });
    });

    // Print / PDF export trigger
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        window.print();
    });
}

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all step links
    document.querySelectorAll('.step-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(`tab-${tabId}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activate corresponding step link
    const activeLink = document.querySelector(`.step-link[data-tab="${tabId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll to top of tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

function formatMoney(value) {
    return (Number(value) || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatCompactMoney(value) {
    const val = Number(value) || 0;
    if (val >= 1000000) {
        return (val / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M';
    }
    if (val >= 10000) {
        return (val / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k';
    }
    return val.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}
