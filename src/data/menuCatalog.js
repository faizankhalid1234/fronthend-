import { foodImages } from "../utils/foodImages";

export const menuCategories = [
  {
    id: "ramadan",
    title: "RAMADAN SPECIAL",
    arabicTitle: "",
    image: foodImages.r1,
  },
  {
    id: "appetizer",
    title: "APPETIZER",
    arabicTitle: "مقبلات",
    image: foodImages.a1,
  },
  {
    id: "deals",
    title: "Deals",
    arabicTitle: "",
    image: foodImages.dealHalf,
  },
  {
    id: "barbeque",
    title: "BARBEQUE",
    arabicTitle: "مشويات",
    image: foodImages.b1,
  },
  {
    id: "juices",
    title: "FRESH JUICES",
    arabicTitle: "عصيرات",
    image: foodImages.j1,
  },
  {
    id: "chowmien",
    title: "CHOWMIEN",
    arabicTitle: "مكرونة",
    image: foodImages.c1,
  },
  {
    id: "shakes",
    title: "SHAKES",
    arabicTitle: "المخفوق",
    image: foodImages.s1,
  },
  {
    id: "salad",
    title: "SALAD",
    arabicTitle: "سلطات",
    image: foodImages.sa1,
  },
];

export const menuCatalog = {
  ramadan: [
    { id: "r1", title: "ALOO PARATHA", arabicTitle: "", price: "4.00 SAR", image: foodImages.r1, isVeg: true },
    { id: "r2", title: "PLAIN PARATHA", arabicTitle: "", price: "3.00 SAR", image: foodImages.r2, isVeg: true },
    { id: "r3", title: "QEEMA PARATHA", arabicTitle: "", price: "4.00 SAR", image: foodImages.r3, isVeg: false },
    { id: "r4", title: "LAHORI CHANE", arabicTitle: "", price: "10.00 SAR", image: foodImages.r4, isVeg: true },
    { id: "r5", title: "HALWA", arabicTitle: "", price: "8.00 SAR", image: foodImages.r5, isVeg: true },
    { id: "r6", title: "EGG OMELETE", arabicTitle: "", price: "3.00 SAR", image: foodImages.r6, isVeg: false },
    { id: "r7", title: "EGG FRY", arabicTitle: "", price: "2.00 SAR", image: foodImages.r7, isVeg: false },
    { id: "r8", title: "LASSI", arabicTitle: "", price: "5.00 SAR", image: foodImages.r8, isVeg: true },
  ],
  appetizer: [
    { id: "a1", title: "FRENCH FRIES", arabicTitle: "بطاطس مقلية", price: "8.00 SAR", image: foodImages.a1, isVeg: true },
    { id: "a2", title: "VEG SPRING ROLLS 4PCS", arabicTitle: "لفائف الربيع", price: "15.00 SAR", image: foodImages.a2, isVeg: true },
    { id: "a3", title: "CHICKEN WINGS 12Pcs", arabicTitle: "أجنحة دجاج", price: "18.00 SAR", image: foodImages.a3, isVeg: false },
    { id: "a4", title: "DHAKA CHICKEN", arabicTitle: "دجاج داكا", price: "35.00 SAR", image: foodImages.a4, isVeg: false },
    { id: "a5", title: "CHICKEN ANGARIAN", arabicTitle: "دجاج أنجرين", price: "35.00 SAR", image: foodImages.a5, isVeg: false },
    { id: "a6", title: "CHICKEN LOLYPOP", arabicTitle: "دجاج لولي بوب", price: "30.00 SAR", image: foodImages.a6, isVeg: false },
  ],
  deals: [
    { id: "d1", title: "Half Daigi Steam With Rice+Drink", arabicTitle: "", price: "22.00 SAR", image: foodImages.dealHalf, isVeg: false },
    { id: "d2", title: "Full Daigi Steam With Rice+Drink", arabicTitle: "", price: "40.00 SAR", image: foodImages.dealFull, isVeg: false },
    { id: "d3", title: "BHANDU KHAN SPECIAL PLATTER FULL", arabicTitle: "", price: "75.00 SAR", image: foodImages.dealPlatterFull, isVeg: false },
    { id: "d4", title: "BHANDU KHAN SPECIAL PLATTER HALF", arabicTitle: "", price: "40.00 SAR", image: foodImages.dealPlatterHalf, isVeg: false },
  ],
  barbeque: [
    { id: "b1", title: "BHANDU KHAN SPECIAL MIX GRILL", arabicTitle: "", price: "60.00 SAR", image: foodImages.b1, isVeg: false },
    { id: "b2", title: "SAUDI FISH BOTTI", arabicTitle: "", price: "40.00 SAR", image: foodImages.b2, isVeg: false },
    { id: "b3", title: "GRILL PRAWN", arabicTitle: "", price: "50.00 SAR", image: foodImages.b3, isVeg: false },
    { id: "b4", title: "CHICKEN MALAI BOTTI", arabicTitle: "", price: "30.00 SAR", image: foodImages.b4, isVeg: false },
    { id: "b5", title: "CHICKEN TIKKA BOTTI", arabicTitle: "", price: "30.00 SAR", image: foodImages.b5, isVeg: false },
    { id: "b6", title: "CHICKEN TIKKA", arabicTitle: "", price: "12.00 SAR", image: foodImages.b6, isVeg: false },
    { id: "b7", title: "SHISH TAWIQ", arabicTitle: "", price: "30.00 SAR", image: foodImages.b7, isVeg: false },
    { id: "b8", title: "CHICKEN ACHARI BOTTI", arabicTitle: "", price: "35.00 SAR", image: foodImages.b8, isVeg: false },
    { id: "b9", title: "CHICKEN KABAB", arabicTitle: "", price: "25.00 SAR", image: foodImages.b9, isVeg: false },
    { id: "b10", title: "GOLA KABAB", arabicTitle: "", price: "28.00 SAR", image: foodImages.b7, isVeg: false },
    { id: "b11", title: "SEEKH KABAB", arabicTitle: "", price: "28.00 SAR", image: foodImages.b8, isVeg: false },
    { id: "b12", title: "MUTTON CHOPS", arabicTitle: "", price: "45.00 SAR", image: foodImages.b9, isVeg: false },
  ],
  juices: [
    { id: "j1", title: "SAUDI COCKTAIL", arabicTitle: "كوكتيل سعودي", price: "35.00 SAR", image: foodImages.j1, isVeg: true },
    { id: "j2", title: "FRESH ORANGE JUICE", arabicTitle: "عصير برتقال طازج", price: "10.00 SAR", image: foodImages.j2, isVeg: true },
    { id: "j3", title: "THANDI LASSI SWEET", arabicTitle: "لبن رائب بارد", price: "5.00 SAR", image: foodImages.j3, isVeg: true },
    { id: "j4", title: "THANDI LASSI SALTY", arabicTitle: "لبن رائب بارد", price: "5.00 SAR", image: foodImages.j4, isVeg: true },
  ],
  chowmien: [
    { id: "c1", title: "BHANDU KHAN MIX CHOWMIEN", arabicTitle: "بندو خان مشكلة شومين", price: "42.00 SAR", image: foodImages.c1, isVeg: false },
    { id: "c2", title: "PRAWN CHOWMIEN", arabicTitle: "روبيان شومين", price: "40.00 SAR", image: foodImages.c2, isVeg: false },
    { id: "c3", title: "FISH CHOWMIEN", arabicTitle: "سمك شومين", price: "40.00 SAR", image: foodImages.c3, isVeg: false },
    { id: "c4", title: "CHICKEN CHOWMIEN", arabicTitle: "دجاج شومين", price: "35.00 SAR", image: foodImages.c4, isVeg: false },
    { id: "c5", title: "EGG CHOWMIEN", arabicTitle: "بيض شومين", price: "30.00 SAR", image: foodImages.c5, isVeg: false },
  ],
  shakes: [
    { id: "s1", title: "MANGO ICE CREAM SHAKE", arabicTitle: "المخفوق حليب بالمنجا", price: "10.00 SAR", image: foodImages.s1, isVeg: true },
    { id: "s2", title: "VANILLA ICE CREAM SHAKE", arabicTitle: "المخفوق حليب فانيلا", price: "10.00 SAR", image: foodImages.s2, isVeg: true },
    { id: "s3", title: "CHOCOLATE ICE CREAM SHAKE", arabicTitle: "المخفوق حليب شوكولاته", price: "10.00 SAR", image: foodImages.s3, isVeg: true },
  ],
  salad: [
    { id: "sa1", title: "HUMOUS", arabicTitle: "حمص", price: "10.00 SAR", image: foodImages.sa1, isVeg: true },
    { id: "sa2", title: "GARDEN VEGETABLE SALAD", arabicTitle: "سلطة خضروات", price: "8.00 SAR", image: foodImages.sa2, isVeg: true },
    { id: "sa3", title: "YOGHURT CUCUMBER", arabicTitle: "سلطة بيضاء - زبادي وخيار", price: "6.00 SAR", image: foodImages.sa3, isVeg: true },
    { id: "sa4", title: "PINE APPLE RAITA", arabicTitle: "رائته مع اناناس", price: "10.00 SAR", image: foodImages.sa4, isVeg: true },
    { id: "sa5", title: "MIX RAITA", arabicTitle: "زبادي مشكل", price: "10.00 SAR", image: foodImages.sa5, isVeg: true },
  ],
};
