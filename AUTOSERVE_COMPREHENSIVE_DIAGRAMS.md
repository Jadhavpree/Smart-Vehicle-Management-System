# AutoServe System - Comprehensive SRS Standard Diagrams

## Document Purpose
This document provides **IEEE 830 SRS-compliant diagrams** in PlantUML format for the AutoServe Vehicle Service Management System. All diagrams follow industry standards with clear visualization.

---

## 📊 1. DFD0 - CONTEXT DIAGRAM (Level 0)

**Purpose:** Shows the system boundaries and all external entities interacting with the AutoServe system.

### PlantUML Code:

```plantuml
@startuml DFD0_Context_Diagram
!theme plain
skinparam componentStyle rectangle
skinparam defaultFontSize 12
skinparam component {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
    ArrowColor #34495E
}

title DFD0 - Context Diagram: AutoServe Management System

package "External Entities" {
    [Customer] as Customer #FFE5B4
    [Service Center] as ServiceCenter #B4E5FF
    [Admin] as Admin #FFB4B4
    [Payment Gateway] as PaymentGateway #E5FFB4
    [Email Service] as EmailService #FFB4E5
    [SMS/WhatsApp Service] as NotificationService #B4FFE5
}

package "AutoServe Management System" {
    [AutoServe System] as System #D4E5F7
}

' Customer interactions
Customer --> System : Booking Request\nVehicle Information\nPayment Details\nReview & Rating
System --> Customer : Booking Confirmation\nService Updates\nInvoice Details\nPayment Receipt\nStatus Notifications

' Service Center interactions
ServiceCenter --> System : Booking Approval/Rejection\nJob Card Creation\nLabor Task Updates\nParts Usage\nInvoice Generation\nInventory Management
System --> ServiceCenter : Booking Requests\nCustomer Information\nVehicle Details\nPayment Status\nInventory Alerts

' Admin interactions
Admin --> System : User Management\nSystem Configuration\nStock Request Approval\nAnalytics Access\nReports Generation
System --> Admin : System Statistics\nUser Reports\nPerformance Metrics\nInventory Reports

' Payment Gateway interaction
System --> PaymentGateway : Payment Processing Request
PaymentGateway --> System : Payment Confirmation\nTransaction ID

' Email Service interaction
System --> EmailService : Email Notifications\nInvoice Emails
EmailService --> System : Delivery Status

' Notification Service interaction
System --> NotificationService : SMS/WhatsApp Messages\nStatus Updates
NotificationService --> System : Delivery Confirmation

note right of System
    **Core Functions:**
    • User Management
    • Vehicle Registration
    • Service Booking
    • Job Card Management
    • Invoice & Payment
    • Inventory Control
    • Reviews & Ratings
    • Digital Inspection
    • Labor Tracking
    • Notifications
end note

@enduml
```

---

## 📊 2. DFD1 - LEVEL 1 DATA FLOW DIAGRAM

**Purpose:** Decomposes the system into major processes showing data flows between processes and data stores.

### PlantUML Code:

