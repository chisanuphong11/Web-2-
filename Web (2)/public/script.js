const gifts = [
  "หูฟังไร้สาย",
  "สมุดโน้ตน่ารักๆ",
  "แก้วน้ำเก็บอุณหภูมิ",
  "ขนมกล่องเล็ก",
  "ตุ๊กตานุ่มฟู",
  "ต้นไม้เล็กประดับโต๊ะ",
  "สายชาร์จเร็ว",
  "ปากกาสีสวย",
  "พวงกุญแจลายน่ารัก",
  "ของขวัญลึกลับ! 🎁"
];

document.getElementById('generateBtn').addEventListener('click', () => {
  const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
  document.getElementById('result').textContent = `ของขวัญของคุณคือ: ${randomGift}`;
});
