import {
  GalleryVerticalEnd,
  CalendarDays,
  IdCard,
  HouseWifi,
  University,
} from "lucide-react";

export const data = {
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
      icon: University ,
    },
    {
      title: "Card Access",
      url: "cards",
      icon: IdCard,
      isActive: false,
      items: [
        { title: "All Cards", url: "all-cards" },
        { title: "Generate Card", url: "card-generator" },
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
};