```plantuml
@startuml DFD1_Level1_DFD
!theme plain
skinparam componentStyle rectangle
skinparam defaultFontSize 11
skinparam component {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
    ArrowColor #34495E
}

title DFD1 - Level 1 Data Flow Diagram: AutoServe System

package "External Entities" {
    [Customer] as Customer #FFE5B4
    [Service Center] as ServiceCenter #B4E5FF
    [Admin] as Admin #FFB4B4
}

package "Processes" {
    rectangle "1.0\nUser\nManagement" as P1 #D4E5F7
    rectangle "2.0\nVehicle\nManagement" as P2 #D4E5F7
    rectangle "3.0\nService\nBooking" as P3 #D4E5F7
    rectangle "4.0\nJob Card\nManagement" as P4 #D4E5F7
    rectangle "5.0\nInventory\nManagement" as P5 #D4E5F7
    rectangle "6.0\nInvoice &\nPayment" as P6 #D4E5F7
    rectangle "7.0\nReviews &\nRatings" as P7 #D4E5F7
    rectangle "8.0\nDigital\nInspection" as P8 #D4E5F7
    rectangle "9.0\nLabor\nTracking" as P9 #D4E5F7
    rectangle "10.0\nNotification\nService" as P10 #D4E5F7
    rectangle "11.0\nAdmin\nManagement" as P11 #D4E5F7
}

package "Data Stores" {
    database "D1\nUsers" as D1 #E8F5E8
    database "D2\nVehicles" as D2 #E8F5E8
    database "D3\nBookings" as D3 #E8F5E8
    database "D4\nJob Cards" as D4 #E8F5E8
    database "D5\nInventory" as D5 #E8F5E8
    database "D6\nInvoices" as D6 #E8F5E8
    database "D7\nReviews" as D7 #E8F5E8
    database "D8\nStock Requests" as D8 #E8F5E8
    database "D9\nTeam Members" as D9 #E8F5E8
}

' Customer flows
Customer --> P1 : Registration Data\nLogin Credentials
P1 --> Customer : Authentication Token\nUser Profile
Customer --> P2 : Vehicle Details
P2 --> Customer : Vehicle List\nVehicle Info
Customer --> P3 : Booking Request
P3 --> Customer : Booking Confirmation\nStatus Updates
Customer --> P6 : Payment Details
P6 --> Customer : Invoice\nPayment Receipt
Customer --> P7 : Review & Rating
P7 --> Customer : Review Confirmation

' Service Center flows
ServiceCenter --> P3 : Booking Approval/Rejection
P3 --> ServiceCenter : Booking Requests
ServiceCenter --> P4 : Job Card Data\nTask Updates\nParts Usage
P4 --> ServiceCenter : Job Card Details\nProgress Status
ServiceCenter --> P5 : Inventory Updates\nStock Requests
P5 --> ServiceCenter : Inventory Status\nStock Alerts
ServiceCenter --> P6 : Invoice Generation Request
P6 --> ServiceCenter : Invoice Details
ServiceCenter --> P8 : Inspection Notes
P8 --> ServiceCenter : Inspection Reports
ServiceCenter --> P9 : Labor Time Data
P9 --> ServiceCenter : Labor Analytics

' Admin flows
Admin --> P11 : Management Requests
P11 --> Admin : System Reports\nAnalytics
Admin --> P5 : Stock Request Approval
P5 --> Admin : Stock Request Details

' Process to Data Store flows
P1 <--> D1 : User Data
P2 <--> D2 : Vehicle Data
P3 <--> D3 : Booking Data
P4 <--> D4 : Job Card Data
P5 <--> D5 : Inventory Data
P6 <--> D6 : Invoice Data
P7 <--> D7 : Review Data
P11 <--> D8 : Stock Request Data
P11 <--> D9 : Team Data

' Inter-process flows
P3 --> P4 : Approved Booking
P4 --> P5 : Parts Usage Request
P4 --> P6 : Job Card Completion
P6 --> P7 : Payment Confirmation
P4 --> P8 : Job Card Reference
P4 --> P9 : Task Assignment
P3 --> P10 : Status Change Events
P4 --> P10 : Progress Updates
P6 --> P10 : Payment Notifications
P8 --> P10 : Inspection Alerts
P5 --> P10 : Low Stock Alerts

note right of P1
    **Process 1.0:**
    • User Registration
    • Authentication
    • Profile Management
end note

note right of P4
    **Process 4.0:**
    • Job Card Creation
    • Task Assignment
    • Progress Tracking
    • Parts Allocation
end note

note right of P6
    **Process 6.0:**
    • Invoice Generation
    • Payment Processing
    • Transaction Recording
end note

@enduml
```

---

## 📊 3. USE CASE DIAGRAMS (Module-Wise)

### 3.1 USER MANAGEMENT MODULE

