// ===== Navigation =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        // Close mobile menu
        navMenu.classList.remove('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
});

// ===== Family Tree =====
let treeZoom = 1;
let treePanX = 0;
let treePanY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

function renderFamilyTree() {
    const treeNodes = document.getElementById('tree-nodes');
    const treeSvg = document.getElementById('tree-svg');
    if (!treeNodes || !treeSvg) return;

    treeNodes.innerHTML = '';
    
    // Clear SVG
    treeSvg.innerHTML = '';

    // Group persons by generation
    const generations = {};
    familyData.persons.forEach(person => {
        if (!generations[person.generation]) {
            generations[person.generation] = [];
        }
        generations[person.generation].push(person);
    });

    const nodeWidth = 180;
    const nodeHeight = 200;
    const horizontalSpacing = 250;
    const verticalSpacing = 300;

    // Calculate positions - group spouses together
    const positions = {};
    Object.keys(generations).sort((a, b) => a - b).forEach((gen, genIndex) => {
        const personsInGen = generations[gen];
        
        // Group spouses together
        const arranged = [];
        const processed = new Set();
        
        personsInGen.forEach(person => {
            if (processed.has(person.id)) return;
            
            arranged.push(person);
            processed.add(person.id);
            
            // Add spouse if exists
            if (person.spouse) {
                const spouse = getPersonById(person.spouse);
                if (spouse && !processed.has(spouse.id) && spouse.generation === person.generation) {
                    arranged.push(spouse);
                    processed.add(spouse.id);
                }
            }
        });
        
        // Add remaining persons
        personsInGen.forEach(person => {
            if (!processed.has(person.id)) {
                arranged.push(person);
            }
        });
        
        const startX = (window.innerWidth - (arranged.length - 1) * horizontalSpacing) / 2;
        
        arranged.forEach((person, index) => {
            positions[person.id] = {
                x: startX + index * horizontalSpacing,
                y: 100 + genIndex * verticalSpacing
            };
        });
    });

    // Set SVG viewBox and size to match the tree area
    const positionValues = Object.values(positions);
    if (positionValues.length > 0) {
        const maxX = Math.max(...positionValues.map(p => p.x + nodeWidth));
        const maxY = Math.max(...positionValues.map(p => p.y + nodeHeight));
        treeSvg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);
        treeSvg.setAttribute('width', maxX);
        treeSvg.setAttribute('height', maxY);
    }
    
    // Apply transform to SVG to match nodes
    treeSvg.style.transform = `scale(${treeZoom}) translate(${treePanX}px, ${treePanY}px)`;
    treeSvg.style.transformOrigin = '0 0';

    // Draw connections (lines between parents and children)
    familyData.persons.forEach(person => {
        if (person.parents && person.parents.length > 0) {
            const parent1 = getPersonById(person.parents[0]);
            const parent2 = person.parents[1] ? getPersonById(person.parents[1]) : null;
            
            if (parent1 && positions[parent1.id] && positions[person.id]) {
                const p1 = positions[parent1.id];
                const p2 = positions[person.id];
                
                // Calculate midpoint between parents if both exist
                let midX = p1.x;
                if (parent2 && positions[parent2.id]) {
                    midX = (p1.x + positions[parent2.id].x) / 2;
                }
                
                // Calculate connection points
                const cardCenterY = nodeHeight / 2;
                const fromY = p1.y + cardCenterY;
                const toY = p2.y;
                
                // Draw vertical line from parent(s) down
                const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line1.setAttribute('x1', midX);
                line1.setAttribute('y1', fromY);
                line1.setAttribute('x2', midX);
                line1.setAttribute('y2', fromY + (verticalSpacing - nodeHeight) / 2);
                line1.setAttribute('stroke', '#6b2c3e');
                line1.setAttribute('stroke-width', '2');
                treeSvg.appendChild(line1);
                
                // Draw horizontal line
                const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line2.setAttribute('x1', midX);
                line2.setAttribute('y1', fromY + (verticalSpacing - nodeHeight) / 2);
                line2.setAttribute('x2', p2.x);
                line2.setAttribute('y2', fromY + (verticalSpacing - nodeHeight) / 2);
                line2.setAttribute('stroke', '#6b2c3e');
                line2.setAttribute('stroke-width', '2');
                treeSvg.appendChild(line2);
                
                // Draw vertical line to child
                const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line3.setAttribute('x1', p2.x);
                line3.setAttribute('y1', fromY + (verticalSpacing - nodeHeight) / 2);
                line3.setAttribute('x2', p2.x);
                line3.setAttribute('y2', toY);
                line3.setAttribute('stroke', '#6b2c3e');
                line3.setAttribute('stroke-width', '2');
                treeSvg.appendChild(line3);
            }
        }
    });

    // Draw marriage lines (horizontal lines between spouses)
    familyData.persons.forEach(person => {
        if (person.spouse) {
            const spouse = getPersonById(person.spouse);
            if (spouse && positions[person.id] && positions[spouse.id]) {
                const p1 = positions[person.id];
                const p2 = positions[spouse.id];
                
                // Only draw if they're in the same generation
                if (person.generation === spouse.generation) {
                    const midY = p1.y + nodeHeight / 2;
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', p1.x);
                    line.setAttribute('y1', midY);
                    line.setAttribute('x2', p2.x);
                    line.setAttribute('y2', midY);
                    line.setAttribute('stroke', '#6b2c3e');
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5,5');
                    treeSvg.appendChild(line);
                }
            }
        }
    });

    // Draw nodes
    familyData.persons.forEach(person => {
        if (positions[person.id]) {
            const pos = positions[person.id];
            const node = document.createElement('div');
            node.className = 'tree-node';
            node.style.left = `${pos.x}px`;
            node.style.top = `${pos.y}px`;
            node.style.transform = `scale(${treeZoom}) translate(${treePanX}px, ${treePanY}px)`;
            node.style.transformOrigin = '0 0';
            
            node.innerHTML = `
                <div class="node-card">
                    <div class="node-photo">${person.name.charAt(0)}</div>
                    <div class="node-name">${person.name}</div>
                    <div class="node-years">${person.years}</div>
                </div>
            `;
            
            node.addEventListener('click', () => openPersonModal(person.id));
            treeNodes.appendChild(node);
        }
    });
}

