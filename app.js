// ==========================================================================
// SUPABASE CLIENT INITIALIZATION & AUTH STATE
// ==========================================================================



const isSupabaseConfigured = SUPABASE_URL !== 'SUA_SUPABASE_URL_AQUI' && SUPABASE_KEY !== 'SUA_SUPABASE_ANON_KEY_AQUI';

let supabase = null;
if (isSupabaseConfigured) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error("Falha ao instanciar o cliente Supabase:", e);
    }
}

let currentUser = null;
let authMode = 'login'; // 'login' or 'signup'

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

// App State (Coleções SPA)
let state = {
    profile: { officeName: '', ownerName: '', email: '', phone: '' },
    fixedCosts: [],
    team: {
        owner: { hours: 6, qty: 1 },
        collaborators: { hours: 6, qty: 0 },
        interns: { hours: 4, qty: 2 }
    },
    workdays: 20,
    projectPhases: [],
    variableCosts: [],
    profitMargin: 30,
    taxRate: 6,
    taxMethod: 'inside', // 'inside' or 'outside'
    clients: [
        { id: 'cli-default-1', name: 'Residencial Carlos Alberto', email: 'carlos@email.com', phone: '(11) 99999-1111', notes: 'Projeto de reforma da área de lazer e piscina' },
        { id: 'cli-default-2', name: 'Comercial Ponto Alto', email: 'contato@pontoalto.com.br', phone: '(11) 98888-2222', notes: 'Projeto de design de interiores para escritório corporativo' }
    ],
    services: [
        { id: 'srv-default-1', name: 'Estudo Preliminar', defaultHours: 40, description: 'Estudos de viabilidade, volumetria e layout inicial' },
        { id: 'srv-default-2', name: 'Anteprojeto / Projeto Legal', defaultHours: 50, description: 'Desenhos técnicos para aprovação em prefeitura e condomínio' },
        { id: 'srv-default-3', name: 'Projeto Executivo', defaultHours: 80, description: 'Detalhamento construtivo completo para obra' },
        { id: 'srv-default-4', name: 'Detalhamento de Interiores e Marcenaria', defaultHours: 60, description: 'Vistas, paginação de piso e detalhes de móveis' }
    ],
    proposals: [],
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
    // Set date in report
    const today = new Date();
    const repDateEl = document.getElementById('report-date');
    if (repDateEl) repDateEl.textContent = today.toLocaleDateString('pt-BR');

    if (supabase) {
        // Auth state listener
        supabase.auth.onAuthStateChange((event, session) => {
            handleAuthStateChange(session);
        });
        
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthStateChange(session);
        });
    } else {
        // Fallback: not configured. Put body in not-authenticated.
        document.body.classList.add('not-authenticated');
        window.location.hash = '#login';
        handleNavigation();
        
        showAuthMessage('Aviso: Supabase não configurado. Use email "demo@exemplo.com" e senha "123456" para testar localmente em Modo de Demonstração.', 'info');
    }
}

function handleAuthStateChange(session) {
    if (session) {
        currentUser = session.user;
        document.body.classList.remove('not-authenticated');
        
        loadUserData().then(() => {
            renderFixedCosts();
            renderProductivity();
            renderProjectPhases();
            renderVariableCosts();
            updateTogglesAndSliders();
            renderClients();
            renderServices();
            renderProfile();
            populateSelectors();
            loadSavedProjects();
            calculateAll();

            if (window.location.hash === '#login' || !window.location.hash) {
                window.location.hash = '#dashboard';
            } else {
                handleNavigation();
            }
        });
    } else {
        currentUser = null;
        document.body.classList.add('not-authenticated');
        window.location.hash = '#login';
        handleNavigation();
    }
}

function showAuthMessage(msg, type) {
    const feedbackEl = document.getElementById('auth-message');
    if (feedbackEl) {
        if (!msg) {
            feedbackEl.style.display = 'none';
        } else {
            feedbackEl.style.display = 'block';
            feedbackEl.textContent = msg;
            feedbackEl.className = `auth-feedback ${type}`;
        }
    }
}

function handleDemoLogin(email, password) {
    if (email === 'demo@exemplo.com' && password === '123456') {
        const mockSession = {
            user: {
                id: 'mock-user-id',
                email: 'demo@exemplo.com',
                user_metadata: { full_name: 'Arquiteto Demonstrativo' }
            }
        };
        showAuthMessage('Conectado em Modo de Demonstração (Local).', 'success');
        setTimeout(() => {
            handleAuthStateChange(mockSession);
        }, 1000);
        return true;
    }
    return false;
}

// Helpers de Botão e Loader
function setLoadingState(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
        btn.setAttribute('disabled', 'disabled');
        btn.classList.add('btn-loading');
    } else {
        btn.removeAttribute('disabled');
        btn.classList.remove('btn-loading');
    }
}

// Carregamento Assíncrono do Banco Supabase
async function loadUserData() {
    if (!currentUser) return;

    if (!isSupabaseConfigured) {
        // Fallback: Modo Demo (LocalStorage)
        const savedState = localStorage.getItem('precificacao_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                state = { ...state, ...parsed };
            } catch (e) {
                loadDefaults();
            }
        } else {
            loadDefaults();
        }
        return;
    }

    try {
        showAuthMessage('Carregando dados do banco de dados...', 'info');
        const userId = currentUser.id;

        const [
            profileRes,
            fixedCostsRes,
            teamRes,
            clientsRes,
            servicesRes
        ] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
            supabase.from('fixed_costs').select('*').eq('user_id', userId),
            supabase.from('team_members').select('*').eq('user_id', userId),
            supabase.from('clients').select('*').eq('user_id', userId),
            supabase.from('services').select('*').eq('user_id', userId)
        ]);

        if (profileRes.error) throw profileRes.error;
        if (fixedCostsRes.error) throw fixedCostsRes.error;
        if (teamRes.error) throw teamRes.error;
        if (clientsRes.error) throw clientsRes.error;
        if (servicesRes.error) throw servicesRes.error;

        // 1. Profile and workdays
        if (profileRes.data) {
            state.profile = {
                officeName: profileRes.data.office_name || '',
                ownerName: profileRes.data.owner_name || currentUser.email,
                email: profileRes.data.email || currentUser.email,
                phone: profileRes.data.phone || ''
            };
            state.workdays = profileRes.data.workdays || 20;
        } else {
            // Seeder profile
            state.profile = {
                officeName: '',
                ownerName: currentUser.user_metadata?.full_name || currentUser.email,
                email: currentUser.email,
                phone: ''
            };
            state.workdays = 20;
            
            await supabase.from('profiles').upsert({
                id: userId,
                office_name: '',
                owner_name: state.profile.ownerName,
                email: currentUser.email,
                phone: '',
                workdays: 20,
                updated_at: new Date()
            });
        }

        // 2. Fixed Costs
        if (fixedCostsRes.data && fixedCostsRes.data.length > 0) {
            state.fixedCosts = fixedCostsRes.data.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                value: parseFloat(item.value) || 0
            }));
        } else {
            // Seeder fixed costs
            state.fixedCosts = JSON.parse(JSON.stringify(defaultFixedCosts));
            const seedData = state.fixedCosts.map(item => ({
                user_id: userId,
                name: item.name,
                category: item.category,
                value: item.value
            }));
            const { data, error } = await supabase.from('fixed_costs').insert(seedData).select();
            if (!error && data) {
                state.fixedCosts = data.map(item => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    value: parseFloat(item.value) || 0
                }));
            }
        }

        // 3. Team Members
        if (teamRes.data && teamRes.data.length > 0) {
            state.team = {
                owner: { hours: 0, qty: 0 },
                collaborators: { hours: 0, qty: 0 },
                interns: { hours: 0, qty: 0 }
            };
            teamRes.data.forEach(member => {
                if (member.role_type === 'owner') {
                    state.team.owner = { hours: parseFloat(member.hours_per_day) || 0, qty: parseInt(member.quantity) || 0 };
                } else if (member.role_type === 'collaborator') {
                    state.team.collaborators = { hours: parseFloat(member.hours_per_day) || 0, qty: parseInt(member.quantity) || 0 };
                } else if (member.role_type === 'intern') {
                    state.team.interns = { hours: parseFloat(member.hours_per_day) || 0, qty: parseInt(member.quantity) || 0 };
                }
            });
        } else {
            // Seeder team members
            state.team = {
                owner: { hours: 6, qty: 1 },
                collaborators: { hours: 6, qty: 0 },
                interns: { hours: 4, qty: 2 }
            };
            const seedTeam = [
                { user_id: userId, role_type: 'owner', hours_per_day: 6, quantity: 1 },
                { user_id: userId, role_type: 'collaborator', hours_per_day: 6, quantity: 0 },
                { user_id: userId, role_type: 'intern', hours_per_day: 4, quantity: 2 }
            ];
            await supabase.from('team_members').insert(seedTeam);
        }

        // 4. Clients
        if (clientsRes.data) {
            state.clients = clientsRes.data.map(item => ({
                id: item.id,
                name: item.name,
                email: item.email,
                phone: item.phone,
                notes: item.notes
            }));
        }

        // 5. Services
        if (servicesRes.data) {
            state.services = servicesRes.data.map(item => ({
                id: item.id,
                name: item.name,
                defaultHours: parseFloat(item.default_hours) || 0,
                description: item.description
            }));
        }

        showAuthMessage('', 'info');
    } catch (e) {
        console.error("Falha ao carregar dados do usuário:", e);
        showAuthMessage('Erro ao carregar dados do Supabase. Usando dados locais.', 'error');
    }
}

