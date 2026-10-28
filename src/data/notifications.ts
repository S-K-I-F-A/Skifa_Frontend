export const categories = [
  "All",
  "Opportunities & offers",
  "Payments",
  "Interviews",
  "Reminders",
  "Offer updates",
] as const;
type Notice = {
  id: string;
  category: (typeof categories)[number];
  title: string;
  description: string;
  time: string;
  icon: string;
};
export const notifications: Notice[] = [
  {
    id: "offer-1",
    category: "Opportunities & offers",
    title: "A new placement opportunity",
    description:
      "A company is interested in your frontend skills. Review your profile to get ready.",
    time: "2 hours ago",
    icon: "◇",
  },
  {
    id: "payment-1",
    category: "Payments",
    title: "Placement payment update",
    description: "A placement payment is awaiting confirmation.",
    time: "4 hours ago",
    icon: "$",
  },
  {
    id: "interview-1",
    category: "Interviews",
    title: "Interview reminder",
    description:
      "Your placement interview is tomorrow. Check the time with your placement contact.",
    time: "Yesterday",
    icon: "◷",
  },
  {
    id: "reminder-1",
    category: "Reminders",
    title: "Make your profile visible",
    description:
      "Finish your profile and make it visible to companies looking for interns.",
    time: "Yesterday",
    icon: "!",
  },
  {
    id: "reminder-2",
    category: "Reminders",
    title: "Activate your wallet",
    description: "Complete your NIN check before receiving placement payments.",
    time: "2 days ago",
    icon: "▢",
  },
];
