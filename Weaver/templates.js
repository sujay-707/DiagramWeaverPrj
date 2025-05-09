/**
 * Templates for Mermaid.js diagrams
 * Each template has an id, name and code
 */
const mermaidTemplates = [
  {
    id: 'flow1',
    name: 'Basic Flowchart',
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`
  },
  {
    id: 'flow2',
    name: 'Complex Flowchart',
    code: `flowchart TB
    Start --> Stop
    Start[Start] --> WantMore{Want more?}
    WantMore -->|Yes| More[More]
    WantMore -->|No| Stop[Stop]
    More --> WantMore`
  },
  {
    id: 'sequence1',
    name: 'Basic Sequence Diagram',
    code: `sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I'm good thanks!
    Alice->>Bob: Great to hear!`
  },
  {
    id: 'sequence2',
    name: 'Complex Sequence Diagram',
    code: `sequenceDiagram
    participant Alice
    participant Bob
    participant Charlie
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I'm good thanks!
    Bob->>Charlie: How about you?
    Charlie-->>Bob: Doing well!`
  },
  {
    id: 'class1',
    name: 'Basic Class Diagram',
    code: `classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound(): void
    }
    class Dog {
      +breed: string
      +bark(): void
    }
    Animal <|-- Dog`
  },
  {
    id: 'class2',
    name: 'Complex Class Diagram',
    code: `classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound(): void
    }
    class Dog {
      +breed: string
      +bark(): void
    }
    class Cat {
      +color: string
      +meow(): void
    }
    class Owner {
      +name: string
      +pets: Animal[]
      +feedPet(): void
    }
    Animal <|-- Dog
    Animal <|-- Cat
    Owner "1" --> "*" Animal : owns`
  },
  {
    id: 'entity1',
    name: 'Basic Entity Relationship',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains`
  },
  {
    id: 'entity2',
    name: 'Complex Entity Relationship',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
      string name
      string email
    }
    ORDER ||--|{ LINE-ITEM : contains
    ORDER {
      int order_id
      date created_at
    }
    LINE-ITEM {
      string product
      int quantity
      float price
    }`
  },
  {
    id: 'gantt1',
    name: 'Basic Gantt Chart',
    code: `gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements gathering :a1, 2023-01-01, 7d
    System design          :a2, after a1, 10d
    section Development
    Implementation         :a3, after a2, 15d
    Testing                :a4, after a3, 7d`
  },
  {
    id: 'state1',
    name: 'State Diagram',
    code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`
  },
  {
    id: 'pie1',
    name: 'Pie Chart',
    code: `pie
    title What kind of diagrams do you use?
    "Flowcharts" : 40
    "Sequence" : 25
    "Gantt" : 10
    "Class" : 15
    "State" : 10`
  }
];

/**
 * Populate the template dropdown with the available templates
 */
function populateTemplates() {
  const templateSelect = document.getElementById('template-select');
  
  mermaidTemplates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.id;
    option.textContent = template.name;
    templateSelect.appendChild(option);
  });
}

/**
 * Get a template by its ID
 * @param {string} id - The template ID
 * @returns {object|null} - The template object or null if not found
 */
function getTemplateById(id) {
  return mermaidTemplates.find(template => template.id === id) || null;
}

// Make functions available to other modules
export { populateTemplates, getTemplateById, mermaidTemplates };