```plantuml
@startuml UseCase_UserManagement
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: User Management Module

actor Customer as Customer #FFE5B4
actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "User Management System" {
    usecase UC1_Register as "UC-1.1\nRegister Account"
    usecase UC2_Login as "UC-1.2\nLogin to System"
    usecase UC3_UpdateProfile as "UC-1.3\nUpdate Profile"
    usecase UC4_ChangePassword as "UC-1.4\nChange Password"
    usecase UC5_ViewProfile as "UC-1.5\nView Profile"
    usecase UC6_ManageUsers as "UC-1.6\nManage All Users"
    usecase UC7_ResetPassword as "UC-1.7\nReset Password"
    usecase UC8_ViewUserStats as "UC-1.8\nView User Statistics"
}

Customer --> UC1_Register
Customer --> UC2_Login
Customer --> UC3_UpdateProfile
Customer --> UC4_ChangePassword
Customer --> UC5_ViewProfile
Customer --> UC7_ResetPassword

ServiceCenter --> UC1_Register
ServiceCenter --> UC2_Login
ServiceCenter --> UC3_UpdateProfile
ServiceCenter --> UC4_ChangePassword
ServiceCenter --> UC5_ViewProfile

Admin --> UC2_Login
Admin --> UC3_UpdateProfile
Admin --> UC6_ManageUsers
Admin --> UC8_ViewUserStats

UC2_Login ..> UC5_ViewProfile : <<include>>
UC3_UpdateProfile ..> UC5_ViewProfile : <<include>>
UC6_ManageUsers ..> UC8_ViewUserStats : <<include>>

@enduml
```

---

### 3.2 VEHICLE MANAGEMENT MODULE

```plantuml
@startuml UseCase_VehicleManagement
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Vehicle Management Module

actor Customer as Customer #FFE5B4
actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "Vehicle Management System" {
    usecase UC1_RegisterVehicle as "UC-2.1\nRegister Vehicle"
    usecase UC2_ViewVehicles as "UC-2.2\nView My Vehicles"
    usecase UC3_UpdateVehicle as "UC-2.3\nUpdate Vehicle Details"
    usecase UC4_DeleteVehicle as "UC-2.4\nDelete Vehicle"
    usecase UC5_ViewVehicleHistory as "UC-2.5\nView Vehicle Service History"
    usecase UC6_ViewAllVehicles as "UC-2.6\nView All Vehicles"
    usecase UC7_ViewVehicleDetails as "UC-2.7\nView Vehicle Details"
}

Customer --> UC1_RegisterVehicle
Customer --> UC2_ViewVehicles
Customer --> UC3_UpdateVehicle
Customer --> UC4_DeleteVehicle
Customer --> UC5_ViewVehicleHistory

ServiceCenter --> UC7_ViewVehicleDetails
ServiceCenter --> UC5_ViewVehicleHistory

Admin --> UC6_ViewAllVehicles
Admin --> UC7_ViewVehicleDetails

UC1_RegisterVehicle ..> UC2_ViewVehicles : <<include>>
UC3_UpdateVehicle ..> UC2_ViewVehicles : <<include>>
UC5_ViewVehicleHistory ..> UC7_ViewVehicleDetails : <<include>>

@enduml
```

---

### 3.3 SERVICE BOOKING MODULE

```plantuml
@startuml UseCase_ServiceBooking
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Service Booking Module

actor Customer as Customer #FFE5B4
actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "Service Booking System" {
    usecase UC1_CreateBooking as "UC-3.1\nCreate Service Booking"
    usecase UC2_ViewBookings as "UC-3.2\nView My Bookings"
    usecase UC3_CancelBooking as "UC-3.3\nCancel Booking"
    usecase UC4_ApproveBooking as "UC-3.4\nApprove Booking"
    usecase UC5_RejectBooking as "UC-3.5\nReject Booking"
    usecase UC6_ViewAllBookings as "UC-3.6\nView All Bookings"
    usecase UC7_TrackStatus as "UC-3.7\nTrack Booking Status"
    usecase UC8_ViewBookingDetails as "UC-3.8\nView Booking Details"
}

Customer --> UC1_CreateBooking
Customer --> UC2_ViewBookings
Customer --> UC3_CancelBooking
Customer --> UC7_TrackStatus
Customer --> UC8_ViewBookingDetails

ServiceCenter --> UC4_ApproveBooking
ServiceCenter --> UC5_RejectBooking
ServiceCenter --> UC6_ViewAllBookings
ServiceCenter --> UC8_ViewBookingDetails

Admin --> UC6_ViewAllBookings
Admin --> UC8_ViewBookingDetails

UC1_CreateBooking ..> UC2_ViewBookings : <<include>>
UC4_ApproveBooking ..> UC8_ViewBookingDetails : <<include>>
UC5_RejectBooking ..> UC8_ViewBookingDetails : <<include>>
UC7_TrackStatus ..> UC8_ViewBookingDetails : <<include>>

@enduml
```

