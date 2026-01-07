# AutoServe - Module-Wise Diagrams (Part 1)

## MODULE 1: USER MANAGEMENT

### 1.1 ER Diagram
```
┌─────────────────────────────────────────┐
│              USER ENTITY                │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ name (String)                           │
│ email (String) UNIQUE                   │
│ password (String) HASHED                │
│ role (Enum: customer/service/admin)    │
│ phone (String)                          │
│ address (String)                        │
│ createdAt (Date)                        │
│ updatedAt (Date)                        │
└─────────────────────────────────────────┘
```

### 1.2 Use Case Diagram
```
        ┌──────────┐
        │ Customer │
        └────┬─────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌────────┐ ┌────┐ ┌────────┐
│Register│ │Login│ │Profile │
└────────┘ └────┘ └────────┘
                      │
                      ├──► Update Profile
                      ├──► Change Password
                      └──► View Profile

        ┌──────────────┐
        │Service Center│
        └──────┬───────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────┐ ┌────────┐
│Register│ │Login│ │Profile │
└────────┘ └────┘ └────────┘

        ┌───────┐
        │ Admin │
        └───┬───┘
            │
    ┌───────┼───────┐
    │       │       │
    ▼       ▼       ▼
┌────┐ ┌────────┐ ┌──────────┐
│Login│ │Profile │ │Manage    │
└────┘ └────────┘ │All Users │
                  └──────────┘
```

### 1.3 DFD Level 0
```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ Credentials
     ▼
┌─────────────────┐
│  User           │
│  Management     │──────► User Data
│  System         │
└─────────────────┘
     │
     │ Auth Token
     ▼
┌──────────┐
│  User    │
└──────────┘
```

### 1.4 DFD Level 1
```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ Registration Data
     ▼
┌─────────────┐      ┌──────────┐
│  1.0        │─────►│ Users DB │
│  Register   │      └──────────┘
└─────────────┘
     │
     │ Login Credentials
     ▼
┌─────────────┐      ┌──────────┐
│  2.0        │◄─────│ Users DB │
│  Authenticate│      └──────────┘
└─────────────┘
     │
     │ JWT Token
     ▼
┌─────────────┐      ┌──────────┐
│  3.0        │◄────►│ Users DB │
│  Profile    │      └──────────┘
│  Management │
└─────────────┘
```

### 1.5 Activity Diagram - User Registration
```
START
  │
  ▼
[User Opens Registration Form]
  │
  ▼
[Enter Name, Email, Password, Role]
  │
  ▼
<Validate Input>
  │
  ├─NO──► [Show Error] ──► END
  │
  ▼ YES
<Check Email Exists?>
  │
  ├─YES──► [Show "Email Exists"] ──► END
  │
  ▼ NO
[Hash Password]
  │
  ▼
[Save to Database]
  │
  ▼
[Generate JWT Token]
  │
  ▼
[Send Welcome Email]
  │
  ▼
[Redirect to Dashboard]
  │
  ▼
END
```

### 1.6 Sequence Diagram - Login Process
```
User          Frontend        Backend         Database
 │               │               │               │
 │ Enter Creds   │               │               │
 ├──────────────►│               │               │
 │               │ POST /login   │               │
 │               ├──────────────►│               │
 │               │               │ Find User     │
 │               │               ├──────────────►│
 │               │               │ User Data     │
 │               │               │◄──────────────┤
 │               │               │               │
 │               │               │ Verify Pass   │
 │               │               │               │
 │               │               │ Generate JWT  │
 │               │               │               │
 │               │ Token + User  │               │
 │               │◄──────────────┤               │
 │ Success       │               │               │
 │◄──────────────┤               │               │
 │               │               │               │
```

---

## MODULE 2: VEHICLE MANAGEMENT

### 2.1 ER Diagram
```
┌─────────────────────────────────────────┐
│           VEHICLE ENTITY                │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ FK: owner (ObjectId) → User._id         │
│ make (String)                           │
│ model (String)                          │
│ year (Number)                           │
│ vin (String) UNIQUE SPARSE              │
│ licensePlate (String)                   │
│ mileage (Number)                        │
│ color (String)                          │
│ engineType (String)                     │
│ transmissionType (String)               │
│ fuelType (String)                       │
│ notes (String)                          │
│ status (Enum: active/inactive)          │
│ createdAt (Date)                        │
└─────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────┐
│            USER ENTITY                  │
└─────────────────────────────────────────┘
```