// Helpers para sincronização do Financeiro no Supabase
async function updateWorkdaysOnDb() {
    if (isSupabaseConfigured && currentUser) {
        try {
            await supabase.from('profiles').upsert({
                id: currentUser.id,
                office_name: state.profile.officeName,
                owner_name: state.profile.ownerName,
                email: state.profile.email,
                phone: state.profile.phone,
                workdays: state.workdays,
                updated_at: new Date()
            });
        } catch(e) {
            console.error("Falha ao salvar dias úteis no Supabase:", e);
        }
    } else {
        saveStateToLocalStorage();
    }
}

async function updateTeamMemberOnDb(roleType, hours, qty) {
    if (isSupabaseConfigured && currentUser) {
        try {
            const { data } = await supabase.from('team_members')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('role_type', roleType)
                .maybeSingle();
                
            const row = {
                user_id: currentUser.id,
                role_type: roleType,
                hours_per_day: hours,
                quantity: qty
            };
            
            if (data) {
                row.id = data.id;
            }
            
            await supabase.from('team_members').upsert(row);
        } catch (e) {
            console.error("Falha ao salvar equipe no Supabase:", e);
        }
    } else {
        saveStateToLocalStorage();
    }
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
    state.profile = { officeName: '', ownerName: '', email: '', phone: '' };
    state.clients = [
        { id: 'cli-default-1', name: 'Residencial Carlos Alberto', email: 'carlos@email.com', phone: '(11) 99999-1111', notes: 'Projeto de reforma da área de lazer e piscina' },
        { id: 'cli-default-2', name: 'Comercial Ponto Alto', email: 'contato@pontoalto.com.br', phone: '(11) 98888-2222', notes: 'Projeto de design de interiores para escritório corporativo' }
    ];
    state.services = [
        { id: 'srv-default-1', name: 'Estudo Preliminar', defaultHours: 40, description: 'Estudos de viabilidade, volumetria e layout inicial' },
        { id: 'srv-default-2', name: 'Anteprojeto / Projeto Legal', defaultHours: 50, description: 'Desenhos técnicos para aprovação em prefeitura e condomínio' },
        { id: 'srv-default-3', name: 'Projeto Executivo', defaultHours: 80, description: 'Detalhamento construtivo completo para obra' },
        { id: 'srv-default-4', name: 'Detalhamento de Interiores e Marcenaria', defaultHours: 60, description: 'Vistas, paginação de piso e detalhes de móveis' }
    ];
}

function saveStateToLocalStorage() {
    localStorage.setItem('precificacao_state', JSON.stringify(state));
}

function populateSelectors() {
    // Services Dropdown in Step 4
    const serviceSelect = document.getElementById('calc-select-service');
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">-- Selecione um serviço cadastrado --</option>';
        state.services.forEach(srv => {
            const opt = document.createElement('option');
            opt.value = srv.id;
            opt.textContent = `${srv.name} (${srv.defaultHours}h)`;
            serviceSelect.appendChild(opt);
        });
    }

    // Clients Dropdown in Step 7
    const clientSelect = document.getElementById('calc-select-client');
    if (clientSelect) {
        const currentVal = clientSelect.value;
        clientSelect.innerHTML = '<option value="">-- Proposta sem cliente associado --</option>';
        state.clients.forEach(cli => {
            const opt = document.createElement('option');
            opt.value = cli.id;
            opt.textContent = cli.name;
            clientSelect.appendChild(opt);
        });
        clientSelect.value = currentVal;
    }
}

// ==========================================================================
// RENDERING FUNCTIONS
// ==========================================================================

function renderFixedCosts(searchTerm = '') {
    const container = document.getElementById('fin-costs-groups');
    if (!container) return;
    container.innerHTML = '';

    // Group fixed costs by category
    const grouped = { infra: [], equipe: [], operacional: [], conselhos: [] };
    
    state.fixedCosts.forEach(cost => {
        if (searchTerm === '' || cost.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            grouped[cost.category].push(cost);
        }
    });

    Object.keys(grouped).forEach(cat => {
        if (grouped[cat].length === 0 && searchTerm !== '') return;

        const catCard = document.createElement('div');
        catCard.className = 'card card-glass cost-category-card';
        
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

            const input = inputItem.querySelector('input');
            input.addEventListener('change', async (e) => {
                const val = parseFloat(e.target.value) || 0;
                cost.value = val;
                
                if (isSupabaseConfigured && currentUser) {
                    try {
                        await supabase.from('fixed_costs')
                            .update({ value: val })
                            .eq('id', cost.id)
                            .eq('user_id', currentUser.id);
                    } catch(err) {
                        console.error("Falha ao salvar custo fixo no Supabase:", err);
                    }
                } else {
                    saveStateToLocalStorage();
                }
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
    const workdaysEl = document.getElementById('fin-input-workdays');
    if (!workdaysEl) return;
    
    workdaysEl.value = state.workdays;
    
    // Owner
    document.getElementById('fin-hours-owner').value = state.team.owner.hours;
    document.getElementById('fin-qty-owner').value = state.team.owner.qty;
    
    // Collaborators
    document.getElementById('fin-hours-collaborators').value = state.team.collaborators.hours;
    document.getElementById('fin-qty-collaborators').value = state.team.collaborators.qty;
    
    // Interns
    document.getElementById('fin-hours-interns').value = state.team.interns.hours;
    document.getElementById('fin-qty-interns').value = state.team.interns.qty;

    updateProductivitySubtotals();
}

function updateProductivitySubtotals() {
    const days = state.workdays;
    
    const ownerSub = state.team.owner.hours * state.team.owner.qty * days;
    const ownerSubEl = document.getElementById('fin-subtotal-owner');
    if (ownerSubEl) ownerSubEl.textContent = `${ownerSub}h`;

    const collabSub = state.team.collaborators.hours * state.team.collaborators.qty * days;
    const collabSubEl = document.getElementById('fin-subtotal-collaborators');
    if (collabSubEl) collabSubEl.textContent = `${collabSub}h`;

    const internsSub = state.team.interns.hours * state.team.interns.qty * days;
    const internsSubEl = document.getElementById('fin-subtotal-interns');
    if (internsSubEl) internsSubEl.textContent = `${internsSub}h`;
}

function renderProjectPhases() {
    const tbody = document.getElementById('project-phases-list');
    if (!tbody) return;
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
    if (!tbody) return;
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

        tr.querySelector('.var-val-input').addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            cost.value = val;
            saveStateToLocalStorage();
            calculateAll();
        });
    });
}