---

### 3.4 JOB CARD MANAGEMENT MODULE

```plantuml
@startuml UseCase_JobCardManagement
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Job Card Management Module

actor "Service Center" as ServiceCenter #B4E5FF
actor Customer as Customer #FFE5B4
actor Admin as Admin #FFB4B4

rectangle "Job Card Management System" {
    usecase UC1_CreateJobCard as "UC-4.1\nCreate Job Card"
    usecase UC2_AssignMechanic as "UC-4.2\nAssign Mechanic"
    usecase UC3_AddLaborTasks as "UC-4.3\nAdd Labor Tasks"
    usecase UC4_AddParts as "UC-4.4\nAdd Spare Parts"
    usecase UC5_UpdateProgress as "UC-4.5\nUpdate Service Progress"
    usecase UC6_ViewJobCard as "UC-4.6\nView Job Card Details"
    usecase UC7_CompleteService as "UC-4.7\nMark Service Complete"
    usecase UC8_ViewAllJobCards as "UC-4.8\nView All Job Cards"
}

ServiceCenter --> UC1_CreateJobCard
ServiceCenter --> UC2_AssignMechanic
ServiceCenter --> UC3_AddLaborTasks
ServiceCenter --> UC4_AddParts
ServiceCenter --> UC5_UpdateProgress
ServiceCenter --> UC6_ViewJobCard
ServiceCenter --> UC7_CompleteService
ServiceCenter --> UC8_ViewAllJobCards

Customer --> UC6_ViewJobCard

Admin --> UC8_ViewAllJobCards
Admin --> UC6_ViewJobCard

UC1_CreateJobCard ..> UC2_AssignMechanic : <<extend>>
UC1_CreateJobCard ..> UC3_AddLaborTasks : <<extend>>
UC1_CreateJobCard ..> UC4_AddParts : <<extend>>
UC5_UpdateProgress ..> UC6_ViewJobCard : <<include>>
UC7_CompleteService ..> UC6_ViewJobCard : <<include>>

@enduml
```

---

### 3.5 INVOICE & PAYMENT MODULE

```plantuml
@startuml UseCase_InvoicePayment
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Invoice & Payment Module

actor Customer as Customer #FFE5B4
actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4
actor "Payment Gateway" as PaymentGateway #E5FFB4

rectangle "Invoice & Payment System" {
    usecase UC1_GenerateInvoice as "UC-5.1\nGenerate Invoice"
    usecase UC2_ViewInvoice as "UC-5.2\nView Invoice Details"
    usecase UC3_ProcessPayment as "UC-5.3\nProcess Payment"
    usecase UC4_ViewPaymentStatus as "UC-5.4\nView Payment Status"
    usecase UC5_SendInvoiceEmail as "UC-5.5\nSend Invoice via Email"
    usecase UC6_ViewAllInvoices as "UC-5.6\nView All Invoices"
    usecase UC7_DownloadInvoice as "UC-5.7\nDownload Invoice PDF"
    usecase UC8_ViewPaymentHistory as "UC-5.8\nView Payment History"
}

ServiceCenter --> UC1_GenerateInvoice
ServiceCenter --> UC2_ViewInvoice
ServiceCenter --> UC5_SendInvoiceEmail
ServiceCenter --> UC6_ViewAllInvoices

Customer --> UC2_ViewInvoice
Customer --> UC3_ProcessPayment
Customer --> UC4_ViewPaymentStatus
Customer --> UC7_DownloadInvoice
Customer --> UC8_ViewPaymentHistory

Admin --> UC6_ViewAllInvoices
Admin --> UC2_ViewInvoice
Admin --> UC8_ViewPaymentHistory

PaymentGateway --> UC3_ProcessPayment

UC1_GenerateInvoice ..> UC2_ViewInvoice : <<include>>
UC1_GenerateInvoice ..> UC5_SendInvoiceEmail : <<extend>>
UC3_ProcessPayment ..> UC4_ViewPaymentStatus : <<include>>
UC3_ProcessPayment ..> UC8_ViewPaymentHistory : <<include>>

@enduml
```

