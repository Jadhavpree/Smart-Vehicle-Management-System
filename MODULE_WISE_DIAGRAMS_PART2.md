# AutoServe - Module-Wise Diagrams (Part 2)

## MODULE 3: SERVICE BOOKING

### 3.1 ER Diagram
```
┌─────────────────────────────────────────┐
│          BOOKING ENTITY                 │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ FK: customer (ObjectId) → User._id      │
│ FK: vehicle (ObjectId) → Vehicle._id    │
│ serviceType (String)                    │
│ preferredDate (Date)                    │
│ status (Enum)                           │
│ notes (String)                          │
│ createdAt (Date)                        │
└─────────────────────────────────────────┘
         │                    │
         │ N:1                │ N:1
         ▼                    ▼
┌──────────────┐      ┌──────────────┐
│ USER         │      │ VEHICLE      │
└──────────────┘      └──────────────┘

Status Values:
• pending
• confirmed
• job_card_created
• in_service
• ready_for_billing
• paid
• rejected
• cancelled
```

### 3.2 Use Case Diagram
```
        ┌──────────┐
        │ Customer │
        └────┬─────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
    ▼        ▼        ▼        ▼
┌────────┐ ┌────┐ ┌──────┐ ┌──────┐
│Create  │ │View│ │Cancel│ │Track │
│Booking │ │List│ │Booking│ │Status│
└────────┘ └────┘ └──────┘ └──────┘
    │
    └──► [Select Vehicle]
         [Choose Service]
         [Pick Date/Time]
         [Add Notes]

        ┌──────────────┐
        │Service Center│
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│View    │ │Approve│ │Reject│ │Update    │
│Pending │ │Booking│ │Booking│ │Status    │
└────────┘ └──────┘ └──────┘ └──────────┘
```

### 3.3 DFD Level 0
```
┌──────────┐
│ Customer │
└────┬─────┘
     │
     │ Booking Request
     ▼
┌─────────────────┐
│  Service        │
│  Booking        │──────► Booking Data
│  System         │
└─────────────────┘
     │
     │ Approval/Status
     ▼
┌──────────────┐
│Service Center│
└──────────────┘
```

### 3.4 DFD Level 1
```
┌──────────┐
│ Customer │
└────┬─────┘
     │ Booking Details
     ▼
┌─────────────┐      ┌────────────┐
│  1.0        │─────►│ Bookings   │
│  Create     │      │ DB         │
│  Booking    │      └────────────┘
└─────────────┘
     │ Notification
     ▼
┌──────────────┐
│Service Center│
└──────┬───────┘
       │ Approval Decision
       ▼
┌─────────────┐      ┌────────────┐
│  2.0        │◄────►│ Bookings   │
│  Process    │      │ DB         │
│  Approval   │      └────────────┘
└─────────────┘
       │ Status Update
       ▼
┌─────────────┐      ┌────────────┐
│  3.0        │◄────►│ Bookings   │
│  Update     │      │ DB         │
│  Status     │      └────────────┘
└─────────────┘
```

### 3.5 Activity Diagram - Booking Process
```
START
  │
  ▼
[Customer Selects Vehicle]
  │
  ▼
[Choose Service Type]
├─► Oil Change
├─► Brake Service
├─► Full Service
└─► Custom
  │
  ▼
[Select Preferred Date & Time]
  │
  ▼
[Add Notes (Optional)]
  │
  ▼
[Review Booking Details]
  │
  ▼
[Submit Booking]
  │
  ▼
[Save to Database]
├─► Status: PENDING
  │
  ▼
[Notify Service Center]
  │
  ▼
<Service Center Reviews>
  │
  ├─► APPROVE
  │   ├─► Status: CONFIRMED
  │   ├─► Notify Customer
  │   └─► END
  │
  └─► REJECT
      ├─► Status: REJECTED
      ├─► Notify Customer
      └─► END
```

