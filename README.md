Art Institute of Chicago - Data Gallery
A high-performance React application built with Vite, TypeScript, and PrimeReact. This project implements server-side pagination and a persistent, virtual row selection system to explore the Art Institute of Chicago's collection.

🚀 Live Demo:-https://growmeorganic-react-assignment-intern.netlify.app/


🛠️ Tech Stack
Framework: React 18 (Vite)

Language: TypeScript (Strict Mode)

UI Components: PrimeReact

Icons: PrimeIcons

Styling: CSS3 / PrimeReact Lara Theme

✨ Key Features
1. Server-Side Pagination
Data is fetched on-demand from the Art Institute of Chicago API.

The table maintains a limit of 12 rows per page to optimize load times and memory usage.

Lazy loading is implemented to ensure only the current page's data exists in the DOM.

2. Persistent Selection Logic
Key-based Tracking: Selected rows are tracked using a unique ID Map (Record<number, boolean>). This ensures that selections persist even when navigating between different pages.

Memory Efficiency: The application stores only the IDs of selected items rather than full objects, preventing memory bloat when selecting large numbers of records.

3. Custom Selection Overlay
Accessed via the chevron icon in the checkbox header.

Virtual Selection Strategy: If a user requests to select "N" rows, the application fetches the minimum required pages to gather those specific IDs.

No Forbidden Loops: The logic avoids infinite while loops and recursive API calls, satisfying the performance constraints defined in the assignment.

4. Smart UI/UX
N/A Handling: Automatically detects empty inscription fields and displays "N/A" for a cleaner data view.

Selection Counter: A real-time counter displays the total number of selected rows across all pages, both in the header and the table footer.

📦 Installation & Setup
Clone the repository:

Bash
git clone
https://github.com/sumitdiwaka/GrowMeOrganic-React-Assignment
cd GrowMeOrganic-React-Assignment
Install dependencies:

Bash
npm install
Run development server:

Bash
npm run dev
Build for production:

Bash
npm run build
📁 Project Structure
Plaintext
src/
├── components/
│   └── ArtTable.tsx    # Core logic, Selection Map, and Table UI
├── types/
│   └── types.ts        # TypeScript Interfaces for API response
├── App.tsx             # Main Layout
└── main.tsx            # Theme and Global Config