function updateTogglesAndSliders() {
    document.getElementById('input-profit').value = state.profitMargin;
    document.getElementById('profit-display').textContent = `${state.profitMargin}%`;
    
    document.getElementById('input-tax').value = state.taxRate;
    document.getElementById('tax-display').textContent = `${state.taxRate}%`;

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
        subtotalWithProfit = totalProjectCost * (1 + profitPct);
        profitAmount = totalProjectCost * profitPct;
        
        if (taxPct < 1) {
            finalPrice = subtotalWithProfit / (1 - taxPct);
            taxAmount = finalPrice * taxPct;
        } else {
            finalPrice = subtotalWithProfit;
            taxAmount = 0;
        }
    } else {
        subtotalWithProfit = totalProjectCost * (1 + profitPct);
        profitAmount = totalProjectCost * profitPct;
        taxAmount = subtotalWithProfit * taxPct;
        finalPrice = subtotalWithProfit + taxAmount;
    }

    // ==========================================================================
    // UPDATE GENERAL UI ELEMENTS
    // ==========================================================================
    
    // Summary Sidebar Panel
    const sumFixedCosts = document.getElementById('summary-fixed-costs');
    const sumHourlyRate = document.getElementById('summary-hourly-rate');
    const sumHoursDesc = document.getElementById('summary-hours-desc');
    const sumProjHours = document.getElementById('summary-proj-hours');
    const sumProjCost = document.getElementById('summary-proj-hours-cost');
    const sumProjVars = document.getElementById('summary-proj-vars');
    const sumProfit = document.getElementById('summary-profit');
    const sumTax = document.getElementById('summary-tax');
    const sumFinalPrice = document.getElementById('summary-final-price');

    if (sumFixedCosts) sumFixedCosts.textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    if (sumHourlyRate) sumHourlyRate.textContent = `R$ ${formatMoney(hourlyRate)}`;
    if (sumHoursDesc) sumHoursDesc.textContent = `baseado em ${totalCapacityHours}h/mês`;
    if (sumProjHours) sumProjHours.textContent = `${totalProjectHours}h`;
    if (sumProjCost) sumProjCost.textContent = `R$ ${formatMoney(projectHoursCost)}`;
    if (sumProjVars) sumProjVars.textContent = `R$ ${formatMoney(totalVariableCosts)}`;
    if (sumProfit) sumProfit.textContent = `R$ ${formatMoney(profitAmount)}`;
    if (sumTax) sumTax.textContent = `R$ ${formatMoney(taxAmount)}`;
    if (sumFinalPrice) sumFinalPrice.textContent = `R$ ${formatMoney(finalPrice)}`;

    // Tab 3 Custo da Hora Math Box
    const mathFixedCost = document.getElementById('math-fixed-cost');
    const mathHoursCapacity = document.getElementById('math-hours-capacity');
    const mathHourlyRate = document.getElementById('math-hourly-rate');

    if (mathFixedCost) mathFixedCost.textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    if (mathHoursCapacity) mathHoursCapacity.textContent = `${totalCapacityHours}h`;
    if (mathHourlyRate) mathHourlyRate.textContent = `R$ ${formatMoney(hourlyRate)}`;

    // Tab 7 Relatório Completo Panel
    const repFixedCosts = document.getElementById('rep-fixed-costs');
    const repMonthlyHours = document.getElementById('rep-monthly-hours');
    const repHourlyRate = document.getElementById('rep-hourly-rate');
    const repProjHours = document.getElementById('rep-project-hours');
    const repProjHoursCost = document.getElementById('rep-project-hours-cost');
    const repProjVariables = document.getElementById('rep-project-variables');
    const repProjTotalCost = document.getElementById('rep-project-total-cost');
    const rowCosts = document.getElementById('row-costs');
    const repProfitPct = document.getElementById('rep-profit-pct');
    const rowProfit = document.getElementById('row-profit');
    const rowSubtotal = document.getElementById('row-subtotal');
    const repTaxPct = document.getElementById('rep-tax-pct');
    const rowTax = document.getElementById('row-tax');
    const rowFinalPrice = document.getElementById('row-final-price');

    if (repFixedCosts) repFixedCosts.textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    if (repMonthlyHours) repMonthlyHours.textContent = `${totalCapacityHours}h / mês`;
    if (repHourlyRate) repHourlyRate.textContent = `R$ ${formatMoney(hourlyRate)} / h`;
    if (repProjHours) repProjHours.textContent = `${totalProjectHours}h`;
    if (repProjHoursCost) repProjHoursCost.textContent = `R$ ${formatMoney(projectHoursCost)}`;
    if (repProjVariables) repProjVariables.textContent = `R$ ${formatMoney(totalVariableCosts)}`;
    if (repProjTotalCost) repProjTotalCost.textContent = `R$ ${formatMoney(totalProjectCost)}`;
    if (rowCosts) rowCosts.textContent = `R$ ${formatMoney(totalProjectCost)}`;
    if (repProfitPct) repProfitPct.textContent = `${state.profitMargin}%`;
    if (rowProfit) rowProfit.textContent = `R$ ${formatMoney(profitAmount)}`;
    if (rowSubtotal) rowSubtotal.textContent = `R$ ${formatMoney(subtotalWithProfit)}`;
    if (repTaxPct) repTaxPct.textContent = `${state.taxRate}%`;
    if (rowTax) rowTax.textContent = `R$ ${formatMoney(taxAmount)}`;
    if (rowFinalPrice) rowFinalPrice.textContent = `R$ ${formatMoney(finalPrice)}`;

    // Nova Proposta - Informative Read-only summaries
    const summaryFixedEl = document.getElementById('calc-fixed-summary');
    if (summaryFixedEl) {
        summaryFixedEl.textContent = `Seus custos fixos mensais do escritório estão configurados em R$ ${formatMoney(totalFixedCosts)} por mês.`;
    }
    const summaryProdEl = document.getElementById('calc-prod-summary');
    if (summaryProdEl) {
        summaryProdEl.textContent = `Sua equipe está configurada com capacidade total de ${totalCapacityHours}h produtivas por mês.`;
    }

    // Financeiro View - Math Box Highlight
    const finMathFixed = document.getElementById('fin-math-fixed');
    const finMathHours = document.getElementById('fin-math-hours');
    const finMathRate = document.getElementById('fin-math-rate');
    if (finMathFixed) finMathFixed.textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    if (finMathHours) finMathHours.textContent = `${totalCapacityHours}h`;
    if (finMathRate) finMathRate.textContent = `R$ ${formatMoney(hourlyRate)}`;

    // Update Dashboard values if they exist
    const dashHourlyEl = document.getElementById('dash-hourly-rate');
    const dashFixedEl = document.getElementById('dash-fixed-costs');
    const dashSavedEl = document.getElementById('dash-saved-count');
    
    if (dashHourlyEl) dashHourlyEl.textContent = `R$ ${formatMoney(hourlyRate)}`;
    if (dashFixedEl) dashFixedEl.textContent = `R$ ${formatMoney(totalFixedCosts)}`;
    if (dashSavedEl) {
        const activeCount = state.proposals ? state.proposals.filter(p => p.status === 'Aprovado' || p.status === 'Enviado').length : 0;
        dashSavedEl.textContent = activeCount;
    }
    renderDashDonutChart();

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

    svg.querySelectorAll('.donut-segment').forEach(el => el.remove());
    document.getElementById('donut-center-price').textContent = `R$ ${formatCompactMoney(total)}`;

    const legendContainer = document.getElementById('donut-legend');
    if (!legendContainer) return;
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

