# Task Management App

## Overview
This is an example project demonstrating multi-tenant task management with **Role-Based Access Control (RBAC)** and **Relationship-Based Access Control (ReBAC)**. Users can:
- Sign in with Google authentication
- Create and manage organizations
- Add and manage members
- Assign and manage tasks with different permission levels

## Features
- **Multi-Tenancy**: Users can belong to multiple organizations, each with its own tasks and members.
- **Google Authentication**: Secure login via Firebase Authentication.
- **Real-Time Updates**: Changes to tasks, organizations, and memberships sync instantly via Firestore.
- **Access Control**:
  - **Org Owners (Admins)** have full control over tasks created within the organization.
  - **Task Creators** have full control over the tasks they create.
  - **Task Assignees** can view and update their assigned tasks.
  - **Org Members** have read-only access to tasks in their organization.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/miracleonyenma/tasks-app.git
   ```
2. Install dependencies:
   ```sh
   cd tasks-app
   npm install
   ```
3. Set up Firebase:
   - Create a `.env.local` file and add your Firebase credentials:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```
4. Run the development server:
   ```sh
   npm run dev
   ```

## Key Utilities
### Task Status Formatting
Located in `./utils/task/index.ts`:
- [`formatStatus`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/task/index.ts#L2): Converts task status codes into user-friendly display text (e.g., "todo" → "To Do").

### Firebase User Management
Located in `./utils/firebase/user/`:
- [`createUser`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/user/createUser.ts#L13): Creates a new user record in Firestore after authentication.
- [`getUserByEmail`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/user/getUserByEmail.ts#L9): Retrieves user information using their email address.

### Organization Management
Located in `./utils/firebase/org/`:
- [`createOrg`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/org/createOrg.ts#L10): Creates a new organization in Firestore.
- [`getUserOrgsRealtime`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/org/getUserOrgs.ts#L19): Sets up real-time listeners for organizations a user belongs to.
- [`getOrgRealtime`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/org/getUserOrgs.ts#L136): Provides real-time updates for a specific organization.
- [`getOrgMembersRealtime`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/org/getOrgMembers.ts#L25): Provides real-time updates for organization membership.

### Task Management
Located in `./utils/firebase/task/`:
- [`createTask`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/task/createTask.ts#L12): Creates a new task in Firestore.
- [`updateTask`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/task/updateTask.ts#L12): Updates an existing task's details.
- [`getUserOrgTasksRealtime`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/task/getUserOrgTasksRealtime.ts#L15): Provides real-time updates for tasks associated with a user in a specific organization.

### Membership Management
Located in `./utils/firebase/member/`:
- [`createMember`](https://github.com/miracleonyenma/tasks-app/blob/main/utils/firebase/member/createMember.ts#L12): Creates a new membership record linking a user to an organization.

## Key Components
### Site Components
- [`./components/Site/Header.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Site/Header.tsx): The main navigation header that handles authentication and sign-in/sign-out functionality.

### Organization Components
- [`./components/Org/List.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Org/List.tsx): Displays a grid of organizations the user belongs to with real-time updates.
- [`./components/Org/Card.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Org/Card.tsx): Individual organization card showing details and actions.
- [`./components/Org/Form.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Org/Form.tsx): Form for creating new organizations with validation.

### Task Components
- [`./components/Task/List.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Task/List.tsx): Displays tasks for a specific organization with real-time updates.
- [`./components/Task/Item.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Task/Item.tsx): Individual task card showing details and actions.
- [`./components/Task/Form.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Task/Form.tsx): Form for creating and editing tasks with validation.

### Member Components
- [`./components/Member/Form.tsx`](https://github.com/miracleonyenma/tasks-app/blob/main/components/Member/Form.tsx): Form for adding new members to an organization.

## What is Relationship-Based Access Control (ReBAC)?
ReBAC is an advanced access control model that assigns permissions based on **relationships** rather than static roles. This is essential for:
- **Multi-Tenant Organizations**: Ensuring that only members of an organization can interact with its tasks.
- **Granular Permissions**: Allowing dynamic permission assignment, such as organization owners having admin rights over all tasks created within their organization.

## Why ReBAC in This App?
While RBAC ensures role-based access (e.g., "admin," "member"), ReBAC enables **contextual permissions**. For example:
- Org **owners** are automatically admins for tasks created within their organization.
- Org **members** have read-only access to tasks within their organization without needing explicit assignment.

## License
This project is open-source and available under the [MIT License](LICENSE).