### 3.6 Sequence Diagram - Booking Approval
```
Customer    Frontend    Backend    Database    Service Center
 │             │           │           │              │
 │Create       │           │           │              │
 │Booking      │           │           │              │
 ├────────────►│           │           │              │
 │             │POST       │           │              │
 │             │/bookings  │           │              │
 │             ├──────────►│           │              │
 │             │           │Save       │              │
 │             │           ├──────────►│              │
 │             │           │Saved      │              │
 │             │           │◄──────────┤              │
 │             │           │Notify     │              │
 │             │           ├───────────────────────►  │
 │             │Success    │           │              │
 │             │◄──────────┤           │              │
 │Confirmation │           │           │              │
 │◄────────────┤           │           │              │
 │             │           │           │View Pending  │
 │             │           │           │◄─────────────┤
 │             │           │Fetch      │              │
 │             │           │◄──────────┤              │
 │             │           │Data       │              │
 │             │           ├──────────►│              │
 │             │           │Approve    │              │
 │             │           │◄───────────────────────  │
 │             │           │Update     │              │
 │             │           ├──────────►│              │
 │             │           │Updated    │              │
 │             │           │◄──────────┤              │
 │Notification │           │           │              │
 │◄────────────┴───────────┤           │              │
```

---

## MODULE 4: JOB CARD MANAGEMENT

### 4.1 ER Diagram
```
┌─────────────────────────────────────────┐
│          JOB CARD ENTITY                │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ jobCardNumber (String) UNIQUE           │
│ FK: booking (ObjectId) → Booking._id    │
│ FK: customer (ObjectId) → User._id      │
│ FK: vehicle (ObjectId) → Vehicle._id    │
│ FK: assignedMechanic (ObjectId)         │
│ status (Enum)                           │
│ laborTasks (Array)                      │
│   ├─ task (String)                      │
│   ├─ hours (Number)                     │
│   ├─ hourlyRate (Number)                │
│   └─ completed (Boolean)                │
│ spareParts (Array)                      │
│   ├─ partName (String)                  │
│   ├─ quantity (Number)                  │
│   ├─ unitPrice (Number)                 │
│   └─ totalPrice (Number)                │
│ totalLaborCost (Number)                 │
│ totalPartsCost (Number)                 │
│ totalCost (Number)                      │
│ progress (Number 0-100)                 │
│ createdAt (Date)                        │
└─────────────────────────────────────────┘
         │           │           │
         │ 1:1       │ N:1       │ N:1
         ▼           ▼           ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ BOOKING  │  │ USER     │  │ VEHICLE  │
└──────────┘  └──────────┘  └──────────┘
```

### 4.2 Use Case Diagram
```
        ┌──────────────┐
        │Service Center│
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐
│Create  │ │Assign│ │Add   │ │Add   │ │Monitor │
│Job Card│ │Mechanic│ │Tasks │ │Parts │ │Progress│
└────────┘ └──────┘ └──────┘ └──────┘ └────────┘
    │
    └──► [Generate Number]
         [Link to Booking]
         [Set Initial Status]

        ┌──────────┐
        │ Mechanic │
        └────┬─────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌────────┐ ┌────┐ ┌────────┐
│Update  │ │Mark│ │Complete│
│Progress│ │Task│ │Job Card│
└────────┘ └────┘ └────────┘

        ┌────────┐
        │ System │
        └───┬────┘
            │
            ▼
      ┌──────────────┐
      │Auto-Decrement│
      │Inventory     │
      └──────────────┘
```

### 4.3 DFD Level 0
```
┌──────────────┐
│Service Center│
└──────┬───────┘
       │
       │ Job Card Data
       ▼
┌─────────────────┐
│  Job Card       │
│  Management     │──────► Job Card Data
│  System         │
└─────────────────┘
       │
       │ Progress Updates
       ▼
┌──────────┐
│ Mechanic │
└──────────┘
```

### 4.4 DFD Level 1
```
┌──────────────┐
│Service Center│
└──────┬───────┘
       │ Create Request
       ▼
┌─────────────┐      ┌────────────┐
│  1.0        │─────►│ JobCards   │
│  Create     │      │ DB         │
│  Job Card   │      └────────────┘
└─────────────┘
       │ Assign Mechanic
       ▼
┌─────────────┐      ┌────────────┐
│  2.0        │◄────►│ JobCards   │
│  Assign     │      │ DB         │
│  Resources  │      └────────────┘
└─────────────┘
       │ Add Parts
       ▼
┌─────────────┐      ┌────────────┐      ┌────────────┐
│  3.0        │◄────►│ JobCards   │      │ Inventory  │
│  Add Parts  │      │ DB         │◄────►│ DB         │
└─────────────┘      └────────────┘      └────────────┘
       │ Progress Update
       ▼
┌─────────────┐      ┌────────────┐
│  4.0        │◄────►│ JobCards   │
│  Track      │      │ DB         │
│  Progress   │      └────────────┘
└─────────────┘
```

