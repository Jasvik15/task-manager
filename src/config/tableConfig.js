// TABLE CONFIGURATION - Edit only this file to change everything

export const tableConfig = {
  // Column Headers (change these labels as needed)
  headers: {
    slNo: "Sl.No",           // Change to "Start Date" or "ID" etc.
    plant: "Plant",          // Change to "Machine" or "Location" etc.
    description: "Description",
    status: "Status",
    targetDate: "Target Date",  // Change to "End Date" or "Due Date"
    remarks: "End Remarks"
  },
  
  // Which fields to display (reorder or remove fields here) //DO NOT CHANGE THE FIELD NAMES, ONLY THE ORDER OR WHICH FIELDS TO SHOW
  visibleFields: ["slNo", "plant", "description", "status", "targetDate", "remarks"],
  
  // Page Titles - Change these
  titles: {
    dashboard: "SCM Dashboard",
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