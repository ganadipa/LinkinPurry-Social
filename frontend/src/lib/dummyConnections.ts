export const users = [
    {
      id: "1",
      name: "User1",
      description: "Software Engineer",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "2",
      name: "User2",
      description: "Frontend Developer",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "3",
      name: "User3",
      description: "Product Manager",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "4",
      name: "User4",
      description: "Marketing Specialist",
      profilePhoto: "/public/images/account.png",
    },
  ];
  
  export let connectionRequests = [
    { request_from_id: "4", request_to_id: "1", created_at: new Date().toISOString() }, // User4 mengirim request koneksi ke User1
  ];
  
  export let connections = [
    { from_id: "1", to_id: "3", created_at: new Date().toISOString() }, // User1 terhubung dengan User3
    { from_id: "3", to_id: "1", created_at: new Date().toISOString() }, // User3 terhubung dengan User1
  ];
  