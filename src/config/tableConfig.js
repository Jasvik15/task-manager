// TABLE CONFIGURATION - Edit only this file to change everything

export const tableConfig = {
  // Column Headers (change these labels as needed)
  headers: {
    slNo: "Sl.No",           
    plant: "Plant",          
    description: "Description",
    status: "Status",
    targetDate: "Start Date",     // Start Date column
    closeDate: "Close Date",      // NEW Close Date column
    remarks: "End Remarks"        // Keep original remarks
  },
  
  // Which fields to display (reorder or remove fields here)
  // DO NOT CHANGE THE FIELD NAMES, ONLY THE ORDER OR WHICH FIELDS TO SHOW
  visibleFields: ["slNo", "plant", "description", "status", "targetDate", "closeDate", "remarks"],
  
  // Page Titles - Change these
  titles: {
    dashboard: "Maintenance Task Dashboard",
    dashboardSub: "Pending & On-going Activities",
    admin: "Admin Dashboard"
  },
  
  // Button texts
  buttons: {
    adminPanel: "Admin Panel",
    addTask: "Add New Task",
    viewDashboard: "View Dashboard",
    logout: "Logout"
  }
};