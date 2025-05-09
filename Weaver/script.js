// Import from modules
import { populateTemplates, getTemplateById } from './templates.js';
import { exportPNG, exportSVG, getSvgContent } from './export.js';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: document.body.classList.contains('dark-theme') ? 'dark' : 'default',
  securityLevel: 'loose',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
});

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const helpToggle = document.getElementById('help-toggle');
const closeHelp = document.getElementById('close-help');
const helpPanel = document.getElementById('help-panel');
const templateSelect = document.getElementById('template-select');
const mermaidInput = document.getElementById('mermaid-input');
const generateBtn = document.getElementById('generate-btn');
const mermaidOutput = document.getElementById('mermaid-output');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const exportPngBtn = document.getElementById('export-png');
const exportSvgBtn = document.getElementById('export-svg');

// Initialize the application
function init() {
  // Check for stored theme preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateMermaidTheme('dark');
  }
  
  // Populate the template dropdown
  populateTemplates();
  
  // Set up event listeners
  setupEventListeners();
  
  // Show a default diagram
  const defaultTemplate = getTemplateById('flow1');
  if (defaultTemplate) {
    mermaidInput.value = defaultTemplate.code;
    renderDiagram();
  }
  
  // Apply animations to main containers (removed for brevity)
}

// Set up all event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Help panel toggle
  helpToggle.addEventListener('click', () => {
    helpPanel.classList.add('open');
  });
  
  closeHelp.addEventListener('click', () => {
    helpPanel.classList.remove('open');
  });
  
  // Template selection
  templateSelect.addEventListener('change', (event) => {
    const templateId = event.target.value;
    if (!templateId) return;
    
    const template = getTemplateById(templateId);
    if (template) {
      mermaidInput.value = template.code;
      // Don't auto-render to give the user a chance to modify
    }
  });
  
  // Generate button
  generateBtn.addEventListener('click', renderDiagram);
  
  // Copy button
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(mermaidInput.value)
      .then(() => {
        // Show a notification (could be improved with a toast component)
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
        }, 2000);
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  });
  
  // Clear button
  clearBtn.addEventListener('click', () => {
    mermaidInput.value = '';
    mermaidOutput.innerHTML = '';
  });
  
  // Export buttons
  exportPngBtn.addEventListener('click', () => {
    const svgContent = getSvgContent();
    if (svgContent) {
      exportPNG(svgContent);
    }
  });
  
  exportSvgBtn.addEventListener('click', () => {
    const svgContent = getSvgContent();
    if (svgContent) {
      exportSVG(svgContent);
    }
  });
  
  // Listen for Ctrl+Enter to render
  mermaidInput.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      renderDiagram();
      event.preventDefault();
    }
  });
}

// Toggle between light and dark themes
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateMermaidTheme(isDark ? 'dark' : 'default');
  
  // Re-render the diagram if one exists
  if (mermaidOutput.innerHTML) {
    renderDiagram();
  }
}

// Update Mermaid's theme configuration
function updateMermaidTheme(theme) {
  mermaid.initialize({
    startOnLoad: false, 
    theme: theme,
    securityLevel: 'loose',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  });
}

// Render the Mermaid diagram
async function renderDiagram() {
  const code = mermaidInput.value.trim();
  if (!code) {
    mermaidOutput.innerHTML = '<div class="empty-state">Enter Mermaid syntax and click "Generate Diagram"</div>';
    return;
  }
  
  try {
    // Display loading state
    mermaidOutput.innerHTML = '<div class="loading">Rendering diagram...</div>';
    
    // Add a small delay to allow the loading state to render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Render the diagram
    const { svg } = await mermaid.render('mermaid-diagram', code);
    mermaidOutput.innerHTML = svg;
    
    // Add "Generated successfully" notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = 'Diagram generated successfully!';
    document.body.appendChild(notification);
    
    // Remove notification after a delay
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 2000);
    
  } catch (error) {
    console.error('Error rendering diagram:', error);
    
    // Show error in output
    mermaidOutput.innerHTML = `
      <div class="error-container">
        <h3>Error rendering diagram</h3>
        <pre>${error.message || 'Unknown error'}</pre>
        <p>Check your syntax and try again.</p>
      </div>
    `;
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);