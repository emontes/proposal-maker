# Proposal Generator Application

This project is a web application built with Next.js and TailwindCSS to generate personalized proposals and prompts for Upwork using AI. It allows users to input job descriptions, select profiles, and generate tailored proposals or prompts.

## Features

- **Generate Proposals**: Create personalized proposals for job applications.
- **Generate Prompts**: Get prompts used to generate proposals.
- **Copy & Download**: Copy proposals to the clipboard or download them as `.txt` files.
- **Dynamic Forms**: Users can select profiles and templates dynamically.
- **Clear Inputs**: Easily reset selections and outputs (except the job description) to start fresh.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Components**: Radix UI & Lucide React
- **State Management**: React Hooks
- **Validation**: React Hook Form with Zod
- **Backend**: OpenAI API for generating proposals and prompts.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following environment variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs linting checks on the codebase.

## Project Structure

- `pages/`: Contains Next.js pages.
- `components/`: Reusable UI components.
- `data/`: JSON files for templates and profiles.
- `hooks/`: Custom React hooks.
- `styles/`: Global styles.
- `public/`: Static assets like images.

## Dependencies

- **Core**:
  - `next`, `react`, `react-dom`, `tailwindcss`
- **UI Libraries**:
  - `@radix-ui/react-*`: Radix UI components
  - `lucide-react`: Icons
- **State & Form Management**:
  - `react-hook-form`
  - `zod` (schema validation)
- **Utilities**:
  - `clsx`, `tailwind-merge`
- **API Integration**:
  - `openai`

## How to Use

1. **Select a Profile**:
   - Choose from the dropdown to select an Upwork profile.
2. **Enter Job Description**:
   - Paste the job description in the textarea provided.
3. **Select a Template**:
   - Pick a template from the dropdown (default is the first template).
4. **Generate Output**:
   - Click **"Generate Proposal"** or **"Generate Prompt"**.
   - The buttons will be disabled after generating to prevent duplicate actions.
5. **Copy or Download**:
   - Use the **Copy** or **Download** buttons to save the results.
6. **Clear Data**:
   - Reset all selections and outputs (except the job description) using the **Clear** button.

## Future Enhancements

- Add authentication for users to save profiles and templates.
- Expand template customization options.
- Improve UI/UX with animations and transitions.

## License

This project is licensed under the [MIT License](LICENSE).
