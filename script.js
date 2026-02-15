// ========== DATA STRUCTURE & STATE ==========
let chatbots = [
  {
    id: 1,
    name: "Chatbot Presisi Digital",
    phone: "+62274512234",
    alias: "polres",
    description: "Chatbot untuk Polres Garut",
    menus: [
      {
        id: 101,
        name: "Layanan Dan Informasi",
        type: "Navigation",
        description: "Selamat datang di layanan Polres Garut",
        footer: "Powered By BYFA-Z",
        buttonText: "Pilih Menu",
        children: [
          {
            id: 1011,
            name: "Info Surat SKCK",
            type: "Navigation",
            description: "Info pembuatan SKCK",
            children: [
              {
                id: 10111,
                name: "Pengajuan SKCK",
                type: "Navigation",
                description: "Pengajuan SKCK baru",
              },
            ],
          },
          {
            id: 1012,
            name: "Info Surat Keterangan",
            type: "Navigation",
            description: "Info pembuatan surat keterangan",
            children: [
              {
                id: 10121,
                name: "Pengajuan Keterangan",
                type: "Navigation",
                description: "Pengajuan surat keterangan baru",
              },
            ],
          },
        ],
      },
      {
        id: 102,
        name: "Laporan Darurat",
        type: "Navigation",
        description: "Laporan kejadian darurat",
        footer: "Powered By BYFA-Z",
        buttonText: "Laporan",
        children: [
          {
            id: 1021,
            name: "Pencurian/Periguan",
            type: "Navigation",
            description: "Laporan pencurian atau periguan",
            children: [],
          },
        ],
      },
      {
        id: 103,
        name: "Konsultasi Hukum",
        type: "Proses",
        description: "Layanan konsultasi hukum gratis",
        footer: "Powered By BYFA-Z",
        buttonText: "Konsultasi",
        children: [],
      },
    ],
  },
  {
    id: 2,
    name: "Chatbot Fire Combat",
    phone: "+62274512235",
    alias: "damkar",
    description: "Chatbot untuk Damkar",
    menus: [
      {
        id: 201,
        name: "Laporan Kebakaran",
        type: "Navigation",
        description: "Laporan kejadian kebakaran",
        footer: "Powered By Fire Combat",
        buttonText: "Lapor",
        children: [
          {
            id: 2011,
            name: "Lokasi Kebakaran",
            type: "Navigation",
            description: "Masukkan lokasi kebakaran",
            children: [],
          },
          {
            id: 2012,
            name: "Skalabilitas Bahaya",
            type: "Navigation",
            description: "Tentukan tingkat bahaya",
            children: [],
          },
        ],
      },
      {
        id: 202,
        name: "Panduan Keselamatan",
        type: "Informasi",
        description: "Panduan keselamatan dalam kebakaran",
        footer: "Powered By Fire Combat",
        buttonText: "Pelajari",
        children: [
          {
            id: 2021,
            name: "Evakuasi Diri",
            type: "Informasi",
            description: "Cara evakuasi yang aman",
            children: [],
          },
        ],
      },
      {
        id: 203,
        name: "Emergency Contact",
        type: "Navigation",
        description: "Hubungi layanan darurat",
        footer: "Powered By Fire Combat",
        buttonText: "Hubungi",
        children: [],
      },
    ],
  },
];

let currentChatbotId = null;
let currentSelectedNode = null;
let editingNodeId = null;
let editingChatbotId = null;
let expandedNodes = new Set();

// ========== INITIALIZE ==========
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderChatbotList();
});

// ========== LOCAL STORAGE ==========
function saveToLocalStorage() {
  localStorage.setItem("chatbotData", JSON.stringify(chatbots));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("chatbotData");
  if (saved) {
    try {
      chatbots = JSON.parse(saved);
    } catch (e) {
      console.log("Error loading data, using default");
    }
  }
}

