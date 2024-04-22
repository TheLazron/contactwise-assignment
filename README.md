---
[![Netlify Status](https://api.netlify.com/api/v1/badges/fcca311c-3c31-4396-9b8e-1eac6b5365c6/deploy-status)](https://app.netlify.com/sites/landscp/deploys)
---

# Landscape
![image](https://github.com/TheLazron/contactwise-assignment/assets/72215253/ead834d6-7213-402a-8544-a5328a2ee600)


## Abstract

Landscape allows users to create organizations and manage users within them, while also enabling participation in other organizations. With featured roles and a permission management system, user management becomes effortless.

Landscape features three primary roles:

- **Admin**: Upon creating an organization, the creator becomes the sole admin, with full control over the organization and its members.
- **Manager**
- **User**

People can join organizations using a unique organization ID. Elevating a user's position within the organization is as simple as assigning them a higher role, and additional permissions can be granted, providing granular control over their actions.

Landscape boasts a modern and minimalistic UI, ensuring a smooth user experience.

> [Link to a journal](https://docs.google.com/document/d/1T78I1NM7Wtqmmh5Om7d4kXmUrdF8lw7QUdZCYBN6n5g/edit?usp=sharing) detailing my approach and choices made during the implementation of features or decisions.

## Setup Instructions

```bash
git clone https://github.com/TheLazron/contactwise-assignment.git
cd contactwise-assignment
yarn
yarn dev
```

**Environment Variables:**

```plaintext
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NODEMAILER_GMAIL_PASS
```

The `.env` file required for setup has been provided with the project submission.

## Features

## Features

### Authentication

- **Google OAuth Provider:** Users can onboard using their Google credentials via OAuth provider, or they can use their own credentials managed by NextAuth.
- **Email Verification:** When registering with their own credentials, users must verify their emails to maintain account integrity.
- **Forgot and Reset Password:** Seamless functionality for resetting passwords, ensuring users can change their passwords without hassle.

### Organization Management

- **Create and Join Organizations:** Users can create and join organizations for various purposes, automatically assuming roles and permissions based on their choices.
- **Roles:** Three main roles are featured, each with predefined permissions. Members automatically assume permissions based on their roles.
  - **Admin:** Admins have ultimate power within an organization. They can edit or delete the organization, remove members, modify roles, and control permissions at a granular level.
  - **Managers:** Managers have the capability to edit organization details.
  - **Users:** Users exist within the organization and may have specific permissions granted by the admin.

![image](https://github.com/TheLazron/contactwise-assignment/assets/72215253/2526f99d-9284-4547-b9c8-784262b7d158)
![image](https://github.com/TheLazron/contactwise-assignment/assets/72215253/3b844905-2dbb-4e0a-923b-a9c9792dadac)



## Tech Stack

Landscape leverages Next.js capabilities for enhanced performance and utilizes various rendering and data fetching techniques across the application.

- **NextAuth**: Authentication management powered by NextAuth v4, offering flexibility with Google provider and credentials.
- **tRPC**: Ensuring end-to-end type safety and leveraging TypeScript's capabilities to the fullest, all API routes are typesafe thanks to tRPC.
- **Prisma**: Typesafe API for interacting with the database.
- **Tailwind CSS**: Building pages using Tailwind CSS for streamlined styling.
- **Daisy UI**: Components are designed using a combination of Tailwind and Daisy UI.
- **Shadcn**: Implemented certain components for enhanced user experience.