function renderDashDonutChart() {
    const svg = document.getElementById('dash-svg-donut');
    if (!svg) return;

    svg.querySelectorAll('.donut-segment').forEach(el => el.remove());
    
    const total = state.proposals ? state.proposals.length : 0;
    const centerTotalEl = document.getElementById('dash-donut-center-total');
    if (centerTotalEl) centerTotalEl.textContent = total;

    const legendContainer = document.getElementById('dash-donut-legend');
    if (!legendContainer) return;
    legendContainer.innerHTML = '';

    if (total === 0) {
        legendContainer.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted);">Nenhum orçamento cadastrado</div>';
        return;
    }

    const counts = {
        'Rascunho': state.proposals.filter(p => p.status === 'Rascunho').length,
        'Enviado': state.proposals.filter(p => p.status === 'Enviado').length,
        'Aprovado': state.proposals.filter(p => p.status === 'Aprovado').length,
        'Recusado': state.proposals.filter(p => p.status === 'Recusado').length
    };

    const slices = [
        { name: 'Rascunho', value: counts['Rascunho'], color: '#778899' },
        { name: 'Enviado', value: counts['Enviado'], color: 'var(--color-primary)' },
        { name: 'Aprovado', value: counts['Aprovado'], color: 'var(--color-success)' },
        { name: 'Recusado', value: counts['Recusado'], color: 'var(--color-danger)' }
    ].filter(s => s.value > 0);

    if (slices.length === 0) return;

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    slices.forEach(slice => {
        const pct = slice.value / total;
        const strokeLength = pct * circumference;
        const strokeSpace = circumference - strokeLength;
        const dashOffset = -currentOffset;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        path.setAttribute('cx', '100');
        path.setAttribute('cy', '100');
        path.setAttribute('r', radius.toString());
        path.setAttribute('class', 'donut-segment');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', slice.color);
        path.setAttribute('stroke-width', '20');
        path.setAttribute('stroke-dasharray', `${strokeLength} ${strokeSpace}`);
        path.setAttribute('stroke-dashoffset', dashOffset.toString());

        svg.appendChild(path);
        currentOffset += strokeLength;

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '8px';
        legendItem.style.fontSize = '0.8rem';
        legendItem.innerHTML = `
            <div class="legend-color" style="width: 10px; height: 10px; border-radius: 50%; background-color: ${slice.color}"></div>
            <span class="legend-name" style="color: var(--text-secondary);">${slice.name}:</span>
            <strong style="color: var(--text-contrast);">${slice.value} (${(pct * 100).toFixed(0)}%)</strong>
        `;
        legendContainer.appendChild(legendItem);
    });
}

// ==========================================================================
// CLIENTS MÓDULO CRUD
// ==========================================================================

function renderClients() {
    const tbody = document.getElementById('clients-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (state.clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum cliente cadastrado ainda.</td></tr>';
        return;
    }

    state.clients.forEach(cli => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${cli.name}</strong></td>
            <td>
                <div style="font-size: 0.85rem;">${cli.email || ''}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${cli.phone || ''}</div>
            </td>
            <td style="font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${cli.notes || ''}">
                ${cli.notes || '-'}
            </td>
            <td style="text-align: center; white-space: nowrap;">
                <button type="button" class="btn-edit-inline" onclick="editClient('${cli.id}')" title="Editar Cliente">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button type="button" class="btn-delete-item" onclick="deleteClient('${cli.id}')" title="Excluir Cliente" style="padding: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.deleteClient = async function(id) {
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    
    if (isSupabaseConfigured && currentUser) {
        try {
            const { error } = await supabase.from('clients').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
        } catch(err) {
            alert("Erro ao deletar cliente no Supabase: " + err.message);
            return;
        }
    }
    
    state.clients = state.clients.filter(c => c.id !== id);
    saveStateToLocalStorage();
    renderClients();
    populateSelectors();
    calculateAll();
};

window.editClient = function(id) {
    const cli = state.clients.find(c => c.id === id);
    if (!cli) return;

    document.getElementById('client-edit-id').value = cli.id;
    document.getElementById('client-name').value = cli.name;
    document.getElementById('client-email').value = cli.email || '';
    document.getElementById('client-phone').value = cli.phone || '';
    document.getElementById('client-notes').value = cli.notes || '';

    document.getElementById('client-form-title').textContent = 'Editar Cliente';
    document.getElementById('btn-save-client').textContent = 'Salvar Alterações';
    document.getElementById('btn-cancel-client-edit').style.display = 'inline-flex';
    document.getElementById('client-name').focus();
};

function cancelClientEdit() {
    document.getElementById('client-edit-id').value = '';
    document.getElementById('client-name').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-notes').value = '';

    document.getElementById('client-form-title').textContent = 'Cadastrar Novo Cliente';
    document.getElementById('btn-save-client').textContent = 'Salvar Cliente';
    document.getElementById('btn-cancel-client-edit').style.display = 'none';
}

// ==========================================================================
// SERVICES MÓDULO CRUD
// ==========================================================================

function renderServices() {
    const tbody = document.getElementById('services-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (state.services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum serviço cadastrado ainda.</td></tr>';
        return;
    }

    state.services.forEach(srv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${srv.name}</strong></td>
            <td>${srv.defaultHours}h</td>
            <td style="font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${srv.description || ''}">
                ${srv.description || '-'}
            </td>
            <td style="text-align: center; white-space: nowrap;">
                <button type="button" class="btn-edit-inline" onclick="editService('${srv.id}')" title="Editar Serviço">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button type="button" class="btn-delete-item" onclick="deleteService('${srv.id}')" title="Excluir Serviço" style="padding: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.deleteService = async function(id) {
    if (!confirm('Deseja realmente excluir este serviço do catálogo?')) return;
    
    if (isSupabaseConfigured && currentUser) {
        try {
            const { error } = await supabase.from('services').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
        } catch(err) {
            alert("Erro ao deletar serviço no Supabase: " + err.message);
            return;
        }
    }
    
    state.services = state.services.filter(s => s.id !== id);
    saveStateToLocalStorage();
    renderServices();
    populateSelectors();
};

window.editService = function(id) {
    const srv = state.services.find(s => s.id === id);
    if (!srv) return;

    document.getElementById('service-edit-id').value = srv.id;
    document.getElementById('service-name').value = srv.name;
    document.getElementById('service-hours').value = srv.defaultHours;
    document.getElementById('service-desc').value = srv.description || '';

    document.getElementById('service-form-title').textContent = 'Editar Serviço';
    document.getElementById('btn-save-service').textContent = 'Salvar Alterações';
    document.getElementById('btn-cancel-service-edit').style.display = 'inline-flex';
    document.getElementById('service-name').focus();
};

function cancelServiceEdit() {
    document.getElementById('service-edit-id').value = '';
    document.getElementById('service-name').value = '';
    document.getElementById('service-hours').value = '';
    document.getElementById('service-desc').value = '';

    document.getElementById('service-form-title').textContent = 'Cadastrar Novo Serviço';
    document.getElementById('btn-save-service').textContent = 'Salvar Serviço';
    document.getElementById('btn-cancel-service-edit').style.display = 'none';
}

// ==========================================================================
// PROFILE MÓDULO LOGIC
// ==========================================================================

function renderProfile() {
    const pOffice = document.getElementById('profile-office-name');
    const pOwner = document.getElementById('profile-owner-name');
    const pEmail = document.getElementById('profile-email');
    const pPhone = document.getElementById('profile-phone');

    if (pOffice) pOffice.value = state.profile.officeName || '';
    if (pOwner) pOwner.value = state.profile.ownerName || '';
    if (pEmail) pEmail.value = state.profile.email || '';
    if (pPhone) pPhone.value = state.profile.phone || '';

    // Update global brief display
    const pBriefName = document.getElementById('sidebar-profile-name');
    const pBriefOffice = document.getElementById('sidebar-profile-office');

    if (pBriefName) pBriefName.textContent = state.profile.ownerName || 'Olá, Arquiteto';
    if (pBriefOffice) pBriefOffice.textContent = state.profile.officeName || 'Administrador';

    // Update welcome message in Header
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        welcomeMsg.textContent = state.profile.ownerName ? `Olá, ${state.profile.ownerName.split(' ')[0]}!` : 'Olá, Profissional!';
    }

    // Update Proposal details
    const repOfficeName = document.getElementById('rep-office-name');
    const repOfficeOwner = document.getElementById('rep-office-owner');
    const repOfficeContact = document.getElementById('rep-office-contact');

    if (repOfficeName) repOfficeName.textContent = (state.profile.officeName || 'JORNADA DOS ESCRITÓRIOS DE SUCE$$O').toUpperCase();
    if (repOfficeOwner) repOfficeOwner.textContent = state.profile.ownerName || 'Nome do Profissional';
    if (repOfficeContact) {
        repOfficeContact.textContent = `${state.profile.email || ''} ${state.profile.phone ? ' / ' + state.profile.phone : ''}`.trim() || '-';
    }

    // Update Profile Preview block
    const prevOffice = document.getElementById('preview-prof-office');
    const prevOwner = document.getElementById('preview-prof-owner');
    const prevContact = document.getElementById('preview-prof-contact');

    if (prevOffice) prevOffice.textContent = (state.profile.officeName || 'NOME DO ESCRITÓRIO').toUpperCase();
    if (prevOwner) prevOwner.textContent = state.profile.ownerName || '-';
    if (prevContact) {
        prevContact.textContent = `${state.profile.email || ''} ${state.profile.phone ? ' / ' + state.profile.phone : ''}`.trim() || '-';
    }
}

// ==========================================================================
// INTERACTIVE ADDERS & DELETERS
// ==========================================================================

window.deleteFixedCost = async function(id) {
    if (isSupabaseConfigured && currentUser) {
        try {
            const { error } = await supabase.from('fixed_costs').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
        } catch(err) {
            alert("Erro ao excluir custo fixo no Supabase: " + err.message);
            return;
        }
    }

    state.fixedCosts = state.fixedCosts.filter(c => c.id !== id);
    saveStateToLocalStorage();
    const searchVal = document.getElementById('fin-costs-search') ? document.getElementById('fin-costs-search').value : '';
    renderFixedCosts(searchVal);
    calculateAll();
};

window.deleteProjectPhase = function(id) {
    state.projectPhases = state.projectPhases.filter(p => p.id !== id);
    saveStateToLocalStorage();
    renderProjectPhases();
    calculateAll();
};

window.deleteVariableCost = function(id) {
    state.variableCosts = state.variableCosts.filter(v => v.id !== id);
    saveStateToLocalStorage();
    renderVariableCosts();
    calculateAll();
};

// ==========================================================================
// SIMULATIONS SAVE & LOAD
// ==========================================================================

document.getElementById('btn-save-project').addEventListener('click', async () => {
    const name = prompt('Informe um nome para esta proposta de orçamento (ex: Projeto Residência Silva):');
    if (name === null) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
        alert('Nome inválido.');
        return;
    }

    const clientId = document.getElementById('calc-select-client').value || null;
    
    // Calculate values
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

    setLoadingState('btn-save-project', true);

    if (isSupabaseConfigured && currentUser) {
        try {
            // 1. Insert header
            const { data: propData, error: propErr } = await supabase.from('proposals').insert({
                user_id: currentUser.id,
                client_id: clientId,
                name: trimmedName,
                hourly_rate_snapshot: hourlyRate,
                profit_margin_pct: state.profitMargin,
                tax_rate_pct: state.taxRate,
                tax_method: state.taxMethod,
                final_price: finalPrice,
                total_hours: totalProjectHours,
                status: 'Rascunho'
            }).select().single();

            if (propErr) throw propErr;

            const proposalId = propData.id;

            // 2. Insert phases (bulk)
            if (state.projectPhases.length > 0) {
                const phasesData = state.projectPhases.map(ph => ({
                    proposal_id: proposalId,
                    name: ph.name,
                    hours: ph.hours
                }));
                const { error: phasesErr } = await supabase.from('proposal_phases').insert(phasesData);
                if (phasesErr) throw phasesErr;
            }

            // 3. Insert variables (bulk)
            if (state.variableCosts.length > 0) {
                const varsData = state.variableCosts.map(vc => ({
                    proposal_id: proposalId,
                    name: vc.name,
                    value: vc.value
                }));
                const { error: varsErr } = await supabase.from('proposal_variables').insert(varsData);
                if (varsErr) throw varsErr;
            }

            alert('Proposta de orçamento salva com sucesso no Supabase!');
        } catch (err) {
            alert('Erro ao salvar proposta no Supabase: ' + err.message);
            setLoadingState('btn-save-project', false);
            return;
        }
    } else {
        // Fallback: LocalStorage simulation
        const projectData = {
            id: `project-${Date.now()}`,
            name: trimmedName,
            client_id: clientId,
            date: new Date().toLocaleDateString('pt-BR'),
            finalPrice: finalPrice,
            hours: totalProjectHours,
            status: 'Rascunho',
            stateSnapshot: JSON.parse(JSON.stringify(state))
        };

        let saved = [];
        const raw = localStorage.getItem('precificacao_saved_projects');
        if (raw) {
            try { saved = JSON.parse(raw); } catch (e) { saved = []; }
        }

        saved.push(projectData);
        localStorage.setItem('precificacao_saved_projects', JSON.stringify(saved));
        alert('Simulação de proposta salva localmente (Modo Demo)!');
    }

    setLoadingState('btn-save-project', false);
    loadSavedProjects();
    calculateAll();
});