### 4.5 Activity Diagram - Job Card Creation
```
START
  │
  ▼
[Service Center Selects Booking]
  │
  ▼
[Click "Create Job Card"]
  │
  ▼
[System Generates Job Card Number]
├─► Format: JC-YYYY-XXXX
  │
  ▼
[Link to Booking, Customer, Vehicle]
  │
  ▼
[Assign Mechanic]
  │
  ▼
[Add Labor Tasks]
├─► Task Name
├─► Estimated Hours
└─► Hourly Rate
  │
  ▼
<More Tasks?>
  │
  ├─YES──► [Add Another Task]
  │
  ▼ NO
[Add Spare Parts]
├─► Select from Inventory
├─► Enter Quantity
└─► System Calculates Price
  │
  ▼
<More Parts?>
  │
  ├─YES──► [Add Another Part]
  │
  ▼ NO
[System Auto-Decrements Inventory]
  │
  ▼
[Calculate Total Costs]
├─► Labor Cost = Σ(hours × rate)
├─► Parts Cost = Σ(quantity × price)
└─► Total = Labor + Parts
  │
  ▼
[Save Job Card]
├─► Status: CREATED
  │
  ▼
[Update Booking Status]
├─► Status: JOB_CARD_CREATED
  │
  ▼
[Notify Customer]
  │
  ▼
END
```

### 4.6 Sequence Diagram - Job Card Progress Update
```
Mechanic    Frontend    Backend    JobCard DB    Booking DB
 │             │           │           │              │
 │Update       │           │           │              │
 │Progress     │           │           │              │
 ├────────────►│           │           │              │
 │             │PATCH      │           │              │
 │             │/jobcards  │           │              │
 │             │/:id       │           │              │
 │             │/progress  │           │              │
 │             ├──────────►│           │              │
 │             │           │Update     │              │
 │             │           │Progress   │              │
 │             │           ├──────────►│              │
 │             │           │Updated    │              │
 │             │           │◄──────────┤              │
 │             │           │           │              │
 │             │           │<Progress=100?>           │
 │             │           │           │              │
 │             │           │YES        │              │
 │             │           │           │              │
 │             │           │Update     │              │
 │             │           │Booking    │              │
 │             │           │Status     │              │
 │             │           ├───────────────────────►  │
 │             │           │Updated    │              │
 │             │           │◄───────────────────────  │
 │             │Success    │           │              │
 │             │◄──────────┤           │              │
 │Confirmation │           │           │              │
 │◄────────────┤           │           │              │
```

### 4.7 Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│           JOB CARD MODULE ARCHITECTURE              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Job Card     │  │ Progress     │                │
│  │ Detail View  │  │ Tracker      │                │
│  └──────────────┘  └──────────────┘                │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────┐
│  API LAYER                                          │
│  ┌──────────────────────────────────────────────┐  │
│  │ Job Card Routes (/api/jobcards)              │  │
│  │ • POST   /                                   │  │
│  │ • GET    /                                   │  │
│  │ • PATCH  /:id                                │  │
│  │ • POST   /:id/add-part                       │  │
│  │ • PATCH  /:id/progress                       │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Business Logic
                     ▼
┌─────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                               │
│  ┌──────────────────────────────────────────────┐  │
│  │ • Auto-generate Job Card Number              │  │
│  │ • Calculate Labor Costs                      │  │
│  │ • Calculate Parts Costs                      │  │
│  │ • Auto-decrement Inventory                   │  │
│  │ • Update Booking Status                      │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────┐
│  DATA LAYER                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ Job Card Model                               │  │
│  │ • Schema with embedded arrays                │  │
│  │ • Pre-save hooks for calculations            │  │
│  │ • Unique job card number generation          │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  DATABASE (MongoDB)                                 │
│  • jobcards collection                              │
│  • inventory collection (for parts)                 │
│  • bookings collection (for status update)          │
└─────────────────────────────────────────────────────┘
```