### 2.2 Use Case Diagram
```
        ┌──────────┐
        │ Customer │
        └────┬─────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
    ▼        ▼        ▼        ▼
┌────────┐ ┌────┐ ┌──────┐ ┌──────┐
│Register│ │View│ │Update│ │Delete│
│Vehicle │ │List│ │Vehicle│ │Vehicle│
└────────┘ └────┘ └──────┘ └──────┘
    │
    └──► [Enter Details]
         ├─► Make, Model, Year
         ├─► VIN, License Plate
         ├─► Mileage, Color
         └─► Specifications

        ┌──────────────┐
        │Service Center│
        └──────┬───────┘
               │
               ▼
         ┌──────────┐
         │View      │
         │Vehicle   │
         │History   │
         └──────────┘

        ┌───────┐
        │ Admin │
        └───┬───┘
            │
            ▼
      ┌──────────┐
      │View All  │
      │Vehicles  │
      └──────────┘
```

### 2.3 DFD Level 0
```
┌──────────┐
│ Customer │
└────┬─────┘
     │
     │ Vehicle Details
     ▼
┌─────────────────┐
│  Vehicle        │
│  Management     │──────► Vehicle Data
│  System         │
└─────────────────┘
     │
     │ Vehicle List
     ▼
┌──────────┐
│ Customer │
└──────────┘
```

### 2.4 DFD Level 1
```
┌──────────┐
│ Customer │
└────┬─────┘
     │
     │ Vehicle Info
     ▼
┌─────────────┐      ┌────────────┐
│  1.0        │─────►│ Vehicles   │
│  Register   │      │ DB         │
│  Vehicle    │      └────────────┘
└─────────────┘
     │
     │ View Request
     ▼
┌─────────────┐      ┌────────────┐
│  2.0        │◄─────│ Vehicles   │
│  Retrieve   │      │ DB         │
│  Vehicles   │      └────────────┘
└─────────────┘
     │
     │ Update Data
     ▼
┌─────────────┐      ┌────────────┐
│  3.0        │◄────►│ Vehicles   │
│  Update     │      │ DB         │
│  Vehicle    │      └────────────┘
└─────────────┘
```

### 2.5 Activity Diagram - Vehicle Registration
```
START
  │
  ▼
[Customer Opens Registration Form]
  │
  ▼
[Step 1: Enter Basic Info]
├─► Make, Model, Year, VIN
  │
  ▼
<Validate Step 1>
  │
  ├─NO──► [Show Errors] ──► [Back to Step 1]
  │
  ▼ YES
[Step 2: Enter Details]
├─► License Plate, Color, Mileage
  │
  ▼
<Validate Step 2>
  │
  ├─NO──► [Show Errors] ──► [Back to Step 2]
  │
  ▼ YES
[Step 3: Enter Specifications]
├─► Engine, Transmission, Fuel Type
  │
  ▼
<Validate Step 3>
  │
  ├─NO──► [Show Errors] ──► [Back to Step 3]
  │
  ▼ YES
[Step 4: Review All Data]
  │
  ▼
[Submit Registration]
  │
  ▼
<Check VIN Duplicate?>
  │
  ├─YES──► [Show "VIN Exists"] ──► END
  │
  ▼ NO
[Save to Database]
  │
  ▼
[Show Success Message]
  │
  ▼
[Redirect to Dashboard]
  │
  ▼
END
```

### 2.6 Sequence Diagram - Vehicle Registration
```
Customer      Frontend        Backend         Database
 │               │               │               │
 │ Fill Form     │               │               │
 ├──────────────►│               │               │
 │               │ POST /vehicles│               │
 │               ├──────────────►│               │
 │               │               │ Validate Data │
 │               │               │               │
 │               │               │ Check VIN     │
 │               │               ├──────────────►│
 │               │               │ VIN Status    │
 │               │               │◄──────────────┤
 │               │               │               │
 │               │               │ Save Vehicle  │
 │               │               ├──────────────►│
 │               │               │ Vehicle Saved │
 │               │               │◄──────────────┤
 │               │ Success       │               │
 │               │◄──────────────┤               │
 │ Confirmation  │               │               │
 │◄──────────────┤               │               │
 │               │               │               │
```

### 2.7 Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│              VEHICLE MODULE ARCHITECTURE            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Registration │  │ Vehicle List │                │
│  │ Form (4 Steps)│  │ Dashboard    │                │
│  └──────────────┘  └──────────────┘                │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────┐
│  API LAYER                                          │
│  ┌──────────────────────────────────────────────┐  │
│  │ Vehicle Routes (/api/vehicles)               │  │
│  │ • POST   /                                   │  │
│  │ • GET    /                                   │  │
│  │ • GET    /:id                                │  │
│  │ • PATCH  /:id                                │  │
│  │ • DELETE /:id                                │  │
│  │ • GET    /:id/history                        │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────┐
│  DATA LAYER                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ Vehicle Model                                │  │
│  │ • Schema Definition                          │  │
│  │ • Validation Rules                           │  │
│  │ • Indexes (VIN sparse unique)                │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  DATABASE (MongoDB)                                 │
│  vehicles collection                                │
└─────────────────────────────────────────────────────┘
```