function loadSavedProjects() {
    const listEl = document.getElementById('saved-projects-list');
    const histEl = document.getElementById('history-projects-list');
    
    if (listEl) listEl.innerHTML = '';
    if (histEl) histEl.innerHTML = '';

    let projects = [];

    if (isSupabaseConfigured && currentUser) {
        // We will query from Supabase
        supabase
            .from('proposals')
            .select('*, clients(name, email)')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
                if (error) {
                    console.error("Erro ao carregar propostas do Supabase:", error);
                    return;
                }
                if (data) {
                    state.proposals = data.map(item => ({
                        id: item.id,
                        name: item.name,
                        client_name: item.clients?.name || 'Cliente Geral',
                        client_email: item.clients?.email || '',
                        date: new Date(item.created_at).toLocaleDateString('pt-BR'),
                        finalPrice: parseFloat(item.final_price) || 0,
                        hours: parseFloat(item.total_hours) || 0,
                        status: item.status || 'Rascunho',
                        client_id: item.client_id
                    }));
                    renderProjectCards(state.proposals);
                    // Rerender dashboard stats and chart
                    updateDashboardStats();
                }
            });
    } else {
        // Fallback: LocalStorage simulation
        const raw = localStorage.getItem('precificacao_saved_projects');
        if (raw) {
            try {
                const saved = JSON.parse(raw);
                state.proposals = saved.map(p => {
                    const cli = state.clients.find(c => c.id === p.client_id);
                    return {
                        id: p.id,
                        name: p.name,
                        client_name: cli ? cli.name : 'Cliente Geral',
                        client_email: cli ? cli.email : '',
                        date: p.date,
                        finalPrice: p.finalPrice,
                        hours: p.hours,
                        status: p.status || 'Rascunho',
                        client_id: p.client_id,
                        stateSnapshot: p.stateSnapshot
                    };
                });
            } catch (e) {
                state.proposals = [];
            }
        } else {
            state.proposals = [];
        }
        renderProjectCards(state.proposals);
        updateDashboardStats();
    }
}

function updateDashboardStats() {
    const dashSavedEl = document.getElementById('dash-saved-count');
    if (dashSavedEl) {
        const activeCount = state.proposals.filter(p => p.status === 'Aprovado' || p.status === 'Enviado').length;
        dashSavedEl.textContent = activeCount;
    }
    renderDashDonutChart();
}

function renderProjectCards(projects) {
    const listEl = document.getElementById('saved-projects-list');
    const histEl = document.getElementById('history-projects-list');

    if (projects.length === 0) {
        const emptyStateHtml = '<p class="empty-state">Nenhuma simulação salva ainda. Configure e salve um orçamento no módulo **Nova Proposta**.</p>';
        if (listEl) listEl.innerHTML = emptyStateHtml;
        if (histEl) histEl.innerHTML = emptyStateHtml;
        return;
    }

    const renderCardHtml = (proj) => {
        const statuses = ['Rascunho', 'Enviado', 'Aprovado', 'Recusado'];
        let optionsHtml = '';
        statuses.forEach(st => {
            optionsHtml += `<option value="${st}" ${proj.status === st ? 'selected' : ''}>${st}</option>`;
        });

        return `
            <button class="btn-delete-project" onclick="deleteSavedProject(event, '${proj.id}')" title="Excluir Proposta">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <div class="saved-project-click" onclick="loadProjectFromData('${proj.id}')">
                <div class="saved-project-title" title="${proj.name}">${proj.name}</div>
                <div class="saved-project-client" style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Cliente: ${proj.client_name}</div>
                <div class="saved-project-date">Salvo em: ${proj.date}</div>
                <div class="saved-project-price">R$ ${formatMoney(proj.finalPrice)}</div>
                <div class="saved-project-details">
                    <span>Etapas: ${proj.hours}h</span>
                    <span>Carregar dados →</span>
                </div>
            </div>
            <div class="saved-project-status-box" style="margin-top: 10px; display: flex; align-items: center; gap: 8px; justify-content: space-between; border-top: 1px solid var(--border-glass); padding-top: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Status:</span>
                <select class="form-input" style="padding: 4px 8px; font-size: 0.75rem; width: auto; max-width: 110px;" onchange="updateProposalStatus('${proj.id}', this.value)">
                    ${optionsHtml}
                </select>
            </div>
        `;
    };

    projects.forEach(proj => {
        const cardHtml = renderCardHtml(proj);
        
        if (listEl) {
            const card = document.createElement('div');
            card.className = 'saved-project-card';
            card.innerHTML = cardHtml;
            listEl.appendChild(card);
        }

        if (histEl) {
            const card = document.createElement('div');
            card.className = 'saved-project-card';
            card.innerHTML = cardHtml;
            histEl.appendChild(card);
        }
    });
}