// ========== CHATBOT LIST RENDERING ==========
function renderChatbotList() {
  const listEl = document.getElementById("chatbotList");
  listEl.innerHTML = "";
  chatbots.forEach((chatbot) => {
    const li = document.createElement("li");

    const itemDiv = document.createElement("div");
    itemDiv.className = "chatbot-item";
    if (currentChatbotId === chatbot.id) {
      itemDiv.classList.add("active");
    }

    const nameDiv = document.createElement("div");
    nameDiv.className = "chatbot-name";
    nameDiv.textContent = chatbot.name;
    if (chatbot.deployed) {
      nameDiv.textContent += " 🚀";
    }
    nameDiv.onclick = () => selectChatbot(chatbot.id);
    itemDiv.appendChild(nameDiv);

    const actions = document.createElement("div");
    actions.className = "tree-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-small";
    editBtn.textContent = "✏️";
    editBtn.title = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      openEditChatbotModal(chatbot);
    };
    actions.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.className = "btn-small btn-delete";
    delBtn.textContent = "🗑️";
    delBtn.title = "Hapus";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteChatbot(chatbot.id);
    };
    actions.appendChild(delBtn);

    itemDiv.appendChild(actions);
    li.appendChild(itemDiv);
    listEl.appendChild(li);
  });
}

// ========== CHATBOT SELECTION ==========
function selectChatbot(chatbotId) {
  currentChatbotId = chatbotId;
  currentSelectedNode = null;
  expandedNodes.clear();

  const chatbot = findChatbotById(chatbotId);
  if (chatbot) {
    document.getElementById("menuTitle").textContent = `Menu - ${chatbot.name}`;
    document.getElementById("btnAddMenu").disabled = false;
  }

  renderChatbotList();
  renderMenuTree();
  updateValidator();

  document.getElementById("contentPanel").innerHTML = `
    <div class="panel-empty">
      <p>Pilih menu untuk mengedit detail</p>
    </div>
  `;
}

function addChatbot() {
  alert("Fitur tambah chatbot akan diimplementasikan");
}

function deleteChatbot(chatbotId) {
  if (confirm("Yakin ingin menghapus chatbot ini?")) {
    chatbots = chatbots.filter((bot) => bot.id !== chatbotId);
    if (currentChatbotId === chatbotId) {
      currentChatbotId = null;
      currentSelectedNode = null;
      document.getElementById("menuTitle").textContent = "Menu Utama";
      document.getElementById("btnAddMenu").disabled = true;
      document.getElementById("contentPanel").innerHTML = `
        <div class="panel-empty">
          <p>Pilih chatbot dan menu untuk mengedit detail</p>
        </div>
      `;
    }
    saveToLocalStorage();
    renderChatbotList();
    renderMenuTree();
  }
}

// ========== RENDER MENU TREE ==========
function renderMenuTree() {
  const treeEl = document.getElementById("menuTree");
  treeEl.innerHTML = "";

  if (!currentChatbotId) {
    return;
  }

  const chatbot = findChatbotById(currentChatbotId);
  if (chatbot && chatbot.menus) {
    chatbot.menus.forEach((node) => {
      treeEl.appendChild(createTreeNode(node));
    });
  }
}