// Tree controls
document.getElementById('zoom-in')?.addEventListener('click', () => {
    treeZoom = Math.min(treeZoom + 0.1, 2);
    updateTreeTransform();
});

document.getElementById('zoom-out')?.addEventListener('click', () => {
    treeZoom = Math.max(treeZoom - 0.1, 0.5);
    updateTreeTransform();
});

document.getElementById('reset-view')?.addEventListener('click', () => {
    treeZoom = 1;
    treePanX = 0;
    treePanY = 0;
    updateTreeTransform();
});

function updateTreeTransform() {
    const treeSvg = document.getElementById('tree-svg');
    const nodes = document.querySelectorAll('.tree-node');
    
    // Update SVG transform
    if (treeSvg) {
        treeSvg.style.transform = `scale(${treeZoom}) translate(${treePanX}px, ${treePanY}px)`;
        treeSvg.style.transformOrigin = '0 0';
    }
    
    // Update nodes transform
    nodes.forEach(node => {
        node.style.transform = `scale(${treeZoom}) translate(${treePanX}px, ${treePanY}px)`;
        node.style.transformOrigin = '0 0';
    });
}

// Tree panning
const treeWrapper = document.querySelector('.tree-wrapper');
if (treeWrapper) {
    treeWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStart.x = e.clientX - treePanX;
        dragStart.y = e.clientY - treePanY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            treePanX = e.clientX - dragStart.x;
            treePanY = e.clientY - dragStart.y;
            updateTreeTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// ===== Timeline =====
function renderTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    timeline.innerHTML = '';
    
    familyData.momTimeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-description">${item.description}</div>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });
}

// ===== Archive =====
function renderArchive() {
    const archiveGrid = document.getElementById('archive-grid');
    if (!archiveGrid) return;

    archiveGrid.innerHTML = '';
    
    familyData.events.forEach(event => {
        const archiveItem = document.createElement('div');
        archiveItem.className = 'archive-item';
        archiveItem.dataset.category = event.category;
        archiveItem.innerHTML = `
            <div class="archive-image">Фото события</div>
            <div class="archive-info">
                <div class="archive-title">${event.title}</div>
                <div class="archive-date">${event.date}</div>
                <div class="archive-description">${event.description}</div>
            </div>
        `;
        archiveGrid.appendChild(archiveItem);
    });
}

// Archive filters
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const items = document.querySelectorAll('.archive-item');
        
        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ===== Person Modal =====
function openPersonModal(personId) {
    const person = getPersonById(personId);
    if (!person) return;

    const modal = document.getElementById('person-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="person-header">
            <div class="person-photo-large">${person.name.charAt(0)}</div>
            <div class="person-name handwritten">${person.name}</div>
            <div class="person-years">${person.years}</div>
            <div class="person-relation">${person.relation}</div>
        </div>
        <div class="person-bio">
            ${person.bio}
        </div>
        ${person.photos && person.photos.length > 0 ? `
            <div class="person-gallery">
                <div class="gallery-title">Галерея</div>
                <div class="gallery-grid">
                    ${person.photos.map((photo, index) => `
                        <div class="gallery-item" onclick="openLightbox(${personId}, ${index})">
                            <div class="gallery-image" style="background: var(--color-sepia); display: flex; align-items: center; justify-content: center; color: var(--color-text-light);">Фото ${index + 1}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

// Close modal
document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('person-modal').classList.remove('active');
});

document.getElementById('person-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'person-modal') {
        document.getElementById('person-modal').classList.remove('active');
    }
});

// ===== Lightbox =====
function openLightbox(personId, photoIndex) {
    const person = getPersonById(personId);
    if (!person || !person.photos || !person.photos[photoIndex]) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImage.src = person.photos[photoIndex].url || '';
    lightboxCaption.textContent = person.photos[photoIndex].caption || person.name;
    lightbox.classList.add('active');
}

// Close lightbox
document.querySelector('.lightbox-close')?.addEventListener('click', () => {
    document.getElementById('lightbox').classList.remove('active');
});

document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        document.getElementById('lightbox').classList.remove('active');
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderFamilyTree();
    renderTimeline();
    renderArchive();
    
    // Make tree responsive
    window.addEventListener('resize', () => {
        renderFamilyTree();
    });
});

// Expose functions globally for inline event handlers
window.openPersonModal = openPersonModal;
window.openLightbox = openLightbox;

