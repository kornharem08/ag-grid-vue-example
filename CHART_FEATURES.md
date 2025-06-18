# Chart Features Documentation

## Overview
ระบบได้เพิ่มฟีเจอร์ Chart Analytics เพื่อแสดงข้อมูลในรูปแบบกราฟที่หลากหลาย ช่วยให้ผู้ใช้สามารถวิเคราะห์ข้อมูล Purchase Order ได้ง่ายขึ้น

## Features

### Tab System
- **Table Tab**: แสดงข้อมูลในรูปแบบตาราง (เหมือนเดิม)
- **Chart Tab**: แสดงข้อมูลในรูปแบบกราฟต่างๆ

### Chart Types

#### 1. Bar Charts
แสดงการเปรียบเทียบจำนวนโปรเจคระหว่างบุคคลต่างๆ

- **Project Manager Chart**: แสดงจำนวนโปรเจคของแต่ละ Project Manager
- **Sales Team Chart**: แสดงจำนวนโปรเจคของแต่ละ Sales Team

#### 2. Pie Charts
แสดงสัดส่วนของข้อมูลในรูปแบบกราฟวงกลม

- **Distributor Chart**: แสดงสัดส่วนของ Distributor แต่ละประเภท
- **Customer Chart**: แสดงสัดส่วนของลูกค้าแต่ละราย
- **Status Chart**: แสดงสัดส่วนของสถานะ (Completed vs Not Completed)

#### 3. Timeline Volume Charts
แสดงข้อมูลตามช่วงเวลาในรูปแบบกราฟเส้น

- **Received Date Chart**: แสดงจำนวนสินค้าเข้าคลังแต่ละเดือน
- **Stock Picking Out Chart**: แสดงจำนวนสินค้าออกคลังแต่ละเดือน

## Data Processing

### ข้อมูลที่ใช้
ข้อมูลมาจาก PurchaseOrder API โดยใช้ฟิลด์ต่อไปนี้:
- `jobIdNo`: รหัสงาน
- `projectManager`: ชื่อ Project Manager
- `salesTeam`: ชื่อ Sales Team
- `customer`: ชื่อลูกค้า
- `distribution`: ประเภท Distributor
- `status`: สถานะงาน
- `receivedDate`: วันที่ได้รับสินค้า
- `stockPickingOutDate`: วันที่เบิกสินค้าออก
- `ordered`: จำนวนที่สั่ง
- `received`: จำนวนที่รับ

### การประมวลผลวันที่
ระบบรองรับรูปแบบวันที่หลายแบบ:
- DD-MMM-YY (เช่น 08-Jan-24)
- DD/MM/YYYY
- YYYY-MM-DD

## Technical Implementation

### Dependencies
- **Chart.js**: ไลบรารีสำหรับสร้างกราฟ
- **vue-chartjs**: Vue wrapper สำหรับ Chart.js

### Components Structure
```
src/components/
├── charts/
│   ├── BarChart.vue      # Bar chart component
│   ├── PieChart.vue      # Pie chart component
│   └── TimelineChart.vue # Timeline chart component
├── ChartDashboard.vue    # Dashboard container
└── DataGrid.vue         # Table component (modified)
```

### Features
- **Responsive Design**: กราฟปรับขนาดตามหน้าจอ
- **Interactive Tooltips**: แสดงข้อมูลเพิ่มเติมเมื่อ hover
- **Color Coding**: ใช้สีที่แตกต่างกันสำหรับข้อมูลแต่ละประเภท
- **Dynamic Data**: กราฟอัปเดตอัตโนมัติเมื่อข้อมูลเปลี่ยน

## Usage

1. **โหลดข้อมูล**: เริ่มจาก Table tab เพื่อโหลดข้อมูล
2. **เปลี่ยน Tab**: คลิกที่ Chart tab เพื่อดูกราฟ
3. **วิเคราะห์ข้อมูล**: ใช้กราฟต่างๆ เพื่อวิเคราะห์ข้อมูล

## Benefits

### สำหรับผู้บริหาร
- เห็นภาพรวมของการทำงานแต่ละทีม
- ติดตามประสิทธิภาพของ Project Manager และ Sales Team
- วิเคราะห์แนวโน้มการเข้า-ออกสินค้า

### สำหรับทีมงาน
- ติดตามสถานะงานแบบ real-time
- เปรียบเทียบผลงานระหว่างทีม
- วางแผนการทำงานจากข้อมูลในอดีต

## Notes
- ข้อมูลจะแสดงหลังจากโหลดข้อมูลจาก Table tab เรียบร้อยแล้ว
- หากไม่มีข้อมูล จะแสดงข้อความแจ้งให้โหลดข้อมูลก่อน
- กราฟจะอัปเดตอัตโนมัติเมื่อเปลี่ยน Setting หรือโหลดข้อมูลใหม่ 