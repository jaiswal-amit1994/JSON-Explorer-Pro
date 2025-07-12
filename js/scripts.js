// DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const jsonViewer = document.getElementById('jsonViewer');
    const searchInput = document.getElementById('searchInput');
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileInfo = document.getElementById('fileInfo');
    const searchResults = document.getElementById('searchResults');
    const selectionInfo = document.getElementById('selectionInfo');
    const notification = document.getElementById('notification');
    const pathDisplay = document.getElementById('pathDisplay');
    const validateBtn = document.getElementById('validateBtn');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const pathCopyBtn = document.getElementById('pathCopyBtn');
    const valueCopyBtn = document.getElementById('valueCopyBtn');
    const statsBtn = document.getElementById('statsBtn');
    const contextMenu = document.getElementById('contextMenu');
    const cmCopyPath = document.getElementById('cmCopyPath');
    const cmCopyValue = document.getElementById('cmCopyValue');
    const cmExpandAll = document.getElementById('cmExpandAll');
    const cmCollapseAll = document.getElementById('cmCollapseAll');
    const sampleModal = document.getElementById('sampleModal');
    const closeSampleModal = document.getElementById('closeSampleModal');
    const sampleItems = document.querySelectorAll('.sample-item');
    const statsModal = document.getElementById('statsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');
    const statsGrid = document.getElementById('statsGrid');
    const validationResults = document.getElementById('validationResults');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Global variables
    let jsonData = null;
    let searchMatches = [];
    let currentMatchIndex = -1;
    let currentPath = '';
    let currentValue = null;
    let fileName = '';

    // Event Listeners
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    searchInput.addEventListener('input', handleSearch);
    expandAllBtn.addEventListener('click', expandAllNodes);
    collapseAllBtn.addEventListener('click', collapseAllNodes);
    copyBtn.addEventListener('click', copyJsonToClipboard);
    downloadBtn.addEventListener('click', downloadJson);
    sampleBtn.addEventListener('click', () => sampleModal.classList.add('show'));
    closeSampleModal.addEventListener('click', () => sampleModal.classList.remove('show'));
    validateBtn.addEventListener('click', validateJson);
    formatBtn.addEventListener('click', formatJson);
    minifyBtn.addEventListener('click', minifyJson);
    pathCopyBtn.addEventListener('click', copyPathToClipboard);
    valueCopyBtn.addEventListener('click', copyValueToClipboard);
    statsBtn.addEventListener('click', showStats);
    closeStatsModal.addEventListener('click', () => statsModal.classList.remove('show'));
    cmCopyPath.addEventListener('click', copyPathToClipboard);
    cmCopyValue.addEventListener('click', copyValueToClipboard);
    cmExpandAll.addEventListener('click', expandSelectedNode);
    cmCollapseAll.addEventListener('click', collapseSelectedNode);
    
    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
      });
    });

    // Sample JSON selection
    sampleItems.forEach(item => {
      item.addEventListener('click', () => {
        loadSampleJson(item.dataset.sample);
        sampleModal.classList.remove('show');
      });
    });

    // Context menu handling
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.json-key') || e.target.closest('.json-tree > li > span:not(.json-key)')) {
        e.preventDefault();
        showContextMenu(e);
      }
    });

    document.addEventListener('click', () => {
      contextMenu.style.display = 'none';
    });

    // Path display click handling
    pathDisplay.addEventListener('click', (e) => {
      if (e.target.classList.contains('path-segment')) {
        const path = e.target.dataset.path;
        navigateToPath(path);
      }
    });

    // Handle File Upload
    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          jsonData = JSON.parse(e.target.result);
          renderJson(jsonData);
          fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
          enableControls();
          showNotification('File loaded successfully!', 'success');
        } catch (error) {
          showError("Invalid JSON file. Please upload a valid JSON.");
          showNotification('Failed to parse JSON!', 'error');
        }
      };
      reader.onerror = () => {
        showError("Error reading file.");
        showNotification('Error reading file!', 'error');
      };
      reader.readAsText(file);
    }

    // Load Sample JSON
    function loadSampleJson(sampleName) {
      let sampleData;
      fileName = `${sampleName}.json`;
      
      switch(sampleName) {
        case 'simpleObject':
          sampleData = {
            "name": "John Doe",
            "age": 30,
            "isActive": true,
            "address": {
              "street": "123 Main St",
              "city": "Anytown"
            }
          };
          break;
        case 'simpleArray':
          sampleData = ["apple", "banana", "cherry", 42, true];
          break;
        case 'nestedObject':
          sampleData = {
            "company": "Tech Corp",
            "employees": [
              {
                "id": 1,
                "name": "Alice",
                "skills": ["JavaScript", "React"]
              },
              {
                "id": 2,
                "name": "Bob",
                "skills": ["Python", "Django"]
              }
            ],
            "locations": {
              "HQ": "New York",
              "offices": ["London", "Tokyo", "Sydney"]
            }
          };
          break;
        case 'mixedTypes':
          sampleData = {
            "string": "Hello World",
            "number": 42,
            "boolean": true,
            "nullValue": null,
            "array": [1, "two", false],
            "object": {
              "nested": "value",
              "url": "https://example.com"
            }
          };
          break;
        case 'largeDataset':
          sampleData = generateLargeDataset();
          break;
        case 'deeplyNested':
          sampleData = generateDeeplyNested();
          break;
        case 'apiResponse':
          sampleData = {
            "status": "success",
            "data": {
              "users": [
                {
                  "id": 1,
                  "name": "John",
                  "email": "john@example.com",
                  "posts": [
                    {
                      "id": 101,
                      "title": "First Post",
                      "comments": [
                        {"id": 1001, "text": "Nice post!"}
                      ]
                    }
                  ]
                }
              ],
              "pagination": {
                "total": 1,
                "page": 1,
                "perPage": 10
              }
            },
            "timestamp": "2023-05-15T12:00:00Z"
          };
          break;
        case 'configFile':
          sampleData = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "appName": "My App",
            "version": "1.0.0",
            "settings": {
              "debug": false,
              "maxConnections": 10,
              "timeout": 30.5
            },
            "features": {
              "authentication": true,
              "logging": {
                "level": "verbose",
                "path": "/var/logs"
              }
            },
            "allowedOrigins": ["https://example.com", "https://test.example.com"]
          };
          break;
        case 'missingQuote':
          sampleData = '{ "name": "John, "age": 30 }';
          break;
        case 'trailingComma':
          sampleData = '{ "name": "John", "age": 30, }';
          break;
        case 'unclosedBracket':
          sampleData = '{ "name": "John", "age": 30';
          break;
        case 'wrongDataType':
          sampleData = '{ "name": "John", "age": "thirty" }';
          break;
        default:
          sampleData = {};
      }

      if (typeof sampleData === 'string') {
        // For invalid JSON samples
        try {
          JSON.parse(sampleData);
        } catch (error) {
          showError("Invalid JSON: " + error.message);
          showNotification('Loaded invalid JSON sample', 'warning');
          jsonViewer.innerHTML = `<div class="empty-state">Invalid JSON: ${error.message}</div>`;
          fileInfo.textContent = `${fileName} (invalid JSON)`;
          return;
        }
      } else {
        try {
          jsonData = sampleData;
          renderJson(jsonData);
          fileInfo.textContent = `${fileName} (sample data)`;
          enableControls();
          showNotification('Sample loaded successfully!', 'success');
        } catch (error) {
          showError("Error loading sample: " + error.message);
          showNotification('Error loading sample!', 'error');
        }
      }
    }

    function generateLargeDataset() {
      const largeData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          count: 1000
        },
        items: []
      };

      for (let i = 1; i <= 1000; i++) {
        largeData.items.push({
          id: i,
          name: `Item ${i}`,
          price: (Math.random() * 100).toFixed(2),
          inStock: Math.random() > 0.5,
          tags: ['tag' + Math.floor(Math.random() * 10), 'tag' + Math.floor(Math.random() * 10)],
          details: {
            weight: Math.floor(Math.random() * 1000),
            dimensions: {
              width: Math.floor(Math.random() * 100),
              height: Math.floor(Math.random() * 100),
              depth: Math.floor(Math.random() * 100)
            }
          }
        });
      }

      return largeData;
    }

    function generateDeeplyNested() {
      return {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  level6: {
                    level7: {
                      level8: {
                        level9: {
                          level10: {
                            value: "You've reached the bottom!"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
    }

    // Render JSON as Tree
    function renderJson(data) {
      jsonViewer.innerHTML = '';
      if (!data) return;

      const ul = document.createElement('ul');
      ul.className = 'json-tree';
      buildTree(data, ul);
      jsonViewer.appendChild(ul);

      // Add click handlers for path selection
      addPathSelectionHandlers();
    }

    // Recursively Build Tree
    function buildTree(data, parentEl, key = null, path = '') {
      if (typeof data === 'object' && data !== null) {
        const isArray = Array.isArray(data);
        const li = document.createElement('li');
        li.dataset.path = path;

        // Expandable icon for objects/arrays
        if (Object.keys(data).length > 0) {
          const expandIcon = document.createElement('span');
          expandIcon.className = 'expand-icon';
          li.appendChild(expandIcon);
          expandIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            li.classList.toggle('expanded');
          });
          if (!key) li.classList.add('expanded'); // Auto-expand root
        }

        // Key (if nested)
        if (key !== null) {
          const keySpan = document.createElement('span');
          keySpan.className = 'json-key';
          keySpan.textContent = key;
          li.appendChild(keySpan);
        }

        // Opening bracket
        const bracketSpan = document.createElement('span');
        bracketSpan.textContent = isArray ? '[' : '{';
        li.appendChild(bracketSpan);

        // Child elements
        const childUl = document.createElement('ul');
        if (isArray) {
          data.forEach((item, i) => {
            const childLi = document.createElement('li');
            buildTree(item, childLi, i, path ? `${path}[${i}]` : `[${i}]`);
            childUl.appendChild(childLi);
          });
        } else {
          Object.keys(data).forEach(k => {
            const childLi = document.createElement('li');
            buildTree(data[k], childLi, k, path ? `${path}.${k}` : k);
            childUl.appendChild(childLi);
          });
        }
        li.appendChild(childUl);

        // Closing bracket
        const closingSpan = document.createElement('span');
        closingSpan.textContent = isArray ? ']' : '}';
        li.appendChild(closingSpan);

        // Type info for objects/arrays
        const typeSpan = document.createElement('span');
        typeSpan.className = 'type-info';
        typeSpan.textContent = isArray ? `array[${data.length}]` : `object`;
        li.appendChild(typeSpan);

        parentEl.appendChild(li);
      } else {
        // Primitive values
        const li = document.createElement('li');
        li.dataset.path = path;

        if (key !== null) {
          const keySpan = document.createElement('span');
          keySpan.className = 'json-key';
          keySpan.textContent = key;
          li.appendChild(keySpan);
        }

        const valueSpan = document.createElement('span');
        if (typeof data === 'string') {
          valueSpan.className = 'json-string';
          // Check if string is a URL
          if (data.match(/^https?:\/\/[^\s]+$/)) {
            valueSpan.className = 'json-url';
            valueSpan.textContent = `"${data}"`;
            valueSpan.title = "Click to open URL";
            valueSpan.addEventListener('click', (e) => {
              e.stopPropagation();
              window.open(data, '_blank');
            });
          } else {
            valueSpan.textContent = `"${data}"`;
          }
        } else if (typeof data === 'number') {
          valueSpan.className = 'json-number';
          valueSpan.textContent = data;
        } else if (typeof data === 'boolean') {
          valueSpan.className = 'json-boolean';
          valueSpan.textContent = data ? 'true' : 'false';
        } else if (data === null) {
          valueSpan.className = 'json-null';
          valueSpan.textContent = 'null';
        }
        li.appendChild(valueSpan);

        // Type info for primitives
        const typeSpan = document.createElement('span');
        typeSpan.className = 'type-info';
        typeSpan.textContent = typeof data;
        li.appendChild(typeSpan);

        parentEl.appendChild(li);
      }
    }

    // Add path selection handlers
    function addPathSelectionHandlers() {
      const items = jsonViewer.querySelectorAll('.json-tree li');
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Remove previous selection
          const prevSelected = jsonViewer.querySelector('.selected');
          if (prevSelected) prevSelected.classList.remove('selected');
          
          // Add selection to clicked item
          item.classList.add('selected');
          
          // Update path display
          currentPath = item.dataset.path;
          currentValue = getValueByPath(jsonData, currentPath);
          updatePathDisplay();
          updateSelectionInfo();
        });
      });
    }

    // Get value by path
    function getValueByPath(obj, path) {
      if (!path) return obj;
      
      // Handle array indices like [0]
      const pathParts = path.split(/\.|\[|\]/).filter(p => p !== '');
      
      let current = obj;
      for (const part of pathParts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
      }
      return current;
    }

    // Update path display
    function updatePathDisplay() {
      if (!currentPath) {
        pathDisplay.textContent = 'No path selected';
        return;
      }
      
      const pathParts = currentPath.split('.');
      let accumulatedPath = '';
      
      pathDisplay.innerHTML = pathParts.map((part, i) => {
        // Handle array indices
        const arrayMatch = part.match(/^(\w+)?\[(\d+)\]$/);
        if (arrayMatch) {
          const prefix = arrayMatch[1] ? `${arrayMatch[1]}[${arrayMatch[2]}]` : `[${arrayMatch[2]}]`;
          accumulatedPath = accumulatedPath ? `${accumulatedPath}.${prefix}` : prefix;
          return `<span class="path-segment" data-path="${accumulatedPath}">${prefix}</span>`;
        }
        
        accumulatedPath = accumulatedPath ? `${accumulatedPath}.${part}` : part;
        return `<span class="path-segment" data-path="${accumulatedPath}">${part}</span>`;
      }).join(' <span style="opacity:0.5">›</span> ');
    }

    // Update selection info
    function updateSelectionInfo() {
      if (!currentPath) {
        selectionInfo.textContent = '';
        return;
      }
      
      let type = typeof currentValue;
      if (currentValue === null) type = 'null';
      else if (Array.isArray(currentValue)) type = 'array';
      else if (typeof currentValue === 'object') type = 'object';
      
      selectionInfo.textContent = `Type: ${type}`;
      
      if (type === 'string' && currentValue.length > 50) {
        selectionInfo.textContent += ` | Length: ${currentValue.length} chars`;
      } else if (type === 'array') {
        selectionInfo.textContent += ` | Length: ${currentValue.length} items`;
      } else if (type === 'object') {
        selectionInfo.textContent += ` | Keys: ${Object.keys(currentValue).length}`;
      }
    }

    // Navigate to path
    function navigateToPath(path) {
      if (!path) return;
      
      const element = jsonViewer.querySelector(`li[data-path="${path}"]`);
      if (element) {
        // Remove previous selection
        const prevSelected = jsonViewer.querySelector('.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
        
        // Add selection
        element.classList.add('selected');
        
        // Update current path and value
        currentPath = path;
        currentValue = getValueByPath(jsonData, currentPath);
        updatePathDisplay();
        updateSelectionInfo();
        
        // Scroll to element and expand parents
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        let parent = element.parentNode;
        while (parent && parent !== jsonViewer) {
          if (parent.classList?.contains('json-tree')) {
            parent.parentNode.classList.add('expanded');
          }
          parent = parent.parentNode;
        }
      }
    }

    // Search Functionality
    function handleSearch(e) {
      const term = e.target.value.trim().toLowerCase();
      if (!term) {
        clearSearch();
        return;
      }

      searchMatches = [];
      currentMatchIndex = -1;

      // Find matches
      const walker = document.createTreeWalker(
        jsonViewer,
        NodeFilter.SHOW_TEXT,
        null
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(term)) {
          const parent = node.parentNode;
          if (parent.nodeType === Node.ELEMENT_NODE) {
            searchMatches.push(parent);
          }
        }
      }

      // Highlight matches
      if (searchMatches.length > 0) {
        searchMatches.forEach(match => {
          const html = match.innerHTML;
          const regex = new RegExp(term, 'gi');
          match.innerHTML = html.replace(regex, '<span class="search-match">$&</span>');
        });
        navigateToMatch(0);
        searchResults.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;
      } else {
        searchResults.textContent = "No matches";
      }
    }

    // Clear Search Highlights
    function clearSearch() {
      searchMatches.forEach(match => {
        match.innerHTML = match.innerHTML.replace(/<span class="search-match">([^<]*)<\/span>/gi, '$1');
      });
      searchMatches = [];
      currentMatchIndex = -1;
      searchResults.textContent = '';
    }

    // Navigate to Search Match
    function navigateToMatch(index) {
      if (searchMatches.length === 0) return;

      if (currentMatchIndex >= 0) {
        searchMatches[currentMatchIndex].classList.remove('current-match');
      }

      currentMatchIndex = index;
      const currentMatch = searchMatches[currentMatchIndex];
      currentMatch.classList.add('current-match');
      currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Auto-expand parents
      let parent = currentMatch.parentNode;
      while (parent && parent !== jsonViewer) {
        if (parent.classList?.contains('json-tree')) {
          parent.parentNode.classList.add('expanded');
        }
        parent = parent.parentNode;
      }

      searchResults.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;
    }

    // Expand/Collapse All
    function expandAllNodes() {
      const nodes = jsonViewer.querySelectorAll('.json-tree > li');
      nodes.forEach(node => node.classList.add('expanded'));
    }

    function collapseAllNodes() {
      const nodes = jsonViewer.querySelectorAll('.json-tree > li');
      nodes.forEach(node => node.classList.remove('expanded'));
    }

    // Expand/Collapse Selected Node
    function expandSelectedNode() {
      if (!currentPath) return;
      const element = jsonViewer.querySelector(`li[data-path="${currentPath}"]`);
      if (element) {
        element.classList.add('expanded');
      }
    }

    function collapseSelectedNode() {
      if (!currentPath) return;
      const element = jsonViewer.querySelector(`li[data-path="${currentPath}"]`);
      if (element) {
        element.classList.remove('expanded');
      }
    }

    // Copy JSON to Clipboard
    function copyJsonToClipboard() {
      if (!jsonData) return;
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
        .then(() => showNotification('Copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy', 'error'));
    }

    // Download JSON
    function downloadJson() {
      if (!jsonData) return;
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Copy Path to Clipboard
    function copyPathToClipboard() {
      if (!currentPath) return;
      navigator.clipboard.writeText(currentPath)
        .then(() => showNotification('Path copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy path', 'error'));
    }

    // Copy Value to Clipboard
    function copyValueToClipboard() {
      if (currentValue === undefined || currentValue === null) return;
      navigator.clipboard.writeText(JSON.stringify(currentValue))
        .then(() => showNotification('Value copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy value', 'error'));
    }

    // Validate JSON
    function validateJson() {
      try {
        JSON.stringify(jsonData);
        showNotification('JSON is valid!', 'success');
        return true;
      } catch (error) {
        showNotification('Invalid JSON: ' + error.message, 'error');
        return false;
      }
    }

    // Format JSON
    function formatJson() {
      if (!jsonData) return;
      try {
        jsonData = JSON.parse(JSON.stringify(jsonData, null, 2));
        renderJson(jsonData);
        showNotification('JSON formatted!', 'success');
      } catch (error) {
        showNotification('Error formatting JSON: ' + error.message, 'error');
      }
    }

    // Minify JSON
    function minifyJson() {
      if (!jsonData) return;
      try {
        jsonData = JSON.parse(JSON.stringify(jsonData));
        renderJson(jsonData);
        showNotification('JSON minified!', 'success');
      } catch (error) {
        showNotification('Error minifying JSON: ' + error.message, 'error');
      }
    }

    // Show Statistics
    function showStats() {
      if (!jsonData) return;
      
      const stats = calculateStats(jsonData);
      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-title">Total Size</div>
          <div class="stat-value json-size">${formatFileSize(JSON.stringify(jsonData).length)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Total Keys</div>
          <div class="stat-value key-count">${stats.totalKeys}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Objects</div>
          <div class="stat-value object-count">${stats.objects}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Arrays</div>
          <div class="stat-value array-count">${stats.arrays}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Strings</div>
          <div class="stat-value string-count">${stats.strings}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Numbers</div>
          <div class="stat-value number-count">${stats.numbers}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Booleans</div>
          <div class="stat-value boolean-count">${stats.booleans}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Nulls</div>
          <div class="stat-value null-count">${stats.nulls}</div>
        </div>
      `;
      
      // Validation results
      validationResults.innerHTML = `
        <div class="validation-item">
          <div class="validation-icon success">✓</div>
          <div>JSON is valid</div>
        </div>
        <div class="validation-item">
          <div class="validation-icon ${stats.maxDepth > 5 ? 'warning' : 'success'}">${stats.maxDepth > 5 ? '!' : '✓'}</div>
          <div>Max depth: ${stats.maxDepth} ${stats.maxDepth > 5 ? '(deep nesting)' : ''}</div>
        </div>
        <div class="validation-item">
          <div class="validation-icon ${stats.longestString > 1000 ? 'warning' : 'success'}">${stats.longestString > 1000 ? '!' : '✓'}</div>
          <div>Longest string: ${stats.longestString} chars</div>
        </div>
      `;
      
      statsModal.classList.add('show');
    }

    function calculateStats(data) {
      const stats = {
        totalKeys: 0,
        objects: 0,
        arrays: 0,
        strings: 0,
        numbers: 0,
        booleans: 0,
        nulls: 0,
        maxDepth: 0,
        longestString: 0
      };
      
      function traverse(obj, depth = 0) {
        stats.maxDepth = Math.max(stats.maxDepth, depth);
        
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            stats.arrays++;
            obj.forEach(item => traverse(item, depth + 1));
          } else {
            stats.objects++;
            Object.keys(obj).forEach(key => {
              stats.totalKeys++;
              traverse(obj[key], depth + 1);
            });
          }
        } else {
          if (typeof obj === 'string') {
            stats.strings++;
            stats.longestString = Math.max(stats.longestString, obj.length);
          } else if (typeof obj === 'number') {
            stats.numbers++;
          } else if (typeof obj === 'boolean') {
            stats.booleans++;
          } else if (obj === null) {
            stats.nulls++;
          }
        }
      }
      
      traverse(data);
      return stats;
    }

    // Show Context Menu
    function showContextMenu(e) {
      // Get clicked element's path
      const li = e.target.closest('li');
      if (!li) return;
      
      currentPath = li.dataset.path;
      currentValue = getValueByPath(jsonData, currentPath);
      updatePathDisplay();
      updateSelectionInfo();
      
      // Position context menu
      contextMenu.style.display = 'block';
      contextMenu.style.left = `${e.pageX}px`;
      contextMenu.style.top = `${e.pageY}px`;
      
      // Disable expand/collapse if not an object/array
      const isObject = typeof currentValue === 'object' && currentValue !== null;
      cmExpandAll.disabled = !isObject;
      cmCollapseAll.disabled = !isObject;
    }

    // Helper Functions
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function enableControls() {
      searchInput.disabled = false;
      expandAllBtn.disabled = false;
      collapseAllBtn.disabled = false;
      copyBtn.disabled = false;
      downloadBtn.disabled = false;
      validateBtn.disabled = false;
      formatBtn.disabled = false;
      minifyBtn.disabled = false;
      pathCopyBtn.disabled = false;
      valueCopyBtn.disabled = false;
      statsBtn.disabled = false;
    }

    function showNotification(message, type = '') {
      notification.textContent = message;
      notification.className = 'notification';
      if (type) notification.classList.add(type);
      notification.classList.add('show');
      setTimeout(() => notification.classList.remove('show'), 2000);
    }

    function showError(message) {
      jsonViewer.innerHTML = `<div class="empty-state">${message}</div>`;
    }

    // Keyboard Navigation (Enter/Arrow Keys)
    document.addEventListener('keydown', (e) => {
      if (searchMatches.length > 0) {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
          e.preventDefault();
          navigateToMatch((currentMatchIndex + 1) % searchMatches.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          navigateToMatch((currentMatchIndex - 1 + searchMatches.length) % searchMatches.length);
        }
      }
      
      // Copy path/value shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' && currentPath) {
          e.preventDefault();
          if (e.shiftKey) {
            copyPathToClipboard();
          } else {
            copyValueToClipboard();
          }
        }
      }
    });