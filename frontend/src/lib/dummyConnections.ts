export const currentUser = {
    id: "1",
    loggedIn: true,
  };
  
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
    {
      id: "5",
      name: "User5",
      description: "Data Scientist",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "6",
      name: "User6",
      description: "UI/UX Designer",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "7",
      name: "User7",
      description: "Backend Developer",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "8",
      name: "User8",
      description: "DevOps Engineer",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "9",
      name: "User9",
      description: "QA Tester",
      profilePhoto: "/public/images/account.png",
    },
    {
      id: "10",
      name: "User10",
      description: "Machine Learning Engineer",
      profilePhoto: "/public/images/account.png",
    },
  ];
  
  export let connectionRequests = [
    { request_from_id: "4", request_to_id: "1", created_at: "2024-11-24T09:00:00Z" }, // User4 mengirim request ke User1
    { request_from_id: "5", request_to_id: "1", created_at: "2024-11-24T07:00:00Z" }, // User5 mengirim request ke User1
    { request_from_id: "6", request_to_id: "1", created_at: "2024-11-24T08:00:00Z" }, // User6 mengirim request ke User1
    { request_from_id: "7", request_to_id: "2", created_at: "2024-11-24T06:00:00Z" }, // User7 mengirim request ke User2
  ];
  
  export let connections = [
    { from_id: "1", to_id: "3", created_at: "2024-11-23T11:00:00Z" }, // User1 terhubung dengan User3
    { from_id: "3", to_id: "1", created_at: "2024-11-23T11:00:00Z" }, // User3 terhubung dengan User1
    { from_id: "1", to_id: "2", created_at: "2024-11-23T10:00:00Z" }, // User1 terhubung dengan User2
    { from_id: "2", to_id: "1", created_at: "2024-11-23T10:00:00Z" }, // User2 terhubung dengan User1
    { from_id: "8", to_id: "9", created_at: "2024-11-22T14:00:00Z" }, // User8 terhubung dengan User9
    { from_id: "9", to_id: "8", created_at: "2024-11-22T14:00:00Z" }, // User9 terhubung dengan User8
  ];
  