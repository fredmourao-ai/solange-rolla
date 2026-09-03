const STORAGE_KEY = "solange-mvp-v1";
const TODAY = getTodayIso();

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

const state = {
  activeSection: "dashboard",
  clientSearch: "",
  data: loadData(),
};

const refs = {
  metricGrid: byId("metricGrid"),
  timeline: byId("timeline"),
  opsList: byId("opsList"),
  clientList: byId("clientList"),
  appointmentList: byId("appointmentList"),
  financeList: byId("financeList"),
  eventList: byId("eventList"),
  invoiceList: byId("invoiceList"),
  auditList: byId("auditList"),
  systemNotes: byId("systemNotes"),
  todayLabel: byId("todayLabel"),
  sidebarAlert: byId("sidebarAlert"),
  clientSearch: byId("clientSearch"),
  appointmentClient: byId("appointmentClient"),
  financeClient: byId("financeClient"),
  invoiceClient: byId("invoiceClient"),
  clientForm: byId("clientForm"),
  appointmentForm: byId("appointmentForm"),
  financeForm: byId("financeForm"),
  eventForm: byId("eventForm"),
  invoiceForm: byId("invoiceForm"),
  seedButton: byId("seedButton"),
  exportButton: byId("exportButton"),
  emptyStateTemplate: byId("emptyStateTemplate"),
  navItems: [...document.querySelectorAll(".nav-item")],
  sections: [...document.querySelectorAll(".section-pane")],
};

