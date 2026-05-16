# Diabetes Log PWA

A mobile-only Progressive Web App (PWA) designed for individuals with diabetes to easily log their blood glucose levels and insulin doses. This application prioritizes a clean, accessible, and touch-friendly user interface, optimized exclusively for mobile devices.

## Features

*   **Mobile-First Responsive Design:** Optimized for screens with a maximum width of 480px, ensuring a seamless experience on smartphones.
*   **Intuitive UI:** Large, touch-friendly input fields for easy data entry.
*   **Blood Glucose Logging:** Record blood glucose levels in mmol/L.
*   **Insulin Dose Logging:** Record insulin doses in units.
*   **Data Validation:** Ensures blood glucose is a positive number and insulin dose is zero or greater.
*   **Entry History:** Displays a chronological list of all saved entries, including date, time, blood glucose, and insulin dose.
*   **Delete Entries:** Ability to remove individual log entries from the history.
*   **Progressive Web App (PWA):** Installable on mobile devices for quick access, with potential for offline capabilities (can be enabled by modifying `serviceWorkerRegistration.js`).

## Technology Stack

*   **Frontend:** React (for building the user interface).
*   **Backend/Database:** Supabase (for database storage, authentication, and real-time capabilities).
*   **Version Control & Deployment:** GitHub & GitHub Pages.

## Supabase Setup Instructions

Supabase will serve as the backend for storing your diabetes logs.

### 1. Create a Supabase Project

1.  Go to [Supabase](https://app.supabase.io/) and sign in or create an account.
2.  Click "New project".
3.  Choose an organization, give your project a name (e.g., `diabetes-logger`), set a strong database password, and choose your preferred region.
4.  Click "Create new project".

### 2. Create the `diabetes_logs` Table

Once your project is ready:

1.  Navigate to the "Table editor" in the Supabase dashboard (usually on the left sidebar).
2.  Click "New table".
3.  Use the following SQL schema to create your table. You can paste this directly into the SQL Editor (SQL icon on the left sidebar) and run it, or fill out the form manually.

    ```sql
    CREATE TABLE diabetes_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      blood_glucose_mmol NUMERIC NOT NULL,
      insulin_units NUMERIC NOT NULL
    );

    ALTER TABLE diabetes_logs ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Enable read access for all users" ON diabetes_logs FOR
    SELECT
      USING (TRUE);

    CREATE POLICY "Enable insert for authenticated users only" ON diabetes_logs FOR
    INSERT
      WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "Enable delete for authenticated users only" ON diabetes_logs FOR
    DELETE
      USING (auth.uid() IS NOT NULL); -- Assuming user will own their logs
    ```
4.  After creating the table, ensure Row Level Security (RLS) policies are in place as shown in the SQL above. These policies allow all users to read logs and authenticated users to insert and delete their own logs. For a simple app like this, a basic `auth.uid() IS NOT NULL` check for deletion is sufficient, but in a production app, you might want to link logs to specific user IDs for stronger ownership.

### 3. Get Supabase Credentials

1.  In your Supabase project dashboard, go to "Project Settings" (gear icon) -> "API".
2.  You will find your `Project URL` and `anon public` key. Copy these values.

## Local Development Steps

To run this application on your local machine:

### 1. Clone the Repository (or create project structure)

If you haven't already, create a project folder named `pwa-diabetes-logger` and place all the provided files inside it, maintaining the `public`, `src/components` and `src` directory structure.

### 2. Install Dependencies

Navigate into the `pwa-diabetes-logger` directory in your terminal and install the necessary Node.js packages:

```bash
cd pwa-diabetes-logger
npm install
# or
yarn install