---

### 3.6 INVENTORY MANAGEMENT MODULE

```plantuml
@startuml UseCase_InventoryManagement
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Inventory Management Module

actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "Inventory Management System" {
    usecase UC1_ViewInventory as "UC-6.1\nView Inventory"
    usecase UC2_AddInventoryItem as "UC-6.2\nAdd Inventory Item"
    usecase UC3_UpdateInventory as "UC-6.3\nUpdate Inventory Item"
    usecase UC4_DeleteInventoryItem as "UC-6.4\nDelete Inventory Item"
    usecase UC5_CreateStockRequest as "UC-6.5\nCreate Stock Request"
    usecase UC6_ApproveStockRequest as "UC-6.6\nApprove Stock Request"
    usecase UC7_RejectStockRequest as "UC-6.7\nReject Stock Request"
    usecase UC8_ViewStockRequests as "UC-6.8\nView Stock Requests"
    usecase UC9_ViewLowStockAlerts as "UC-6.9\nView Low Stock Alerts"
    usecase UC10_UpdateStockLevels as "UC-6.10\nUpdate Stock Levels"
}

ServiceCenter --> UC1_ViewInventory
ServiceCenter --> UC2_AddInventoryItem
ServiceCenter --> UC3_UpdateInventory
ServiceCenter --> UC4_DeleteInventoryItem
ServiceCenter --> UC5_CreateStockRequest
ServiceCenter --> UC8_ViewStockRequests
ServiceCenter --> UC9_ViewLowStockAlerts
ServiceCenter --> UC10_UpdateStockLevels

Admin --> UC1_ViewInventory
Admin --> UC6_ApproveStockRequest
Admin --> UC7_RejectStockRequest
Admin --> UC8_ViewStockRequests
Admin --> UC9_ViewLowStockAlerts

UC2_AddInventoryItem ..> UC1_ViewInventory : <<include>>
UC3_UpdateInventory ..> UC1_ViewInventory : <<include>>
UC5_CreateStockRequest ..> UC8_ViewStockRequests : <<include>>
UC6_ApproveStockRequest ..> UC10_UpdateStockLevels : <<include>>
UC9_ViewLowStockAlerts ..> UC1_ViewInventory : <<include>>

@enduml
```

---

### 3.7 REVIEWS & RATINGS MODULE

```plantuml
@startuml UseCase_ReviewsRatings
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Reviews & Ratings Module

actor Customer as Customer #FFE5B4
actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "Reviews & Ratings System" {
    usecase UC1_SubmitReview as "UC-7.1\nSubmit Review & Rating"
    usecase UC2_ViewMyReviews as "UC-7.2\nView My Reviews"
    usecase UC3_ViewAllReviews as "UC-7.3\nView All Reviews"
    usecase UC4_ViewServiceCenterReviews as "UC-7.4\nView Service Center Reviews"
    usecase UC5_UpdateReview as "UC-7.5\nUpdate Review"
    usecase UC6_DeleteReview as "UC-7.6\nDelete Review"
    usecase UC7_ViewRatingStats as "UC-7.7\nView Rating Statistics"
    usecase UC8_RespondToReview as "UC-7.8\nRespond to Review"
}

Customer --> UC1_SubmitReview
Customer --> UC2_ViewMyReviews
Customer --> UC5_UpdateReview
Customer --> UC6_DeleteReview

ServiceCenter --> UC4_ViewServiceCenterReviews
ServiceCenter --> UC7_ViewRatingStats
ServiceCenter --> UC8_RespondToReview

Admin --> UC3_ViewAllReviews
Admin --> UC7_ViewRatingStats
Admin --> UC6_DeleteReview

UC1_SubmitReview ..> UC2_ViewMyReviews : <<include>>
UC1_SubmitReview ..> UC4_ViewServiceCenterReviews : <<include>>
UC4_ViewServiceCenterReviews ..> UC7_ViewRatingStats : <<include>>

@enduml
```

