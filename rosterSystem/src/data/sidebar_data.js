import {
  GalleryVerticalEnd,
  CalendarDays,
  IdCard,
  HouseWifi,
  University,
  Users
} from "lucide-react";
export const getSidebarData = (user) => ({
  user: {
    name: "RONAL PLAOK",
    email: "plaokNalDo235@plaok.com",
    avatar:
      "https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-during-the-uefa-nations-news-photo-1748359673.pjpeg?crop=0.610xw:0.917xh;0.317xw,0.0829xh&resize=640:*",
  },
  teams: [
    {
      name: "JohnSey",
      logo: GalleryVerticalEnd,
      plan: "System",
    },
  ],
  navMain: [
    {
      title: "Roster",
      url: "",
      icon: CalendarDays,
    },
    {
      title: "Blocks Manage",
      url: "buildings-rooms-manage",
      icon: University,
    },
    {
      title: "Card Access",
      url: "cards",
      icon: IdCard,
      isActive: false,
      items: [
        { title: "All Cards", url: "all-cards" },
        { title: "Cards Summary", url: "cards-summary" },
        { title: "Generate Card", url: "card-generator" },
      ],
    },
    {
      title: "User Manage",
      url: "users-manage",
      icon: Users,
      isActive: false,
      roles: [1, 2], // 👈 Super Admin & Admin only
      items: [
        { title: "All Users", url: "all-users" },
      ],
    },
    {
      title: "Internet",
      url: "internet",
      icon: HouseWifi,
      isActive: false,
      items: [
        { title: "All Customers", url: "all-customers" },
        { title: "All ISP", url: "all-isp" },
      ],
    },
  ],
});
