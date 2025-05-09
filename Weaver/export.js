/**
 * Functions for exporting diagrams as PNG or SVG
 */

/**
 * Convert the rendered SVG to a PNG and download it
 * @param {string} svgText - The SVG content as text
 * @param {string} filename - The filename for the download
 */
function exportPNG(svgText, filename = 'diagram.png') {
  // Create temporary SVG element to get dimensions
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = svgText;
  const svgElement = tempDiv.querySelector('svg');
  
  if (!svgElement) {
    console.error('No SVG element found in the provided content');
    return;
  }

  // Get the SVG dimensions
  const width = svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width;
  const height = svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height;

  // Set explicit dimensions if they're missing
  if (!svgElement.getAttribute('width')) {
    svgElement.setAttribute('width', width);
  }
  if (!svgElement.getAttribute('height')) {
    svgElement.setAttribute('height', height);
  }

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set canvas dimensions (with higher resolution)
  const scale = 2; // For better quality
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  
  // Create a new SVG image
  const img = new Image();
  
  // Convert SVG to a data URL
  const svgBlob = new Blob([tempDiv.innerHTML], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  
  // Set up image load event to draw and export
  img.onload = function() {
    // Draw image to canvas
    context.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    
    // Convert canvas to PNG and trigger download
    try {
      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = canvas.toDataURL('image/png');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Error exporting PNG:', err);
      alert('Error exporting PNG. Check console for details.');
    }
  };
  
  // Handle image load error
  img.onerror = function(err) {
    URL.revokeObjectURL(url);
    console.error('Error loading SVG:', err);
    alert('Error loading SVG for export. Please try again.');
  };
  
  // Start loading the image with the SVG
  img.src = url;
}

/**
 * Export the SVG directly as a file for download
 * @param {string} svgText - The SVG content as text
 * @param {string} filename - The filename for the download
 */
function exportSVG(svgText, filename = 'diagram.svg') {
  // Create a blob with the SVG content
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  
  // Trigger download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Get the SVG content from the output container
 * @returns {string|null} - The SVG content as text or null if not found
 */
function getSvgContent() {
  const outputContainer = document.getElementById('mermaid-output');
  const svgElement = outputContainer.querySelector('svg');
  
  if (!svgElement) {
    alert('No diagram to export. Please generate a diagram first.');
    return null;
  }
  
  // Clone the SVG to avoid modifying the displayed one
  const svgClone = svgElement.cloneNode(true);
  
  // Make sure the SVG has the correct namespace
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  
  // Get the computed dimensions if not explicitly set
  const bbox = svgElement.getBBox();
  const computedStyle = window.getComputedStyle(svgElement);
  const width = svgElement.getAttribute('width') || computedStyle.width || bbox.width;
  const height = svgElement.getAttribute('height') || computedStyle.height || bbox.height;
  
  // Set explicit dimensions
  svgClone.setAttribute('width', width);
  svgClone.setAttribute('height', height);
  
  // Convert the SVG element to a string
  return new XMLSerializer().serializeToString(svgClone);
}

// Make functions available to other modules
export { exportPNG, exportSVG, getSvgContent };