---

### 3.8 DIGITAL VEHICLE INSPECTION MODULE

```plantuml
@startuml UseCase_DigitalInspection
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Digital Vehicle Inspection Module

actor "Service Center" as ServiceCenter #B4E5FF
actor Customer as Customer #FFE5B4
actor Admin as Admin #FFB4B4

rectangle "Digital Vehicle Inspection System" {
    usecase UC1_AddInspectionNote as "UC-8.1\nAdd Inspection Note"
    usecase UC2_ViewInspectionNotes as "UC-8.2\nView Inspection Notes"
    usecase UC3_SendInspectionToCustomer as "UC-8.3\nSend Inspection to Customer"
    usecase UC4_ApproveInspection as "UC-8.4\nApprove Inspection"
    usecase UC5_RejectInspection as "UC-8.5\nReject Inspection"
    usecase UC6_ViewInspectionHistory as "UC-8.6\nView Inspection History"
    usecase UC7_UpdateInspectionNote as "UC-8.7\nUpdate Inspection Note"
}

ServiceCenter --> UC1_AddInspectionNote
ServiceCenter --> UC2_ViewInspectionNotes
ServiceCenter --> UC3_SendInspectionToCustomer
ServiceCenter --> UC6_ViewInspectionHistory
ServiceCenter --> UC7_UpdateInspectionNote

Customer --> UC2_ViewInspectionNotes
Customer --> UC4_ApproveInspection
Customer --> UC5_RejectInspection
Customer --> UC6_ViewInspectionHistory

Admin --> UC6_ViewInspectionHistory
Admin --> UC2_ViewInspectionNotes

UC1_AddInspectionNote ..> UC2_ViewInspectionNotes : <<include>>
UC3_SendInspectionToCustomer ..> UC2_ViewInspectionNotes : <<include>>
UC4_ApproveInspection ..> UC6_ViewInspectionHistory : <<include>>
UC5_RejectInspection ..> UC6_ViewInspectionHistory : <<include>>

@enduml
```

---

### 3.9 LABOR TRACKING MODULE

```plantuml
@startuml UseCase_LaborTracking
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Labor Tracking Module

actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "Labor Tracking System" {
    usecase UC1_ClockIn as "UC-9.1\nClock In for Task"
    usecase UC2_ClockOut as "UC-9.2\nClock Out from Task"
    usecase UC3_ViewLaborAnalytics as "UC-9.3\nView Labor Analytics"
    usecase UC4_ViewTechnicianPerformance as "UC-9.4\nView Technician Performance"
    usecase UC5_AddTask as "UC-9.5\nAdd Labor Task"
    usecase UC6_ViewTaskHistory as "UC-9.6\nView Task History"
    usecase UC7_CalculateEfficiency as "UC-9.7\nCalculate Efficiency Metrics"
    usecase UC8_GeneratePerformanceReport as "UC-9.8\nGenerate Performance Report"
}

ServiceCenter --> UC1_ClockIn
ServiceCenter --> UC2_ClockOut
ServiceCenter --> UC3_ViewLaborAnalytics
ServiceCenter --> UC4_ViewTechnicianPerformance
ServiceCenter --> UC5_AddTask
ServiceCenter --> UC6_ViewTaskHistory

Admin --> UC4_ViewTechnicianPerformance
Admin --> UC7_CalculateEfficiency
Admin --> UC8_GeneratePerformanceReport
Admin --> UC3_ViewLaborAnalytics

UC1_ClockIn ..> UC6_ViewTaskHistory : <<include>>
UC2_ClockOut ..> UC6_ViewTaskHistory : <<include>>
UC2_ClockOut ..> UC3_ViewLaborAnalytics : <<include>>
UC3_ViewLaborAnalytics ..> UC7_CalculateEfficiency : <<include>>
UC4_ViewTechnicianPerformance ..> UC8_GeneratePerformanceReport : <<include>>

@enduml
```