function byId(id) {
  return document.getElementById(id);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createButton(label, className, onClick) {
  const button = createElement("button", className, label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function emptyState() {
  return refs.emptyStateTemplate.content.firstElementChild.cloneNode(true);
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getTodayIso() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 10);
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D+/g, "");
}

function formatCpf(value) {
  const digits = normalizeDigits(value).slice(0, 11);
  if (digits.length !== 11) {
    return value || "";
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskCpf(value) {
  const digits = normalizeDigits(value).slice(0, 11);
  if (digits.length !== 11) {
    return value || "";
  }
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatPhone(value) {
  const digits = normalizeDigits(value).slice(0, 11);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return value || "";
}

function isoToDate(value) {
  return value ? new Date(`${value}T12:00:00`) : null;
}

function formatDate(value) {
  const date = isoToDate(value);
  return date ? shortDateFormatter.format(date) : "Sem data";
}

function formatLongDate(value) {
  const date = isoToDate(value || TODAY);
  return longDateFormatter.format(date);
}

function formatMoney(value) {
  return currencyFormatter.format(Number(value || 0));
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function appendAudit(type, message, meta = {}) {
  state.data.auditLog.unshift({
    id: uid("audit"),
    at: new Date().toISOString(),
    type,
    message,
    meta,
  });
  state.data.auditLog = state.data.auditLog.slice(0, 40);
}

function commit(type, message, meta = {}) {
  appendAudit(type, message, meta);
  saveData();
  renderApp();
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return ensureCollections(parsed);
    } catch {
      const seeded = createSeedData();
      seeded.auditLog.unshift({
        id: uid("audit"),
        at: new Date().toISOString(),
        type: "warning",
        message: "Base local invalida. Seed restaurado automaticamente.",
        meta: {},
      });
      return seeded;
    }
  }
  return createSeedData();
}

function ensureCollections(data) {
  return {
    clients: Array.isArray(data.clients) ? data.clients : [],
    appointments: Array.isArray(data.appointments) ? data.appointments : [],
    financeEntries: Array.isArray(data.financeEntries) ? data.financeEntries : [],
    events: Array.isArray(data.events) ? data.events : [],
    invoices: Array.isArray(data.invoices) ? data.invoices : [],
    auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
  };
}

function createSeedData() {
  const clients = [
    {
      id: uid("client"),
      name: "Aline Torres",
      cpf: "12345678901",
      birthDate: "1990-08-14",
      email: "aline@example.com",
      phone: "31988887777",
      address: "Rua das Acacias, 245",
      emergencyName: "Helena Torres",
      emergencyPhone: "31998886655",
      notes: "Cliente recorrente com perfil fiscal completo.",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid("client"),
      name: "Bruno Lima",
      cpf: "98765432100",
      birthDate: "1988-01-19",
      email: "bruno@example.com",
      phone: "31995554444",
      address: "Av. Central, 980",
      emergencyName: "Marcia Lima",
      emergencyPhone: "31994443322",
      notes: "Aguardar conciliacao do ultimo pagamento.",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid("client"),
      name: "Carla Nunes",
      cpf: "45678912355",
      birthDate: "1995-04-02",
      email: "carla@example.com",
      phone: "31997776666",
      address: "Rua do Contorno, 30",
      emergencyName: "",
      emergencyPhone: "",
      notes: "Cadastro novo, faltam dados fiscais completos.",
      createdAt: new Date().toISOString(),
    },
  ];

  const appointments = [
    {
      id: uid("appt"),
      clientId: clients[0].id,
      date: TODAY,
      startTime: "08:30",
      endTime: "09:30",
      status: "confirmado",
      notes: "Emitir NF no fechamento do dia.",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid("appt"),
      clientId: clients[1].id,
      date: TODAY,
      startTime: "10:00",
      endTime: "11:00",
      status: "pendente",
      notes: "Confirmar baixa financeira antes do atendimento.",
      createdAt: new Date().toISOString(),
    },
  ];

  const financeEntries = [
    {
      id: uid("fin"),
      clientId: clients[0].id,
      description: "Sessao individual",
      amount: 320,
      dueDate: TODAY,
      status: "pago",
      category: "atendimento",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid("fin"),
      clientId: clients[1].id,
      description: "Sessao individual",
      amount: 280,
      dueDate: TODAY,
      status: "pendente",
      category: "atendimento",
      createdAt: new Date().toISOString(),
    },
  ];

  const events = [
    {
      id: uid("event"),
      title: "Workshop de setembro",
      date: "2026-09-05",
      startTime: "14:00",
      endTime: "17:00",
      location: "Espaco Solange",
      capacity: 12,
      createdAt: new Date().toISOString(),
    },
  ];

  const invoices = [
    {
      id: uid("invoice"),
      clientId: clients[0].id,
      number: "000184",
      amount: 320,
      status: "emitida",
      notes: "Conciliada com atendimento individual.",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid("invoice"),
      clientId: clients[1].id,
      number: "000185",
      amount: 280,
      status: "pendente",
      notes: "Aguardando pagamento.",
      createdAt: new Date().toISOString(),
    },
  ];

  const auditLog = [
    {
      id: uid("audit"),
      at: new Date().toISOString(),
      type: "seed",
      message: "Base demo criada para validacao inicial do MVP.",
      meta: { records: 10 },
    },
  ];

  return { clients, appointments, financeEntries, events, invoices, auditLog };
}

function getClient(clientId) {
  return state.data.clients.find(client => client.id === clientId) || null;
}

function compareDateTime(a, b) {
  return `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`);
}

function sortByCreatedAtDesc(list) {
  return [...list].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function metricsModel() {
  const todayAppointments = state.data.appointments.filter(item => item.date === TODAY && item.status !== "cancelado");
  const pendingFinance = state.data.financeEntries.filter(item => item.status !== "pago");
  const pendingInvoices = state.data.invoices.filter(item => item.status !== "emitida");
  const todayRevenue = state.data.financeEntries
    .filter(item => item.status === "pago" && item.dueDate === TODAY)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return [
    { value: String(todayAppointments.length), label: "atendimentos do dia" },
    { value: formatMoney(todayRevenue), label: "recebido hoje" },
    { value: String(pendingFinance.length), label: "pendencias financeiras" },
    { value: String(pendingInvoices.length), label: "notas fora do ideal" },
  ];
}

function renderMetrics() {
  refs.metricGrid.replaceChildren();
  metricsModel().forEach(metric => {
    const card = createElement("article", "metric-card");
    card.append(createElement("strong", "", metric.value), createElement("span", "", metric.label));
    refs.metricGrid.append(card);
  });
}

function renderTimeline() {
  refs.timeline.replaceChildren();
  const list = [...state.data.appointments].sort(compareDateTime).slice(0, 6);
  if (!list.length) {
    refs.timeline.append(emptyState());
    return;
  }

  list.forEach(item => {
    const client = getClient(item.clientId);
    const card = createElement("article", "timeline-item");
    const left = createElement("div", "time-block", item.startTime);
    const right = createElement("div");
    right.append(
      createElement("div", "item-title", client ? client.name : "Cliente removido"),
      createElement("div", "item-meta", `${formatDate(item.date)} · ${item.status}`),
      createElement("div", "item-text", item.notes || "Sem observacoes.")
    );

    const tags = createElement("div", "tag-row");
    tags.append(createElement("span", "tag", `Fim ${item.endTime}`));
    if (item.status !== "concluido") {
      tags.append(createButton("Concluir", "tag", () => updateAppointmentStatus(item.id, "concluido")));
    }
    right.append(tags);
    card.append(left, right);
    refs.timeline.append(card);
  });
}

function renderOpsList() {
  refs.opsList.replaceChildren();
  const pendingFinance = state.data.financeEntries.filter(item => item.status !== "pago").length;
  const pendingInvoices = state.data.invoices.filter(item => item.status !== "emitida").length;
  const missingEmergency = state.data.clients.filter(client => !normalizeDigits(client.emergencyPhone)).length;

  const notes = [
    {
      title: "Financeiro",
      badge: pendingFinance ? `${pendingFinance} pendente(s)` : "OK",
      text: pendingFinance
        ? "Existem cobrancas exigindo acao antes do fechamento."
        : "Nenhuma cobranca em aberto no momento.",
      className: pendingFinance ? "status-warn" : "status-ok",
    },
    {
      title: "Fiscal",
      badge: pendingInvoices ? `${pendingInvoices} nota(s)` : "OK",
      text: pendingInvoices
        ? "Pagamentos e notas ainda nao estao totalmente sincronizados."
        : "Notas emitidas dentro do fluxo esperado.",
      className: pendingInvoices ? "status-danger" : "status-ok",
    },
    {
      title: "Clientes",
      badge: missingEmergency ? `${missingEmergency} ficha(s)` : "OK",
      text: missingEmergency
        ? "Fichas sem contato de emergencia devem ser completadas."
        : "Cadastros sensiveis completos no seed atual.",
      className: missingEmergency ? "status-warn" : "status-ok",
    },
  ];

  notes.forEach(note => refs.opsList.append(stackItem(note.title, note.badge, note.text, note.className)));
}

function stackItem(title, badge, text, badgeClass = "") {
  const card = createElement("article", "stack-item");
  const head = createElement("div", "stack-item-head");
  head.append(createElement("div", "item-title", title), createElement("span", `status-badge ${badgeClass}`.trim(), badge));
  card.append(head, createElement("div", "item-text", text));
  return card;
}

function renderClientList() {
  refs.clientList.replaceChildren();
  const search = state.clientSearch.trim().toLowerCase();
  const clients = sortByCreatedAtDesc(state.data.clients).filter(client => {
    if (!search) return true;
    return [client.name, client.email, client.phone, client.cpf].some(value =>
      String(value || "").toLowerCase().includes(search)
    );
  });

  if (!clients.length) {
    refs.clientList.append(emptyState());
    return;
  }

  clients.forEach(client => {
    const details = [
      `CPF ${maskCpf(client.cpf)}`,
      client.phone ? formatPhone(client.phone) : "Telefone nao informado",
      client.email || "Email nao informado",
    ].join(" · ");
    const emergencyLine = `Emergencia: ${client.emergencyName || "nao informado"} / ${
      client.emergencyPhone ? formatPhone(client.emergencyPhone) : "nao informado"
    }`;
    const clientText = [client.notes, emergencyLine].filter(Boolean).join(" · ");

    const missingEmergency = !normalizeDigits(client.emergencyPhone);
    const card = createElement("article", "stack-item");
    const head = createElement("div", "stack-item-head");
    head.append(
      createElement("div", "item-title", client.name),
      createElement("span", `status-badge ${missingEmergency ? "status-warn" : "status-ok"}`.trim(), missingEmergency ? "Completar ficha" : "Ficha pronta")
    );
    card.append(
      head,
      createElement("div", "item-meta", details),
      createElement("div", "item-text", clientText)
    );
    refs.clientList.append(card);
  });
}

function renderAppointmentList() {
  refs.appointmentList.replaceChildren();
  const appointments = [...state.data.appointments].sort(compareDateTime);
  if (!appointments.length) {
    refs.appointmentList.append(emptyState());
    return;
  }

  appointments.forEach(item => {
    const client = getClient(item.clientId);
    const card = createElement("article", "stack-item");
    const head = createElement("div", "stack-item-head");
    const badgeClass = item.status === "confirmado" || item.status === "concluido" ? "status-ok" : item.status === "pendente" ? "status-warn" : "status-danger";
    head.append(
      createElement("div", "item-title", client ? client.name : "Cliente removido"),
      createElement("span", `status-badge ${badgeClass}`.trim(), item.status)
    );

    const actions = createElement("div", "tag-row");
    if (item.status !== "concluido") {
      actions.append(createButton("Marcar concluido", "tag", () => updateAppointmentStatus(item.id, "concluido")));
    }

    card.append(
      head,
      createElement("div", "item-meta", `${formatDate(item.date)} · ${item.startTime} - ${item.endTime}`),
      createElement("div", "item-text", item.notes || "Sem observacoes."),
      actions
    );
    refs.appointmentList.append(card);
  });
}

function renderFinanceList() {
  refs.financeList.replaceChildren();
  const items = sortByCreatedAtDesc(state.data.financeEntries);
  if (!items.length) {
    refs.financeList.append(emptyState());
    return;
  }

  items.forEach(item => {
    const client = getClient(item.clientId);
    const badgeClass = item.status === "pago" ? "status-ok" : item.status === "atrasado" ? "status-danger" : "status-warn";
    const card = createElement("article", "stack-item");
    const head = createElement("div", "stack-item-head");
    head.append(
      createElement("div", "item-title", `${item.description} · ${client ? client.name : "Cliente removido"}`),
      createElement("div", `money ${badgeClass}`.trim(), formatMoney(item.amount))
    );

    const tags = createElement("div", "tag-row");
    tags.append(createElement("span", "tag", item.status));
    if (item.status !== "pago") {
      tags.append(createButton("Baixar pagamento", "tag", () => updateFinanceStatus(item.id, "pago")));
    }

    card.append(
      head,
      createElement("div", "item-meta", `${item.category} · vencimento ${formatDate(item.dueDate)}`),
      createElement("div", "item-text", `Status atual: ${item.status}`),
      tags
    );
    refs.financeList.append(card);
  });
}

function renderEventList() {
  refs.eventList.replaceChildren();
  const items = [...state.data.events].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  if (!items.length) {
    refs.eventList.append(emptyState());
    return;
  }

  items.forEach(item => {
    const card = createElement("article", "stack-item");
    const head = createElement("div", "stack-item-head");
    head.append(
      createElement("div", "item-title", item.title),
      createElement("span", "status-badge", `${item.capacity || 0} vagas`)
    );

    card.append(
      head,
      createElement("div", "item-meta", `${formatDate(item.date)} · ${item.startTime} - ${item.endTime}`),
      createElement("div", "item-text", item.location || "Local nao informado")
    );
    refs.eventList.append(card);
  });
}

function renderInvoiceList() {
  refs.invoiceList.replaceChildren();
  const items = sortByCreatedAtDesc(state.data.invoices);
  if (!items.length) {
    refs.invoiceList.append(emptyState());
    return;
  }

  items.forEach(item => {
    const client = getClient(item.clientId);
    const badgeClass = item.status === "emitida" ? "status-ok" : item.status === "rejeitada" ? "status-danger" : "status-warn";
    const card = createElement("article", "stack-item");
    const head = createElement("div", "stack-item-head");
    head.append(
      createElement("div", "item-title", `NF ${item.number} · ${client ? client.name : "Cliente removido"}`),
      createElement("span", `status-badge ${badgeClass}`.trim(), item.status)
    );

    const tags = createElement("div", "tag-row");
    tags.append(createElement("span", "tag", item.status));
    if (item.status !== "emitida") {
      tags.append(createButton("Marcar emitida", "tag", () => updateInvoiceStatus(item.id, "emitida")));
    }

    card.append(
      head,
      createElement("div", "item-meta", formatMoney(item.amount)),
      createElement("div", "item-text", item.notes || "Sem observacoes."),
      tags
    );
    refs.invoiceList.append(card);
  });
}

function renderAuditList() {
  refs.auditList.replaceChildren();
  const items = state.data.auditLog.slice(0, 16);
  if (!items.length) {
    refs.auditList.append(emptyState());
    return;
  }

  items.forEach(item => {
    const card = createElement("article", "stack-item");
    const head = createElement("div", "stack-item-head");
    head.append(
      createElement("div", "item-title", item.message),
      createElement("span", "status-badge", item.type)
    );
    card.append(
      head,
      createElement("div", "item-meta", new Date(item.at).toLocaleString("pt-BR")),
      createElement("div", "item-text", JSON.stringify(item.meta))
    );
    refs.auditList.append(card);
  });
}

function renderSystemNotes() {
  refs.systemNotes.replaceChildren();
  const notes = [
    "Persistencia local por localStorage. Boa para MVP, fraca para multiusuario.",
    "Sem backend e sem autenticao. Dados sensiveis ainda exigem camada segura antes de producao.",
    "Renderizacao das listas usa createElement em vez de innerHTML para reduzir risco futuro.",
    "Fluxos centrais ja existem localmente: cliente, agenda, financeiro, evento e fiscal.",
  ];
  notes.forEach(note => refs.systemNotes.append(stackItem("Observacao", "MVP", note)));
}

function renderSidebar() {
  refs.todayLabel.textContent = formatLongDate(TODAY);
  const pendingFinance = state.data.financeEntries.filter(item => item.status !== "pago").length;
  const pendingInvoices = state.data.invoices.filter(item => item.status !== "emitida").length;
  refs.sidebarAlert.textContent =
    pendingFinance || pendingInvoices
      ? `${pendingFinance} pendencia(s) financeira(s) e ${pendingInvoices} nota(s) fora do ideal.`
      : "Operacao do dia sem alertas criticos.";
}

function renderSelectOptions() {
  const selects = [refs.appointmentClient, refs.financeClient, refs.invoiceClient];
  selects.forEach(select => {
    const previous = select.value;
    select.replaceChildren();
    const placeholder = createElement("option", "", "Selecione");
    placeholder.value = "";
    select.append(placeholder);
    state.data.clients.forEach(client => {
      const option = createElement("option", "", client.name);
      option.value = client.id;
      select.append(option);
    });
    select.value = previous && [...select.options].some(option => option.value === previous) ? previous : "";
  });
}

function renderSections() {
  refs.sections.forEach(section => {
    section.classList.toggle("is-visible", section.dataset.section === state.activeSection);
  });
  refs.navItems.forEach(button => {
    button.classList.toggle("is-active", button.dataset.sectionTarget === state.activeSection);
  });
}

function renderApp() {
  renderSections();
  renderSidebar();
  renderMetrics();
  renderTimeline();
  renderOpsList();
  renderClientList();
  renderAppointmentList();
  renderFinanceList();
  renderEventList();
  renderInvoiceList();
  renderAuditList();
  renderSystemNotes();
  renderSelectOptions();
}

function validateClient(payload) {
  if (!payload.name.trim()) {
    throw new Error("Nome do cliente e obrigatorio.");
  }
  const cpf = normalizeDigits(payload.cpf);
  if (cpf.length !== 11) {
    throw new Error("CPF precisa ter 11 digitos.");
  }
  if (state.data.clients.some(client => normalizeDigits(client.cpf) === cpf)) {
    throw new Error("CPF ja cadastrado na base local.");
  }
}

function validateAppointment(payload) {
  if (!payload.clientId) {
    throw new Error("Selecione um cliente para o agendamento.");
  }
  if (!getClient(payload.clientId)) {
    throw new Error("Cliente do agendamento nao existe mais.");
  }
  if (!payload.date) {
    throw new Error("Data do agendamento e obrigatoria.");
  }
  if (payload.endTime <= payload.startTime) {
    throw new Error("Horario final precisa ser maior que o inicial.");
  }
}

function validateFinance(payload) {
  if (!payload.clientId) {
    throw new Error("Selecione um cliente para o lancamento.");
  }
  if (!getClient(payload.clientId)) {
    throw new Error("Cliente do lancamento nao existe mais.");
  }
  if (!payload.description.trim()) {
    throw new Error("Descricao financeira e obrigatoria.");
  }
  if (!payload.dueDate) {
    throw new Error("Vencimento financeiro e obrigatorio.");
  }
  if (Number(payload.amount) <= 0) {
    throw new Error("Valor financeiro precisa ser maior que zero.");
  }
}

function validateEvent(payload) {
  if (!payload.title.trim()) {
    throw new Error("Titulo do evento e obrigatorio.");
  }
  if (!payload.date) {
    throw new Error("Data do evento e obrigatoria.");
  }
  if (payload.endTime <= payload.startTime) {
    throw new Error("Fim do evento precisa ser maior que o inicio.");
  }
  if (Number(payload.capacity) < 0) {
    throw new Error("Capacidade do evento nao pode ser negativa.");
  }
}

function validateInvoice(payload) {
  if (!payload.clientId) {
    throw new Error("Selecione um cliente para a nota.");
  }
  if (!getClient(payload.clientId)) {
    throw new Error("Cliente da nota nao existe mais.");
  }
  if (!payload.number.trim()) {
    throw new Error("Numero da nota e obrigatorio.");
  }
  if (state.data.invoices.some(invoice => invoice.number === payload.number.trim())) {
    throw new Error("Numero da nota ja cadastrado.");
  }
  if (Number(payload.amount) <= 0) {
    throw new Error("Valor da nota precisa ser maior que zero.");
  }
}

function submitClient(event) {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: uid("client"),
      name: String(formData.get("name") || "").trim(),
      cpf: normalizeDigits(formData.get("cpf")),
      birthDate: String(formData.get("birthDate") || ""),
      email: String(formData.get("email") || "").trim(),
      phone: normalizeDigits(formData.get("phone")),
      address: String(formData.get("address") || "").trim(),
      emergencyName: String(formData.get("emergencyName") || "").trim(),
      emergencyPhone: normalizeDigits(formData.get("emergencyPhone")),
      notes: String(formData.get("notes") || "").trim(),
      createdAt: new Date().toISOString(),
    };
    validateClient(payload);
    state.data.clients.unshift(payload);
    event.currentTarget.reset();
    state.activeSection = "clientes";
    commit("create-client", `Cliente ${payload.name} cadastrado.`, { clientId: payload.id });
  } catch (error) {
    alert(error.message);
  }
}

function submitAppointment(event) {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: uid("appt"),
      clientId: String(formData.get("clientId") || ""),
      date: String(formData.get("date") || ""),
      startTime: String(formData.get("startTime") || ""),
      endTime: String(formData.get("endTime") || ""),
      status: String(formData.get("status") || "pendente"),
      notes: String(formData.get("notes") || "").trim(),
      createdAt: new Date().toISOString(),
    };
    validateAppointment(payload);
    state.data.appointments.push(payload);
    event.currentTarget.reset();
    state.activeSection = "agenda";
    commit("create-appointment", "Agendamento salvo.", { appointmentId: payload.id, clientId: payload.clientId });
  } catch (error) {
    alert(error.message);
  }
}