function createTreeNode(node, level = 0) {
  const li = document.createElement("li");

  const hasChildren = node.children && node.children.length > 0;

  const itemDiv = document.createElement("div");
  itemDiv.className = "tree-item";
  if (currentSelectedNode && currentSelectedNode.id === node.id) {
    itemDiv.classList.add("active");
  }

  const label = document.createElement("div");
  label.className = "tree-label";

  if (hasChildren) {
    const toggle = document.createElement("span");
    toggle.className = "toggle-icon";
    if (!expandedNodes.has(node.id)) {
      toggle.classList.add("collapsed");
    }
    toggle.textContent = "▼";
    toggle.onclick = (e) => {
      e.stopPropagation();
      toggleNode(node.id);
    };
    label.appendChild(toggle);
  } else {
    const spacer = document.createElement("span");
    spacer.style.width = "16px";
    label.appendChild(spacer);
  }

  const nameSpan = document.createElement("span");
  nameSpan.textContent = node.name;
  nameSpan.style.cursor = "pointer";
  nameSpan.onclick = () => selectNode(node);
  label.appendChild(nameSpan);

  itemDiv.appendChild(label);

  // Action buttons
  const actions = document.createElement("div");
  actions.className = "tree-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "btn-small";
  editBtn.textContent = "✏️";
  editBtn.title = "Edit";
  editBtn.onclick = (e) => {
    e.stopPropagation();
    openEditModal(node);
  };
  actions.appendChild(editBtn);

  const addBtn = document.createElement("button");
  addBtn.className = "btn-small";
  addBtn.textContent = "+";
  addBtn.title = "Tambah Sub Menu";
  addBtn.onclick = (e) => {
    e.stopPropagation();
    openAddSubModal(node);
  };
  actions.appendChild(addBtn);

  const delBtn = document.createElement("button");
  delBtn.className = "btn-small btn-delete";
  delBtn.textContent = "🗑️";
  delBtn.title = "Hapus";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    deleteNode(node.id);
  };
  actions.appendChild(delBtn);

  itemDiv.appendChild(actions);
  li.appendChild(itemDiv);

  // Children
  if (hasChildren && expandedNodes.has(node.id)) {
    const ul = document.createElement("ul");
    node.children.forEach((child) => {
      ul.appendChild(createTreeNode(child, level + 1));
    });
    li.appendChild(ul);
  }

  return li;
}

// ========== NODE SELECTION & DISPLAY ==========
function selectNode(node) {
  currentSelectedNode = node;
  renderMenuTree();
  displayNodeContent(node);
}

function displayNodeContent(node) {
  const panel = document.getElementById("contentPanel");

  let html = `
    <div class="panel-content">
      <div class="panel-header">${node.name}</div>
      
      <form onsubmit="return false;">
        <div class="form-group">
          <label>Tipe:</label>
          <input type="text" value="${node.type}" readonly>
        </div>
        
        <div class="form-group">
          <label>Deskripsi:</label>
          <textarea readonly>${node.description || ""}</textarea>
        </div>
  `;

  // Hanya tampilkan footer dan button text jika tipe adalah Navigation
  if (node.type === "Navigation") {
    html += `
        <div class="form-group">
          <label>Footer:</label>
          <input type="text" value="${node.footer || ""}" readonly>
        </div>
        
        <div class="form-group">
          <label>Button Text:</label>
          <input type="text" value="${node.buttonText || ""}" readonly>
        </div>
    `;
  }

  html += ``;

  // Sub menu
  if (node.children && node.children.length > 0) {
    html += `<div class="submenu-section">
      <h4>Sub Menu</h4>`;
    node.children.forEach((child) => {
      html += `<div class="submenu-item">• ${child.name}</div>`;
    });
    html += `</div>`;
  }

  // Media upload
  html += `
        <div class="form-group">
          <label>Upload Media (Image/Video):</label>
          <div class="media-upload" onclick="document.getElementById('mediaInput').click()">
            <p>📁 Klik untuk upload media</p>
            <input type="file" id="mediaInput" accept="image/*,video/*">
          </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0, 255, 136, 0.2);">
          <button class="btn-save" onclick="editNodeFromPanel(${node.id})">Edit Node</button>
        </div>
      </form>
    </div>
  `;

  panel.innerHTML = html;

  // Auto-resize textarea in content panel
  setTimeout(() => {
    const textarea = panel.querySelector("textarea");
    if (textarea) {
      autoResizeTextarea(textarea);
      textarea.addEventListener("input", function () {
        autoResizeTextarea(this);
      });
    }
  }, 0);
}

// ========== TOGGLE EXPAND COLLAPSE ==========
function toggleNode(nodeId) {
  if (expandedNodes.has(nodeId)) {
    expandedNodes.delete(nodeId);
  } else {
    expandedNodes.add(nodeId);
  }
  renderMenuTree();
}