---

### 3.10 NOTIFICATION MODULE

```plantuml
@startuml UseCase_Notification
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Notification Module

actor "Service Center" as ServiceCenter #B4E5FF
actor Customer as Customer #FFE5B4
actor Admin as Admin #FFB4B4
actor "SMS/WhatsApp Service" as NotificationService #E5FFB4

rectangle "Notification System" {
    usecase UC1_SendSMS as "UC-10.1\nSend SMS Notification"
    usecase UC2_SendWhatsApp as "UC-10.2\nSend WhatsApp Message"
    usecase UC3_SendStatusUpdate as "UC-10.3\nSend Status Update"
    usecase UC4_ViewNotificationHistory as "UC-10.4\nView Notification History"
    usecase UC5_SendCustomMessage as "UC-10.5\nSend Custom Message"
    usecase UC6_ViewDeliveryStatus as "UC-10.6\nView Delivery Status"
}

ServiceCenter --> UC1_SendSMS
ServiceCenter --> UC2_SendWhatsApp
ServiceCenter --> UC3_SendStatusUpdate
ServiceCenter --> UC4_ViewNotificationHistory
ServiceCenter --> UC5_SendCustomMessage

Customer --> UC4_ViewNotificationHistory

Admin --> UC4_ViewNotificationHistory
Admin --> UC6_ViewDeliveryStatus

NotificationService --> UC1_SendSMS
NotificationService --> UC2_SendWhatsApp
NotificationService --> UC6_ViewDeliveryStatus

UC1_SendSMS ..> UC4_ViewNotificationHistory : <<include>>
UC2_SendWhatsApp ..> UC4_ViewNotificationHistory : <<include>>
UC3_SendStatusUpdate ..> UC1_SendSMS : <<extend>>
UC3_SendStatusUpdate ..> UC2_SendWhatsApp : <<extend>>

@enduml
```

---

### 3.11 ADMIN MANAGEMENT MODULE

```plantuml
@startuml UseCase_AdminManagement
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Admin Management Module

actor Admin as Admin #FFB4B4

rectangle "Admin Management System" {
    usecase UC1_ViewDashboard as "UC-11.1\nView Admin Dashboard"
    usecase UC2_ManageUsers as "UC-11.2\nManage Users"
    usecase UC3_ViewStatistics as "UC-11.3\nView System Statistics"
    usecase UC4_ViewMechanicPerformance as "UC-11.4\nView Mechanic Performance"
    usecase UC5_ApproveStockRequests as "UC-11.5\nApprove Stock Requests"
    usecase UC6_ViewAllData as "UC-11.6\nView All System Data"
    usecase UC7_GenerateReports as "UC-11.7\nGenerate Reports"
    usecase UC8_SystemConfiguration as "UC-11.8\nSystem Configuration"
    usecase UC9_ViewAnalytics as "UC-11.9\nView Analytics"
    usecase UC10_ManageTeamMembers as "UC-11.10\nManage Team Members"
}

Admin --> UC1_ViewDashboard
Admin --> UC2_ManageUsers
Admin --> UC3_ViewStatistics
Admin --> UC4_ViewMechanicPerformance
Admin --> UC5_ApproveStockRequests
Admin --> UC6_ViewAllData
Admin --> UC7_GenerateReports
Admin --> UC8_SystemConfiguration
Admin --> UC9_ViewAnalytics
Admin --> UC10_ManageTeamMembers

UC1_ViewDashboard ..> UC3_ViewStatistics : <<include>>
UC1_ViewDashboard ..> UC9_ViewAnalytics : <<include>>
UC2_ManageUsers ..> UC6_ViewAllData : <<include>>
UC7_GenerateReports ..> UC3_ViewStatistics : <<include>>
UC7_GenerateReports ..> UC4_ViewMechanicPerformance : <<include>>

@enduml
```