function submitFinance(event) {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: uid("fin"),
      clientId: String(formData.get("clientId") || ""),
      description: String(formData.get("description") || "").trim(),
      amount: Number(formData.get("amount") || 0),
      dueDate: String(formData.get("dueDate") || ""),
      status: String(formData.get("status") || "pendente"),
      category: String(formData.get("category") || "atendimento"),
      createdAt: new Date().toISOString(),
    };
    validateFinance(payload);
    state.data.financeEntries.unshift(payload);
    event.currentTarget.reset();
    state.activeSection = "financeiro";
    commit("create-finance", "Lancamento financeiro salvo.", { financeId: payload.id, clientId: payload.clientId });
  } catch (error) {
    alert(error.message);
  }
}

function submitEvent(event) {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: uid("event"),
      title: String(formData.get("title") || "").trim(),
      date: String(formData.get("date") || ""),
      startTime: String(formData.get("startTime") || ""),
      endTime: String(formData.get("endTime") || ""),
      location: String(formData.get("location") || "").trim(),
      capacity: Number(formData.get("capacity") || 0),
      createdAt: new Date().toISOString(),
    };
    validateEvent(payload);
    state.data.events.unshift(payload);
    event.currentTarget.reset();
    state.activeSection = "eventos";
    commit("create-event", `Evento ${payload.title} salvo.`, { eventId: payload.id });
  } catch (error) {
    alert(error.message);
  }
}