// ========== MODAL FUNCTIONS ==========
function openAddRootModal() {
  editingNodeId = null;
  document.getElementById("modalTitle").textContent = "Tambah Menu Utama";
  document.getElementById("nodeName").value = "";
  document.getElementById("nodeDesc").value = "";
  document.getElementById("nodeType").value = "Informasi";
  document.getElementById("nodeFooter").value = "";
  document.getElementById("nodeButtonText").value = "";
  document.getElementById("nodeModal").classList.add("show");

  // Update visibility of footer and button text fields
  updateModalFieldVisibility();

  // Resize textarea
  setTimeout(() => {
    autoResizeTextarea(document.getElementById("nodeDesc"));
  }, 0);
}

function addRootNode() {
  if (!currentChatbotId) {
    alert("Pilih chatbot terlebih dahulu!");
    return;
  }
  openAddRootModal();
}

function openAddSubModal(parentNode) {
  editingNodeId = null;
  document.getElementById("modalTitle").textContent =
    `Tambah Sub Menu untuk "${parentNode.name}"`;
  document.getElementById("nodeName").value = "";
  document.getElementById("nodeDesc").value = "";
  document.getElementById("nodeType").value = "Informasi";
  document.getElementById("nodeFooter").value = "";
  document.getElementById("nodeButtonText").value = "";
  document.getElementById("nodeModal").dataset.parentId = parentNode.id;
  document.getElementById("nodeModal").classList.add("show");

  // Update visibility of footer and button text fields
  updateModalFieldVisibility();

  // Resize textarea
  setTimeout(() => {
    autoResizeTextarea(document.getElementById("nodeDesc"));
  }, 0);
}

function openEditModal(node) {
  editingNodeId = node.id;
  document.getElementById("modalTitle").textContent = `Edit: ${node.name}`;
  document.getElementById("nodeName").value = node.name;
  document.getElementById("nodeDesc").value = node.description || "";
  document.getElementById("nodeType").value = node.type;
  document.getElementById("nodeFooter").value = node.footer || "";
  document.getElementById("nodeButtonText").value = node.buttonText || "";
  document.getElementById("nodeModal").classList.add("show");

  // Update visibility of footer and button text fields
  updateModalFieldVisibility();

  // Resize textarea to fit content
  setTimeout(() => {
    autoResizeTextarea(document.getElementById("nodeDesc"));
  }, 0);
}

function editNodeFromPanel(nodeId) {
  const node = findNodeInChatbot(nodeId);
  if (node) {
    openEditModal(node);
  }
}

function closeModal() {
  document.getElementById("nodeModal").classList.remove("show");
  document.getElementById("nodeModal").removeAttribute("data-parentId");
  editingNodeId = null;
}

function saveNode() {
  const name = document.getElementById("nodeName").value.trim();
  const desc = document.getElementById("nodeDesc").value.trim();
  const type = document.getElementById("nodeType").value;
  const footer = document.getElementById("nodeFooter").value.trim();
  const buttonText = document.getElementById("nodeButtonText").value.trim();
  const parentId = document.getElementById("nodeModal").dataset.parentId;

  if (!name) {
    alert("Nama node harus diisi!");
    return;
  }

  const chatbot = findChatbotById(currentChatbotId);
  if (!chatbot) {
    alert("Chatbot tidak ditemukan!");
    return;
  }

  if (editingNodeId) {
    // Edit existing node
    const node = findNodeInChatbot(editingNodeId);
    if (node) {
      node.name = name;
      node.description = desc;
      node.type = type;
      node.footer = footer;
      node.buttonText = buttonText;
    }
  } else if (parentId) {
    // Add sub node
    const parentNode = findNodeInChatbot(parseInt(parentId));
    if (parentNode) {
      const newId = generateId(chatbot.menus);
      // Initialize children array if it doesn't exist
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push({
        id: newId,
        name: name,
        type: type,
        description: desc,
        footer: footer,
        buttonText: buttonText,
        children: [],
      });
      // Auto-set parent type to Navigation when it has children
      parentNode.type = "Navigation";
    }
  } else {
    // Add root node
    const newId = generateId(chatbot.menus);
    chatbot.menus.push({
      id: newId,
      name: name,
      type: type,
      description: desc,
      footer: footer || "Powered By BYFA-Z",
      buttonText: buttonText || "Pilih Menu",
      children: [],
    });
  }

  saveToLocalStorage();
  renderMenuTree();
  updateValidator();
  closeModal();
}

