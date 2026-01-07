# AutoServe System - PlantUML Diagrams

This directory contains comprehensive SRS-standard diagrams for the AutoServe Vehicle Service Management System.

## 📁 Diagram Files

### Data Flow Diagrams (DFD)
1. **DFD0_Context_Diagram.puml** - Context Diagram (Level 0 DFD)
   - Shows system boundaries and external entities
   - Identifies all interactions with the system

2. **DFD1_Level1_DFD.puml** - Level 1 Data Flow Diagram
   - Decomposes system into major processes
   - Shows data flows between processes and data stores

### Use Case Diagrams (Module-Wise)
3. **UseCase_UserManagement.puml** - User Management Module
4. **UseCase_VehicleManagement.puml** - Vehicle Management Module
5. **UseCase_ServiceBooking.puml** - Service Booking Module
6. **UseCase_JobCardManagement.puml** - Job Card Management Module
7. **UseCase_InvoicePayment.puml** - Invoice & Payment Module
8. **UseCase_InventoryManagement.puml** - Inventory Management Module
9. **UseCase_ReviewsRatings.puml** - Reviews & Ratings Module
10. **UseCase_DigitalInspection.puml** - Digital Vehicle Inspection Module
11. **UseCase_LaborTracking.puml** - Labor Tracking Module
12. **UseCase_Notification.puml** - Notification Module
13. **UseCase_AdminManagement.puml** - Admin Management Module
14. **UseCase_TeamManagement.puml** - Team Management Module

## 🚀 How to Use

### Option 1: Online PlantUML Server (Recommended)
1. Visit: **http://www.plantuml.com/plantuml/uml/**
2. Open any `.puml` file from this directory
3. Copy the entire content
4. Paste into the online editor
5. Click "Submit" to generate the diagram
6. Export as PNG, SVG, or PDF

### Option 2: VS Code Extension
1. Install the **"PlantUML"** extension in VS Code
2. Open any `.puml` file
3. Press `Alt+D` or right-click → "Preview PlantUML Diagram"
4. Export from the preview window

### Option 3: Command Line (Local)
1. Install Java: https://www.java.com/
2. Download PlantUML JAR: http://plantuml.com/download
3. Run command:
   ```bash
   java -jar plantuml.jar diagrams/DFD0_Context_Diagram.puml
   ```

### Option 4: IntelliJ IDEA / PyCharm
1. Install "PlantUML integration" plugin
2. Open any `.puml` file
3. Right-click → "Diagrams" → "Show Diagram"

## 📊 Diagram Standards

All diagrams follow:
- ✅ **IEEE 830 SRS** compliance
- ✅ **UML 2.5** standards for Use Cases
- ✅ **Gane-Sarson** notation for DFDs
- ✅ **Industry best practices** for clarity

## 📋 Quick Reference

### DFD0 - Context Diagram
- **Purpose:** System boundaries and external entities
- **Shows:** All interactions with external systems
- **Use When:** Explaining system scope to stakeholders

### DFD1 - Level 1 DFD
- **Purpose:** Major processes and data flows
- **Shows:** How data moves through the system
- **Use When:** Technical documentation and system design

### Use Case Diagrams
- **Purpose:** Functional requirements per module
- **Shows:** Actors, use cases, and relationships
- **Use When:** Requirements analysis and testing

## 🎨 Customization

All diagrams use consistent color schemes:
- **Customer:** #FFE5B4 (Light Orange)
- **Service Center:** #B4E5FF (Light Blue)
- **Admin:** #FFB4B4 (Light Red)
- **Processes:** #D4E5F7 (Light Blue)
- **Data Stores:** #E8F5E8 (Light Green)

You can modify colors in the `.puml` files by changing the hex color codes.

## 📚 Documentation

For complete documentation with all diagrams in one place, see:
- **AUTOSERVE_COMPREHENSIVE_DIAGRAMS.md** (in root directory)

## ✅ Checklist

- [x] DFD0 Context Diagram
- [x] DFD1 Level 1 DFD
- [x] User Management Use Cases
- [x] Vehicle Management Use Cases
- [x] Service Booking Use Cases
- [x] Job Card Management Use Cases
- [x] Invoice & Payment Use Cases
- [x] Inventory Management Use Cases
- [x] Reviews & Ratings Use Cases
- [x] Digital Inspection Use Cases
- [x] Labor Tracking Use Cases
- [x] Notification Use Cases
- [x] Admin Management Use Cases
- [x] Team Management Use Cases

**Total: 14 comprehensive diagrams**

---

**Last Updated:** 2024  
**Standards:** IEEE 830 SRS, UML 2.5, DFD (Gane-Sarson)