function submitInvoice(event) {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: uid("invoice"),
      clientId: String(formData.get("clientId") || ""),
      number: String(formData.get("number") || "").trim(),
      amount: Number(formData.get("amount") || 0),
      status: String(formData.get("status") || "pendente"),
      notes: String(formData.get("notes") || "").trim(),
      createdAt: new Date().toISOString(),
    };
    validateInvoice(payload);
    state.data.invoices.unshift(payload);
    event.currentTarget.reset();
    state.activeSection = "fiscal";
    commit("create-invoice", `Nota ${payload.number} registrada.`, { invoiceId: payload.id, clientId: payload.clientId });
  } catch (error) {
    alert(error.message);
  }
}

function updateAppointmentStatus(id, status) {
  const item = state.data.appointments.find(record => record.id === id);
  if (!item) return;
  item.status = status;
  commit("update-appointment", `Agendamento atualizado para ${status}.`, { appointmentId: id });
}

function updateFinanceStatus(id, status) {
  const item = state.data.financeEntries.find(record => record.id === id);
  if (!item) return;
  item.status = status;
  commit("update-finance", `Lancamento financeiro atualizado para ${status}.`, { financeId: id });
}

function updateInvoiceStatus(id, status) {
  const item = state.data.invoices.find(record => record.id === id);
  if (!item) return;
  item.status = status;
  commit("update-invoice", `Nota atualizada para ${status}.`, { invoiceId: id });
}

function resetDemo() {
  state.data = createSeedData();
  commit("seed-reset", "Base demo restaurada manualmente.", {});
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = createElement("a");
  link.href = url;
  link.download = "solange-export.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  appendAudit("export", "Exportacao JSON preparada localmente.", { size: blob.size });
  saveData();
  renderAuditList();
}

function bindEvents() {
  refs.navItems.forEach(button => {
    button.addEventListener("click", () => {
      state.activeSection = button.dataset.sectionTarget;
      renderSections();
    });
  });

  refs.clientSearch.addEventListener("input", event => {
    state.clientSearch = event.currentTarget.value;
    renderClientList();
  });

  refs.clientForm.addEventListener("submit", submitClient);
  refs.appointmentForm.addEventListener("submit", submitAppointment);
  refs.financeForm.addEventListener("submit", submitFinance);
  refs.eventForm.addEventListener("submit", submitEvent);
  refs.invoiceForm.addEventListener("submit", submitInvoice);
  refs.seedButton.addEventListener("click", resetDemo);
  refs.exportButton.addEventListener("click", exportJson);
}

bindEvents();
renderApp();