// ========== DELETE NODE ==========
function deleteNode(nodeId) {
  if (confirm("Yakin ingin menghapus node ini?")) {
    const chatbot = findChatbotById(currentChatbotId);
    if (chatbot) {
      chatbot.menus = chatbot.menus.filter((node) => node.id !== nodeId);
      deleteNodeRecursive(chatbot.menus, nodeId);

      if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        currentSelectedNode = null;
        document.getElementById("contentPanel").innerHTML = `
          <div class="panel-empty">
            <p>Pilih menu untuk mengedit detail</p>
          </div>
        `;
      }
      saveToLocalStorage();
      renderMenuTree();
      updateValidator();
    }
  }
}

function deleteNodeRecursive(nodes, nodeId) {
  for (let node of nodes) {
    if (node.children) {
      node.children = node.children.filter((child) => child.id !== nodeId);
      deleteNodeRecursive(node.children, nodeId);
    }
  }
}

// ========== UTILITY FUNCTIONS ==========
function findChatbotById(chatbotId) {
  return chatbots.find((bot) => bot.id === chatbotId);
}

function findNodeInChatbot(nodeId) {
  const chatbot = findChatbotById(currentChatbotId);
  if (!chatbot) return null;

  function search(nodes) {
    for (let node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  return search(chatbot.menus);
}

function generateId(nodes) {
  return Math.max(0, ...extractAllIds(nodes)) + 1;
}

function extractAllIds(nodes) {
  let ids = [];
  for (let node of nodes) {
    ids.push(node.id);
    if (node.children) {
      ids = ids.concat(extractAllIds(node.children));
    }
  }
  return ids;
}

// ========== CHATBOT MODAL FUNCTIONS ==========
function openEditChatbotModal(chatbot) {
  document.getElementById("chatbotModalTitle").textContent = "Edit Chatbot";
  document.getElementById("chatbotName").value = chatbot.name || "";
  document.getElementById("chatbotPhone").value = chatbot.phone || "";
  document.getElementById("chatbotDescription").value =
    chatbot.description || "";

  // Store the current chatbot ID for saving
  window.editingChatbotId = chatbot.id;

  document.getElementById("chatbotModal").style.display = "block";

  // Resize textarea
  setTimeout(() => {
    autoResizeTextarea(document.getElementById("chatbotDescription"));
  }, 0);
}

function closeChatbotModal() {
  document.getElementById("chatbotModal").style.display = "none";
  window.editingChatbotId = null;
}

function saveChatbot() {
  const chatbotId = window.editingChatbotId;
  if (!chatbotId) return;

  const chatbot = findChatbotById(chatbotId);
  if (!chatbot) return;

  chatbot.name = document.getElementById("chatbotName").value;
  chatbot.phone = document.getElementById("chatbotPhone").value;
  chatbot.description = document.getElementById("chatbotDescription").value;

  // Save to localStorage
  localStorage.setItem("chatbotData", JSON.stringify(chatbots));

  // Update the display
  renderChatbotList();
  updateValidator();

  closeChatbotModal();
}

// ========== MODAL CLICK HANDLERS ==========
window.onclick = function (event) {
  const nodeModal = document.getElementById("nodeModal");
  const chatbotModal = document.getElementById("chatbotModal");

  if (event.target === nodeModal) {
    closeModal();
  }
  if (event.target === chatbotModal) {
    closeChatbotModal();
  }
};

// ========== MODAL FIELD VISIBILITY ==========
function updateModalFieldVisibility() {
  const nodeType = document.getElementById("nodeType").value;
  const footerField = document
    .getElementById("nodeFooter")
    .closest(".modal-field");
  const buttonTextField = document
    .getElementById("nodeButtonText")
    .closest(".modal-field");

  if (nodeType === "Navigation") {
    footerField.style.display = "block";
    buttonTextField.style.display = "block";
  } else {
    footerField.style.display = "none";
    buttonTextField.style.display = "none";
  }
}

// ========== AUTO-RESIZE TEXTAREA ==========
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

// Initialize auto-resize for all textareas and add type change listener
document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.addEventListener("input", function () {
      autoResizeTextarea(this);
    });
    // Initial resize in case textarea has content
    autoResizeTextarea(textarea);
  });

  // Add listener for nodeType change
  const nodeTypeSelect = document.getElementById("nodeType");
  if (nodeTypeSelect) {
    nodeTypeSelect.addEventListener("change", updateModalFieldVisibility);
  }
});

