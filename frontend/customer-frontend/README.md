# Jewel Customer Frontend

Customer UI only, separated into individual page and component files. `src/App.jsx` is intentionally small and only connects the customer app. Staff UI and backend are not included or changed.

Keep the supplied images in `src/assets`. Run `npm.cmd install` then `npm.cmd run dev` in this folder.

The current app uses local demo state; it is not yet connected to the project backend/database.


CUSTOMER RETRACTABLE SIDEBAR
- Added src/components/layout/CustomerSidebar.jsx.
- Sidebar navigation is connected to customer page state in CustomerApp.jsx.
- This update only changes the customer frontend; staff files are not modified.