window.updateProposalStatus = async function(id, newStatus) {
    if (isSupabaseConfigured && currentUser) {
        try {
            const { error } = await supabase
                .from('proposals')
                .update({ status: newStatus })
                .eq('id', id)
                .eq('user_id', currentUser.id);
            if (error) throw error;
        } catch(err) {
            alert("Erro ao atualizar status: " + err.message);
            return;
        }
    } else {
        // Fallback: LocalStorage simulation
        let saved = [];
        const raw = localStorage.getItem('precificacao_saved_projects');
        if (raw) {
            try { saved = JSON.parse(raw); } catch (e) { saved = []; }
        }
        const index = saved.findIndex(p => p.id === id);
        if (index !== -1) {
            saved[index].status = newStatus;
            localStorage.setItem('precificacao_saved_projects', JSON.stringify(saved));
        }
    }
    
    // Refresh proposals array locally
    const foundIdx = state.proposals.findIndex(p => p.id === id);
    if (foundIdx !== -1) {
        state.proposals[foundIdx].status = newStatus;
    }
    updateDashboardStats();
    loadSavedProjects();
};

window.deleteSavedProject = async function(event, id) {
    event.stopPropagation();
    if (!confirm('Deseja realmente excluir esta proposta?')) return;
    
    if (isSupabaseConfigured && currentUser) {
        try {
            const { error } = await supabase
                .from('proposals')
                .delete()
                .eq('id', id)
                .eq('user_id', currentUser.id);
            if (error) throw error;
        } catch(err) {
            alert("Erro ao excluir proposta do Supabase: " + err.message);
            return;
        }
    } else {
        let saved = [];
        const raw = localStorage.getItem('precificacao_saved_projects');
        if (raw) {
            try { saved = JSON.parse(raw); } catch (e) { saved = []; }
        }
        saved = saved.filter(p => p.id !== id);
        localStorage.setItem('precificacao_saved_projects', JSON.stringify(saved));
    }
    
    loadSavedProjects();
};

window.loadProjectFromData = async function(id) {
    if (!confirm(`Deseja carregar a proposta selecionada? Isso substituirá os dados atuais da tela.`)) return;

    if (isSupabaseConfigured && currentUser) {
        try {
            // Fetch proposal header, phases, and variables
            const [propRes, phasesRes, varsRes] = await Promise.all([
                supabase.from('proposals').select('*').eq('id', id).eq('user_id', currentUser.id).single(),
                supabase.from('proposal_phases').select('*').eq('proposal_id', id),
                supabase.from('proposal_variables').select('*').eq('proposal_id', id)
            ]);

            if (propRes.error) throw propRes.error;
            if (phasesRes.error) throw phasesRes.error;
            if (varsRes.error) throw varsRes.error;

            const prop = propRes.data;

            // Reconstruct state
            state.profitMargin = parseFloat(prop.profit_margin_pct) || 0;
            state.taxRate = parseFloat(prop.tax_rate_pct) || 0;
            state.taxMethod = prop.tax_method || 'inside';
            
            // Map phases
            state.projectPhases = phasesRes.data.map((ph, idx) => ({
                id: ph.id || `ph-db-${idx}`,
                name: ph.name,
                hours: parseFloat(ph.hours) || 0
            }));

            // Map variables
            state.variableCosts = varsRes.data.map((vc, idx) => ({
                id: vc.id || `vc-db-${idx}`,
                name: vc.name,
                value: parseFloat(vc.value) || 0
            }));

            // Select client in selector
            const selectClient = document.getElementById('calc-select-client');
            if (selectClient) {
                selectClient.value = prop.client_id || '';
            }

        } catch (err) {
            alert('Erro ao carregar proposta do Supabase: ' + err.message);
            return;
        }
    } else {
        // Fallback: LocalStorage simulation
        let saved = [];
        const raw = localStorage.getItem('precificacao_saved_projects');
        if (raw) {
            try { saved = JSON.parse(raw); } catch (e) { saved = []; }
        }

        const found = saved.find(p => p.id === id);
        if (!found) return;

        state = found.stateSnapshot;
        saveStateToLocalStorage();
    }

    // Rerender all components
    renderFixedCosts();
    renderProductivity();
    renderProjectPhases();
    renderVariableCosts();
    updateTogglesAndSliders();
    renderClients();
    renderServices();
    renderProfile();
    populateSelectors();
    
    calculateAll();
    
    // Jump to Step 7 (Result tab) and Nova Proposta global view
    window.location.hash = '#nova-proposta';
    switchTab('resultado');
    
    // Scroll to report
    const reportEl = document.getElementById('proposal-report');
    if (reportEl) reportEl.scrollIntoView({ behavior: 'smooth' });
};

// ==========================================================================
// NAVIGATION & EVENT BINDINGS
// ==========================================================================