// ========== VALIDATOR FUNCTIONS ==========
function validateChatbot(chatbot) {
  const issues = [];

  // Check required fields
  if (!chatbot.name || chatbot.name.trim() === "") {
    issues.push("Nama chatbot belum diisi");
  }

  if (!chatbot.phone || chatbot.phone.trim() === "") {
    issues.push("Nomor HP belum diisi");
  }

  if (!chatbot.description || chatbot.description.trim() === "") {
    issues.push("Keterangan chatbot belum diisi");
  }

  // Check menus
  if (!chatbot.menus || chatbot.menus.length === 0) {
    issues.push("Belum ada menu utama");
  } else {
    // Check each menu
    chatbot.menus.forEach((menu) => {
      if (!menu.description || menu.description.trim() === "") {
        issues.push(`Menu "${menu.name}" belum ada deskripsi`);
      }

      // Validate sub-menus recursively
      validateMenuTree(menu, issues);
    });
  }

  return issues;
}

function validateMenuTree(node, issues) {
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      if (!child.description || child.description.trim() === "") {
        issues.push(`Menu "${child.name}" belum ada deskripsi`);
      }
      validateMenuTree(child, issues);
    });
  }
}

function updateValidator() {
  const validatorContent = document.getElementById("validatorContent");
  const btnDeploy = document.getElementById("btnDeploy");

  if (!currentChatbotId) {
    validatorContent.innerHTML =
      '<p class="validator-empty">Pilih chatbot untuk validasi</p>';
    btnDeploy.disabled = true;
    return;
  }

  const chatbot = findChatbotById(currentChatbotId);
  if (!chatbot) {
    validatorContent.innerHTML =
      '<p class="validator-empty">Chatbot tidak ditemukan</p>';
    btnDeploy.disabled = true;
    return;
  }

  const issues = validateChatbot(chatbot);

  if (issues.length === 0) {
    validatorContent.innerHTML = `
      <div class="validator-item">
        <span class="validator-icon success">✓</span>
        <span class="validator-text">Chatbot siap untuk di-deploy</span>
      </div>
    `;
    btnDeploy.disabled = false;
  } else {
    let html = "";
    issues.forEach((issue) => {
      html += `
        <div class="validator-item">
          <span class="validator-icon error">✗</span>
          <span class="validator-text">${issue}</span>
        </div>
      `;
    });
    validatorContent.innerHTML = html;
    btnDeploy.disabled = true;
  }
}

function deployChatbot() {
  if (!currentChatbotId) {
    alert("Pilih chatbot terlebih dahulu");
    return;
  }

  const chatbot = findChatbotById(currentChatbotId);
  const issues = validateChatbot(chatbot);

  if (issues.length > 0) {
    alert("Chatbot belum bisa di-deploy. Lengkapi data yang diperlukan!");
    return;
  }

  // Mark chatbot as deployed
  chatbot.deployed = true;
  chatbot.deployedAt = new Date().toISOString();

  saveToLocalStorage();

  alert(
    `✅ Chatbot "${chatbot.name}" berhasil di-deploy!\n\nTanggal & Waktu: ${new Date().toLocaleString("id-ID")}`,
  );
  renderChatbotList();
}
