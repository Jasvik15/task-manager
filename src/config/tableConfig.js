// TABLE CONFIGURATION - Edit only this file to change everything

export const tableConfig = {
  // Column Headers (change these labels as needed)
  headers: {
    slNo: "Sl.No",           // Change to "Start Date" or "ID" etc.
    plant: "Machine",          // Change to "Machine" or "Location" etc.
    description: "Description",
    status: "Status",
    targetDate: "Target Date",  // Change to "End Date" or "Due Date"
    remarks: "Remarks"
  },
  
  // Which fields to display (reorder or remove fields here)
  visibleFields: ["slNo", "plant", "description", "status", "targetDate", "remarks"],
  
  // Page Titles - Change these
  titles: {
    dashboard: "SCM Task Dashboard",
    dashboardSub: "Pending activities",
    admin: "Admin Dashboard"
  },
  
  // Button texts - ADD THIS SECTION (it was missing)
  buttons: {
    adminPanel: "Admin Panel",
    addTask: "Add New Task",
    viewDashboard: "View Dashboard",
    logout: "Logout"
  }
};