function setupEventListeners() {
    // Tab switching in calculator
    const stepLinks = document.querySelectorAll('.step-link');
    stepLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Next/Prev buttons in calculator
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
    const btnGoFinal = document.querySelector('.btn-go-final');
    if (btnGoFinal) {
        btnGoFinal.addEventListener('click', () => {
            switchTab('resultado');
        });
    }

    // Fixed Costs Search (Financeiro view)
    const finCostsSearch = document.getElementById('fin-costs-search');
    if (finCostsSearch) {
        finCostsSearch.addEventListener('input', (e) => {
            renderFixedCosts(e.target.value);
        });
    }

    // Add Fixed Cost (Financeiro view)
    const finBtnAddFixed = document.getElementById('fin-btn-add-fixed');
    if (finBtnAddFixed) {
        finBtnAddFixed.addEventListener('click', async () => {
            const nameInput = document.getElementById('fin-custom-name');
            const catSelect = document.getElementById('fin-custom-category');
            const valInput = document.getElementById('fin-custom-value');

            const name = nameInput.value.trim();
            const category = catSelect.value;
            const value = parseFloat(valInput.value) || 0;

            if (!name) {
                alert('Por favor, informe o nome do custo fixo.');
                nameInput.focus();
                return;
            }

            setLoadingState('fin-btn-add-fixed', true);
            let newId = `fc-custom-${Date.now()}`;

            if (isSupabaseConfigured && currentUser) {
                try {
                    const { data, error } = await supabase.from('fixed_costs').insert({
                        user_id: currentUser.id,
                        name,
                        category,
                        value
                    }).select().single();
                    if (error) throw error;
                    if (data) newId = data.id;
                } catch(err) {
                    alert("Erro ao adicionar custo fixo no Supabase: " + err.message);
                    setLoadingState('fin-btn-add-fixed', false);
                    return;
                }
            } else {
                saveStateToLocalStorage();
            }

            state.fixedCosts.push({ id: newId, name, category, value });

            nameInput.value = '';
            valInput.value = '';
            
            setLoadingState('fin-btn-add-fixed', false);
            renderFixedCosts(document.getElementById('fin-costs-search').value);
            calculateAll();
        });
    }

    // Productivity event triggers (Financeiro view)
    const productivityInputs = [
        'fin-input-workdays',
        'fin-hours-owner', 'fin-qty-owner',
        'fin-hours-collaborators', 'fin-qty-collaborators',
        'fin-hours-interns', 'fin-qty-interns'
    ];

    productivityInputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('change', async (e) => {
                const val = parseFloat(e.target.value) || 0;
                
                if (id === 'fin-input-workdays') {
                    state.workdays = Math.max(1, val);
                    updateProductivitySubtotals();
                    await updateWorkdaysOnDb();
                }
                else if (id === 'fin-hours-owner' || id === 'fin-qty-owner') {
                    if (id === 'fin-hours-owner') state.team.owner.hours = val;
                    else state.team.owner.qty = val;
                    updateProductivitySubtotals();
                    await updateTeamMemberOnDb('owner', state.team.owner.hours, state.team.owner.qty);
                }
                else if (id === 'fin-hours-collaborators' || id === 'fin-qty-collaborators') {
                    if (id === 'fin-hours-collaborators') state.team.collaborators.hours = val;
                    else state.team.collaborators.qty = val;
                    updateProductivitySubtotals();
                    await updateTeamMemberOnDb('collaborator', state.team.collaborators.hours, state.team.collaborators.qty);
                }
                else if (id === 'fin-hours-interns' || id === 'fin-qty-interns') {
                    if (id === 'fin-hours-interns') state.team.interns.hours = val;
                    else state.team.interns.qty = val;
                    updateProductivitySubtotals();
                    await updateTeamMemberOnDb('intern', state.team.interns.hours, state.team.interns.qty);
                }

                calculateAll();
            });
        }
    });

    // Phase adder (Nova proposta view)
    const btnAddPhase = document.getElementById('btn-add-phase');
    if (btnAddPhase) {
        btnAddPhase.addEventListener('click', () => {
            const nameInput = document.getElementById('custom-phase-name');
            const hoursInput = document.getElementById('custom-phase-hours');

            const name = nameInput ? nameInput.value.trim() : '';
            const hours = hoursInput ? parseFloat(hoursInput.value) || 0 : 0;

            if (!name) {
                alert('Por favor, informe o nome da etapa.');
                if (nameInput) nameInput.focus();
                return;
            }

            const newId = `ph-custom-${Date.now()}`;
            state.projectPhases.push({ id: newId, name, hours });
            saveStateToLocalStorage();

            if (nameInput) nameInput.value = '';
            if (hoursInput) hoursInput.value = '';

            renderProjectPhases();
            calculateAll();
        });
    }

    // Import registered service to project phases
    const btnImport = document.getElementById('btn-import-service');
    if (btnImport) {
        btnImport.addEventListener('click', () => {
            const serviceSelect = document.getElementById('calc-select-service');
            const srvId = serviceSelect.value;
            if (!srvId) {
                alert('Selecione um serviço do catálogo para importar.');
                return;
            }
            const srv = state.services.find(s => s.id === srvId);
            if (srv) {
                const newId = `ph-custom-${Date.now()}`;
                state.projectPhases.push({ id: newId, name: srv.name, hours: srv.defaultHours });
                saveStateToLocalStorage();
                renderProjectPhases();
                calculateAll();
                serviceSelect.value = '';
            }
        });
    }

    // Variable costs adder (Nova proposta view)
    // Variable costs adder (Nova proposta view)
    const btnAddVariable = document.getElementById('btn-add-variable');
    if (btnAddVariable) {
        btnAddVariable.addEventListener('click', () => {
            const nameInput = document.getElementById('custom-var-name');
            const valInput = document.getElementById('custom-var-value');

            const name = nameInput ? nameInput.value.trim() : '';
            const value = valInput ? parseFloat(valInput.value) || 0 : 0;

            if (!name) {
                alert('Por favor, informe o nome da despesa.');
                if (nameInput) nameInput.focus();
                return;
            }

            const newId = `vc-custom-${Date.now()}`;
            state.variableCosts.push({ id: newId, name, value });
            saveStateToLocalStorage();

            if (nameInput) nameInput.value = '';
            if (valInput) valInput.value = '';

            renderVariableCosts();
            calculateAll();
        });
    }

    // Margin and Tax Sliders
    const inputProfit = document.getElementById('input-profit');
    if (inputProfit) {
        inputProfit.addEventListener('input', (e) => {
            const val = parseInt(e.target.value) || 0;
            state.profitMargin = val;
            const profitDisplay = document.getElementById('profit-display');
            if (profitDisplay) profitDisplay.textContent = `${val}%`;
            saveStateToLocalStorage();
            calculateAll();
        });
    }

    const inputTax = document.getElementById('input-tax');
    if (inputTax) {
        inputTax.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            state.taxRate = val;
            const taxDisplay = document.getElementById('tax-display');
            if (taxDisplay) taxDisplay.textContent = `${val}%`;
            saveStateToLocalStorage();
            calculateAll();
        });
    }

    // Tax Method Radios
    const radios = document.getElementsByName('tax-method');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.taxMethod = e.target.value;
            saveStateToLocalStorage();
            calculateAll();
        });
    });

    // Client Selector (Step 7)
    const clientSelect = document.getElementById('calc-select-client');
    if (clientSelect) {
        clientSelect.addEventListener('change', (e) => {
            const clientId = e.target.value;
            const repClientBlock = document.getElementById('rep-client-block');
            const repClientName = document.getElementById('rep-client-name');
            const repClientEmail = document.getElementById('rep-client-email');
            const repClientPhone = document.getElementById('rep-client-phone');
            
            if (!clientId) {
                if (repClientBlock) repClientBlock.style.display = 'none';
            } else {
                const cli = state.clients.find(c => c.id === clientId);
                if (cli) {
                    if (repClientBlock) repClientBlock.style.display = 'block';
                    if (repClientName) repClientName.textContent = cli.name;
                    if (repClientEmail) repClientEmail.textContent = cli.email || '-';
                    if (repClientPhone) repClientPhone.textContent = cli.phone || '-';
                }
            }
        });
    }

    // Client Form Submission
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('client-edit-id').value;
            const name = document.getElementById('client-name').value.trim();
            const email = document.getElementById('client-email').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const notes = document.getElementById('client-notes').value.trim();

            if (!name) return;

            setLoadingState('btn-save-client', true);

            if (isSupabaseConfigured && currentUser) {
                try {
                    if (editId) {
                        const { error } = await supabase.from('clients').update({
                            name,
                            email,
                            phone,
                            notes
                        }).eq('id', editId).eq('user_id', currentUser.id);
                        if (error) throw error;
                        
                        const index = state.clients.findIndex(c => c.id === editId);
                        if (index !== -1) {
                            state.clients[index] = { id: editId, name, email, phone, notes };
                        }
                    } else {
                        const { data, error } = await supabase.from('clients').insert({
                            user_id: currentUser.id,
                            name,
                            email,
                            phone,
                            notes
                        }).select().single();
                        if (error) throw error;
                        if (data) {
                            state.clients.push({ id: data.id, name, email, phone, notes });
                        }
                    }
                } catch(err) {
                    alert("Erro ao salvar cliente no Supabase: " + err.message);
                    setLoadingState('btn-save-client', false);
                    return;
                }
            } else {
                if (editId) {
                    const index = state.clients.findIndex(c => c.id === editId);
                    if (index !== -1) {
                        state.clients[index] = { id: editId, name, email, phone, notes };
                    }
                } else {
                    const newId = `cli-${Date.now()}`;
                    state.clients.push({ id: newId, name, email, phone, notes });
                }
                saveStateToLocalStorage();
            }

            setLoadingState('btn-save-client', false);
            renderClients();
            populateSelectors();
            cancelClientEdit();
            calculateAll();
        });
    }

    const btnCancelClient = document.getElementById('btn-cancel-client-edit');
    if (btnCancelClient) {
        btnCancelClient.addEventListener('click', cancelClientEdit);
    }

    // Service Form Submission
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('service-edit-id').value;
            const name = document.getElementById('service-name').value.trim();
            const hours = parseFloat(document.getElementById('service-hours').value) || 0;
            const description = document.getElementById('service-desc').value.trim();

            if (!name) return;

            setLoadingState('btn-save-service', true);

            if (isSupabaseConfigured && currentUser) {
                try {
                    if (editId) {
                        const { error } = await supabase.from('services').update({
                            name,
                            default_hours: hours,
                            description
                        }).eq('id', editId).eq('user_id', currentUser.id);
                        if (error) throw error;

                        const index = state.services.findIndex(s => s.id === editId);
                        if (index !== -1) {
                            state.services[index] = { id: editId, name, defaultHours: hours, description };
                        }
                    } else {
                        const { data, error } = await supabase.from('services').insert({
                            user_id: currentUser.id,
                            name,
                            default_hours: hours,
                            description
                        }).select().single();
                        if (error) throw error;
                        if (data) {
                            state.services.push({ id: data.id, name, defaultHours: hours, description });
                        }
                    }
                } catch(err) {
                    alert("Erro ao salvar serviço no Supabase: " + err.message);
                    setLoadingState('btn-save-service', false);
                    return;
                }
            } else {
                if (editId) {
                    const index = state.services.findIndex(s => s.id === editId);
                    if (index !== -1) {
                        state.services[index] = { id: editId, name, defaultHours: hours, description };
                    }
                } else {
                    const newId = `srv-${Date.now()}`;
                    state.services.push({ id: newId, name, defaultHours: hours, description });
                }
                saveStateToLocalStorage();
            }

            setLoadingState('btn-save-service', false);
            renderServices();
            populateSelectors();
            cancelServiceEdit();
        });
    }

    const btnCancelService = document.getElementById('btn-cancel-service-edit');
    if (btnCancelService) {
        btnCancelService.addEventListener('click', cancelServiceEdit);
    }

    // Profile Form Submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const officeName = document.getElementById('profile-office-name').value.trim();
            const ownerName = document.getElementById('profile-owner-name').value.trim();
            const email = document.getElementById('profile-email').value.trim();
            const phone = document.getElementById('profile-phone').value.trim();

            const submitBtn = profileForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.setAttribute('disabled', 'disabled');

            state.profile = { officeName, ownerName, email, phone };

            if (isSupabaseConfigured && currentUser) {
                try {
                    const { error } = await supabase.from('profiles').upsert({
                        id: currentUser.id,
                        office_name: officeName,
                        owner_name: ownerName,
                        email: email,
                        phone: phone,
                        workdays: state.workdays,
                        updated_at: new Date()
                    });
                    if (error) throw error;
                } catch (err) {
                    alert('Erro ao salvar perfil no Supabase: ' + err.message);
                }
            } else {
                saveStateToLocalStorage();
            }

            if (submitBtn) submitBtn.removeAttribute('disabled');
            renderProfile();
            alert('Perfil atualizado com sucesso!');
        });
    }

    // Theme toggler
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const body = document.body;
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                const sunIcon = document.querySelector('.sun-icon');
                const moonIcon = document.querySelector('.moon-icon');
                if (sunIcon) sunIcon.style.display = 'none';
                if (moonIcon) moonIcon.style.display = 'block';
                state.theme = 'light';
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                const sunIcon = document.querySelector('.sun-icon');
                const moonIcon = document.querySelector('.moon-icon');
                if (sunIcon) sunIcon.style.display = 'block';
                if (moonIcon) moonIcon.style.display = 'none';
                state.theme = 'dark';
            }
            saveStateToLocalStorage();
        });
    }

    if (state.theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    }

    // Reset button
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (!confirm('Deseja limpar todos os dados do formulário de precificação?')) return;
            localStorage.removeItem('precificacao_state');
            loadDefaults();
            initApp();
        });
    }

    // Global Routing and Navigation (SPA)
    window.addEventListener('hashchange', handleNavigation);
    
    // Auth Tab Switcher
    const tabLogin = document.getElementById('tab-auth-login');
    const tabSignup = document.getElementById('tab-auth-signup');
    const groupName = document.getElementById('group-auth-name');
    const btnSubmit = document.getElementById('btn-submit-auth');
    const nameInput = document.getElementById('login-name');

    if (tabLogin && tabSignup) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            if (groupName) groupName.style.display = 'none';
            if (nameInput) nameInput.removeAttribute('required');
            if (btnSubmit) btnSubmit.textContent = 'Entrar';
            authMode = 'login';
            showAuthMessage('', 'info');
        });

        tabSignup.addEventListener('click', () => {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            if (groupName) groupName.style.display = 'block';
            if (nameInput) nameInput.setAttribute('required', 'required');
            if (btnSubmit) btnSubmit.textContent = 'Criar Conta';
            authMode = 'signup';
            showAuthMessage('', 'info');
        });
    }

    // Quick Demo Mode Auth Button
    const btnDemoAuth = document.getElementById('btn-demo-auth');
    if (btnDemoAuth) {
        btnDemoAuth.addEventListener('click', (e) => {
            e.preventDefault();
            const emailField = document.getElementById('login-email');
            const passField = document.getElementById('login-password');
            if (emailField) emailField.value = 'demo@exemplo.com';
            if (passField) passField.value = '123456';
            handleDemoLogin('demo@exemplo.com', '123456');
        });
    }

    // Auth Form Submit
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const name = document.getElementById('login-name') ? document.getElementById('login-name').value.trim() : '';
            
            showAuthMessage('Carregando...', 'info');

            if (!isSupabaseConfigured || (authMode === 'login' && email === 'demo@exemplo.com' && password === '123456')) {
                if (authMode === 'login') {
                    const success = handleDemoLogin(email, password);
                    if (!success) {
                        showAuthMessage('Email ou senha inválidos no Modo Demonstração (Use: demo@exemplo.com / 123456).', 'error');
                    }
                } else {
                    showAuthMessage('O cadastro de novas contas exige a configuração real das chaves do Supabase no app.js.', 'error');
                }
                return;
            }

            try {
                if (authMode === 'login') {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });
                    if (error) throw error;
                    showAuthMessage('Sucesso! Conectando...', 'success');
                } else {
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: {
                                full_name: name
                            }
                        }
                    });
                    if (error) throw error;
                    showAuthMessage('Conta criada com sucesso! Verifique seu email para confirmação.', 'success');
                }
            } catch (err) {
                showAuthMessage(err.message || 'Ocorreu um erro ao processar a autenticação.', 'error');
            }
        });
    }

    // Password Recovery
    const linkRecover = document.getElementById('link-recover-password');
    if (linkRecover) {
        linkRecover.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            if (!email) {
                showAuthMessage('Digite seu email para solicitar a recuperação de senha.', 'error');
                return;
            }
            
            if (!isSupabaseConfigured) {
                showAuthMessage('A recuperação de senha exige a configuração das chaves reais do Supabase.', 'error');
                return;
            }

            try {
                showAuthMessage('Enviando e-mail de recuperação...', 'info');
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + window.location.pathname + '#configuracoes'
                });
                if (error) throw error;
                showAuthMessage('Instruções de recuperação enviadas para o seu email!', 'success');
            } catch (err) {
                showAuthMessage(err.message || 'Erro ao enviar recuperação.', 'error');
            }
        });
    }

    // Logout Button
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if (currentUser && currentUser.id === 'mock-user-id') {
                handleAuthStateChange(null);
                return;
            }

            if (isSupabaseConfigured && supabase) {
                try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                } catch (err) {
                    alert('Erro ao sair da conta: ' + err.message);
                }
            }
        });
    }

    // Mobile Menu Controls
    const btnMobile = document.getElementById('btn-menu-mobile');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (btnMobile) {
        btnMobile.addEventListener('click', () => {
            sidebar.classList.add('sidebar-open');
            overlay.classList.add('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }
}

// ==========================================================================
// SPA NAVIGATION ROUTER
// ==========================================================================

function handleNavigation() {
    const hash = window.location.hash || '#dashboard';
    
    // Auth Guard
    if (!currentUser) {
        if (hash !== '#login') {
            window.location.hash = '#login';
            return;
        }
    } else {
        if (hash === '#login') {
            window.location.hash = '#dashboard';
            return;
        }
    }

    const viewId = `view-${hash.substring(1)}`;
    const targetView = document.getElementById(viewId);
    
    if (targetView) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        targetView.classList.add('active');
        
        document.querySelectorAll('.sidebar-link').forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        closeMobileSidebar();
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (overlay) overlay.classList.remove('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.step-link').forEach(link => {
        link.classList.remove('active');
    });

    const selectedTab = document.getElementById(`tab-${tabId}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const activeLink = document.querySelector(`.step-link[data-tab="${tabId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

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