---

### 3.12 TEAM MANAGEMENT MODULE

```plantuml
@startuml UseCase_TeamManagement
!theme plain
skinparam usecase {
    BackgroundColor #E8F4F8
    BorderColor #2C3E50
}
skinparam actor {
    BackgroundColor #FFE5B4
    BorderColor #2C3E50
}

title Use Case Diagram: Team Management Module

actor "Service Center" as ServiceCenter #B4E5FF
actor Admin as Admin #FFB4B4

rectangle "Team Management System" {
    usecase UC1_AddTeamMember as "UC-12.1\nAdd Team Member"
    usecase UC2_ViewTeamMembers as "UC-12.2\nView Team Members"
    usecase UC3_UpdateTeamMember as "UC-12.3\nUpdate Team Member"
    usecase UC4_RemoveTeamMember as "UC-12.4\nRemove Team Member"
    usecase UC5_AssignRole as "UC-12.5\nAssign Role to Member"
    usecase UC6_ViewMemberPerformance as "UC-12.6\nView Member Performance"
    usecase UC7_ViewAllTeams as "UC-12.7\nView All Teams"
}

ServiceCenter --> UC1_AddTeamMember
ServiceCenter --> UC2_ViewTeamMembers
ServiceCenter --> UC3_UpdateTeamMember
ServiceCenter --> UC4_RemoveTeamMember
ServiceCenter --> UC5_AssignRole
ServiceCenter --> UC6_ViewMemberPerformance

Admin --> UC7_ViewAllTeams
Admin --> UC2_ViewTeamMembers
Admin --> UC6_ViewMemberPerformance

UC1_AddTeamMember ..> UC2_ViewTeamMembers : <<include>>
UC3_UpdateTeamMember ..> UC2_ViewTeamMembers : <<include>>
UC5_AssignRole ..> UC2_ViewTeamMembers : <<include>>
UC6_ViewMemberPerformance ..> UC2_ViewTeamMembers : <<include>>

@enduml
```

---

## 📋 DIAGRAM USAGE INSTRUCTIONS

### How to Use These Diagrams:

1. **Online PlantUML Editor:**
   - Visit: http://www.plantuml.com/plantuml/uml/
   - Copy the PlantUML code for any diagram
   - Paste and click "Submit" to generate the diagram
   - Export as PNG, SVG, or PDF

2. **VS Code Extension:**
   - Install "PlantUML" extension
   - Create `.puml` files with the code
   - Preview using `Alt+D` or right-click → "Preview PlantUML Diagram"

3. **Local Installation:**
   - Install Java and PlantUML JAR
   - Use command line: `java -jar plantuml.jar diagram.puml`

### Diagram Standards Followed:

✅ **IEEE 830 SRS Compliance**
- Clear system boundaries
- Complete external entity identification
- Proper data flow representation
- Comprehensive use case coverage

✅ **Industry Standards**
- Standard DFD notation (Gane-Sarson)
- UML 2.5 Use Case notation
- Clear actor identification
- Proper relationship types (include, extend)

✅ **Visual Clarity**
- Color-coded entities and processes
- Clear labeling and numbering
- Logical grouping
- Professional presentation

---

## 📊 SUMMARY

This document provides:
- **1 Context Diagram (DFD0)** - System boundaries
- **1 Level 1 DFD (DFD1)** - Major processes and data flows
- **12 Module-Wise Use Case Diagrams** - Complete functional coverage

**Total Diagrams:** 14 comprehensive PlantUML diagrams

All diagrams are production-ready and follow SRS and industry standards for professional documentation.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Standards:** IEEE 830 SRS, UML 2.5, DFD (Gane-Sarson)

