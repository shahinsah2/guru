const modulePermissions: { [key: string]: string[] } = {
    Inventory: [
      "can_add",
      "can_edit",
      "can_delete",
      "can_activate",
      "can_deactivate",
      "can_search",
      "can_import",
      "can_export",
      "can_print",
      "can_generate_pdf",
      "can_logout",
    ],
    CRM: [
      "can_add",
      "can_edit",
      "can_delete",
      "can_search",
      "can_import",
      "can_export",
      "can_print",
      "can_generate_pdf",
    ],
    Operations: [
      "can_add",
      "can_edit",
      "can_delete",
      "can_activate",
      "can_deactivate",
      "can_search",
    ],
    Procurement: [
      "can_add",
      "can_edit",
      "can_delete",
      "can_search",
      "can_export",
    ],
    Sales: [
      "can_add",
      "can_edit",
      "can_delete",
      "can_search",
      "can_export",
      "can_print",
    ],
    Finance: [
      "can_add",
      "can_edit",
      "can_delete",
      "can_search",
      "can_export",
      "can_generate_pdf",
    ],
    Users: ["can_add", "can_edit", "can_delete"],
  };
  
  
  export default modulePermissions;
  