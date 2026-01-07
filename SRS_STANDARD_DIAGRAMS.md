# AutoServe System - SRS Standard Diagrams for Client Delivery

## 📋 Document Purpose
This document provides **IEEE 830 SRS-compliant diagrams** that clearly explain the AutoServe system workflow to clients and stakeholders.

---

## 🎯 System Overview Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTOSERVE SYSTEM                             │
│                  Vehicle Service Management                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │CUSTOMER │          │ SERVICE │          │  ADMIN  │
   │         │          │ CENTER  │          │         │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                     │
        │                    │                     │
   ┌────▼────────────────────▼─────────────────────▼────┐
   │              WEB APPLICATION                        │
   │         (React + TypeScript Frontend)               │
   └────────────────────┬────────────────────────────────┘
                        │
   ┌────────────────────▼────────────────────────────────┐
   │           REST API BACKEND                          │
   │         (Node.js + Express.js)                      │
   └────────────────────┬────────────────────────────────┘
                        │
   ┌────────────────────▼────────────────────────────────┐
   │            DATABASE LAYER                           │
   │              (MongoDB)                              │
   └─────────────────────────────────────────────────────┘
```

---

## 📊 1. CONTEXT DIAGRAM (Level 0 DFD)

**Purpose:** Shows system boundaries and external entities

```
                    ┌──────────────┐
                    │   CUSTOMER   │
                    └──────┬───────┘
                           │
                    Booking Request
                    Vehicle Info
                    Payment
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │                                      │
        │      AUTOSERVE MANAGEMENT SYSTEM     │◄────── Admin Actions
        │                                      │        User Management
        │  • Vehicle Registration              │        Stock Approval
        │  • Service Booking                   │
        │  • Job Card Management               │              ┌──────────┐
        │  • Inventory Control                 │              │  ADMIN   │
        │  • Invoice & Payment                 │              └──────────┘
        │  • Reviews & Ratings                 │
        │                                      │
        └──────────┬───────────────────────────┘
                   │
            Service Updates
            Job Assignment
            Invoice Generation
                   │
                   ▼
            ┌──────────────┐
            │   SERVICE    │
            │   CENTER     │
            └──────────────┘
```

---

## 🔄 2. COMPLETE WORKFLOW DIAGRAM

**Purpose:** End-to-end process flow from booking to payment

```
START
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: CUSTOMER REGISTRATION & VEHICLE SETUP              │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Customer Registers Account
  │   └─► System validates & creates user
  │
  ├─► Customer Adds Vehicle
  │   └─► Enters: Make, Model, Year, VIN, License Plate
  │   └─► System stores vehicle details
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: SERVICE BOOKING                                    │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Customer Selects Vehicle
  ├─► Customer Chooses Service Type
  │   (Oil Change, Brake Service, Full Service, etc.)
  ├─► Customer Picks Date & Time
  ├─► Customer Adds Notes (optional)
  │
  ├─► System Creates Booking
  │   └─► Status: PENDING
  │   └─► Notification sent to Service Center
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: SERVICE CENTER APPROVAL                            │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Service Center Views Pending Bookings
  │
  ├─► Decision: Approve or Reject?
  │   │
  │   ├─► APPROVE
  │   │   └─► Status: CONFIRMED
  │   │   └─► Customer notified
  │   │
  │   └─► REJECT
  │       └─► Status: REJECTED
  │       └─► Customer notified
  │       └─► END
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: JOB CARD CREATION                                  │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Service Center Creates Job Card
  │   └─► Auto-generates Job Card Number (JC-2024-XXXX)
  │   └─► Status: JOB_CARD_CREATED
  │
  ├─► Service Center Assigns Mechanic
  │
  ├─► Service Center Adds Labor Tasks
  │   └─► Task name, estimated hours, hourly rate
  │
  ├─► Service Center Adds Required Parts
  │   └─► Part name, quantity, unit price
  │   └─► System auto-decrements inventory
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: SERVICE EXECUTION                                  │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Status: IN_SERVICE
  │   └─► Customer notified
  │
  ├─► Mechanic Works on Vehicle
  │   └─► Updates progress (0% → 100%)
  │   └─► Marks tasks as complete
  │
  ├─► Service Center Monitors Progress
  │
  ├─► Service Completed
  │   └─► Status: READY_FOR_BILLING
  │   └─► Customer notified
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: INVOICE GENERATION                                 │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Service Center Clicks "Generate Invoice"
  │
  ├─► System Auto-Calculates:
  │   ├─► Labor Cost (from job card tasks)
  │   ├─► Parts Cost (from spare parts used)
  │   ├─► Subtotal = Labor + Parts
  │   ├─► Tax = Subtotal × 10%
  │   └─► Total Amount = Subtotal + Tax
  │
  ├─► System Creates Invoice
  │   └─► Auto-generates Invoice Number (INV-2024-XXXX)
  │   └─► Status: PENDING PAYMENT
  │
  ├─► Invoice Sent to Customer
  │   └─► Email notification
  │   └─► Available in customer dashboard
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 7: PAYMENT PROCESSING                                 │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Customer Views Invoice
  │   └─► Sees detailed breakdown:
  │       ├─► Labor items with hours & rates
  │       ├─► Parts with quantities & prices
  │       ├─► Tax calculation
  │       └─► Total amount
  │
  ├─► Customer Clicks "Pay Now"
  │
  ├─► Customer Enters Payment Details
  │   ├─► Card number
  │   ├─► Cardholder name
  │   ├─► Expiry date
  │   └─► CVV
  │
  ├─► System Processes Payment (Mock Gateway)
  │   └─► 90% success rate simulation
  │
  ├─► Payment Result:
  │   │
  │   ├─► SUCCESS
  │   │   ├─► Invoice Status: PAID
  │   │   ├─► Booking Status: PAID
  │   │   ├─► Transaction ID generated
  │   │   ├─► Payment date recorded
  │   │   └─► Customer & Service Center notified
  │   │
  │   └─► FAILED
  │       ├─► Invoice Status: FAILED
  │       ├─► Error message shown
  │       └─► Customer can retry
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 8: POST-SERVICE (OPTIONAL)                            │
└─────────────────────────────────────────────────────────────┘
  │
  ├─► Customer Submits Review
  │   ├─► Rating (1-5 stars)
  │   └─► Comments
  │
  ├─► Review Stored in System
  │
  └─► Service Center Can View Reviews
  │
  ▼
END
```

---

## 👥 3. USER ROLE MATRIX

**Purpose:** Shows what each user type can do

| Feature | Customer | Service Center | Admin |
|---------|----------|----------------|-------|
| **User Management** |
| Register Account | ✅ | ✅ | ❌ |
| Login | ✅ | ✅ | ✅ |
| Update Profile | ✅ | ✅ | ✅ |
| Manage All Users | ❌ | ❌ | ✅ |
| **Vehicle Management** |
| Register Vehicle | ✅ | ❌ | ❌ |
| View My Vehicles | ✅ | ❌ | ❌ |
| Update Vehicle | ✅ | ❌ | ❌ |
| View All Vehicles | ❌ | ❌ | ✅ |
| **Service Booking** |
| Create Booking | ✅ | ❌ | ❌ |
| View My Bookings | ✅ | ❌ | ❌ |
| Cancel Booking | ✅ | ❌ | ❌ |
| Approve/Reject Booking | ❌ | ✅ | ❌ |
| View All Bookings | ❌ | ✅ | ✅ |
| **Job Card Management** |
| Create Job Card | ❌ | ✅ | ❌ |
| Assign Mechanic | ❌ | ✅ | ❌ |
| Update Progress | ❌ | ✅ | ❌ |
| Add Parts/Tasks | ❌ | ✅ | ❌ |
| **Inventory Management** |
| View Inventory | ❌ | ✅ | ✅ |
| Add Inventory Item | ❌ | ✅ | ❌ |
| Request Stock | ❌ | ✅ | ❌ |
| Approve Stock Request | ❌ | ❌ | ✅ |
| **Invoice & Payment** |
| Generate Invoice | ❌ | ✅ | ❌ |
| View Invoice | ✅ | ✅ | ✅ |
| Process Payment | ✅ | ❌ | ❌ |
| View Payment Status | ✅ | ✅ | ✅ |
| **Reviews & Ratings** |
| Submit Review | ✅ | ❌ | ❌ |
| View Reviews | ✅ | ✅ | ✅ |
| Respond to Review | ❌ | ✅ | ❌ |

---

## 📈 4. DATA FLOW DIAGRAM (Level 1)

**Purpose:** Shows how data moves through the system

```
┌──────────┐
│ CUSTOMER │
└────┬─────┘
     │
     │ 1.0 User Registration
     ▼
┌─────────────────┐         ┌──────────────┐
│  User Account   │────────►│ Users DB     │
│  Management     │         └──────────────┘
└────┬────────────┘
     │
     │ 2.0 Vehicle Registration
     ▼
┌─────────────────┐         ┌──────────────┐
│  Vehicle        │────────►│ Vehicles DB  │
│  Management     │         └──────────────┘
└────┬────────────┘
     │
     │ 3.0 Service Booking
     ▼
┌─────────────────┐         ┌──────────────┐
│  Booking        │────────►│ Bookings DB  │
│  Management     │         └──────────────┘
└────┬────────────┘
     │
     │ Booking Approval
     ▼
┌──────────────┐
│ SERVICE      │
│ CENTER       │
└────┬─────────┘
     │
     │ 4.0 Job Card Creation
     ▼
┌─────────────────┐         ┌──────────────┐
│  Job Card       │────────►│ JobCards DB  │
│  Management     │         └──────────────┘
└────┬────────────┘
     │
     │ Parts Usage
     ▼
┌─────────────────┐         ┌──────────────┐
│  Inventory      │◄───────►│ Inventory DB │
│  Management     │         └──────────────┘
└────┬────────────┘
     │
     │ 5.0 Invoice Generation
     ▼
┌─────────────────┐         ┌──────────────┐
│  Invoice        │────────►│ Invoices DB  │
│  Generation     │         └──────────────┘
└────┬────────────┘
     │
     │ Invoice Details
     ▼
┌──────────┐
│ CUSTOMER │
└────┬─────┘
     │
     │ 6.0 Payment Processing
     ▼
┌─────────────────┐         ┌──────────────┐
│  Payment        │────────►│ Payment      │
│  Processing     │         │ Gateway      │
└─────────────────┘         └──────────────┘
```

---

## 🔐 5. SECURITY & ACCESS CONTROL

**Purpose:** Shows authentication and authorization flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION                       │
└─────────────────────────────────────────────────────────────┘

User Enters Credentials
         │
         ▼
    ┌─────────┐
    │ Validate│
    │ Email & │
    │Password │
    └────┬────┘
         │
    ┌────▼────┐
    │ Valid?  │
    └────┬────┘
         │
    ┌────▼────────────┐
    │ YES         NO  │
    │                 │
    ▼                 ▼
Generate JWT      Show Error
Token             Message
    │                 │
    ▼                 └──► END
Store Token
in Browser
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    ROLE-BASED ACCESS                         │
└─────────────────────────────────────────────────────────────┘
    │
    ├─► Customer Role
    │   └─► Access: Dashboard, Vehicles, Bookings, Invoices
    │
    ├─► Service Center Role
    │   └─► Access: Bookings, Job Cards, Inventory, Invoices
    │
    └─► Admin Role
        └─► Access: All Users, All Data, System Settings
```

---

## 💾 6. DATABASE SCHEMA OVERVIEW

**Purpose:** Shows main entities and relationships

```
┌──────────────┐
│    USERS     │
│──────────────│
│ _id          │
│ name         │
│ email        │
│ password     │
│ role         │
│ phone        │
│ address      │
└──────┬───────┘
       │ 1
       │ owns
       │ *
┌──────▼───────┐
│   VEHICLES   │
│──────────────│
│ _id          │
│ owner        │◄────┐
│ make         │     │
│ model        │     │
│ year         │     │
│ vin          │     │
│ licensePlate │     │
│ mileage      │     │
└──────┬───────┘     │
       │ 1           │
       │ used in     │
       │ *           │
┌──────▼───────┐     │
│   BOOKINGS   │     │
│──────────────│     │
│ _id          │     │
│ customer     │─────┘
│ vehicle      │◄────┐
│ serviceType  │     │
│ preferredDate│     │
│ status       │     │
└──────┬───────┘     │
       │ 1           │
       │ generates   │
       │ 1           │
┌──────▼───────┐     │
│  JOB CARDS   │     │
│──────────────│     │
│ _id          │     │
│ jobCardNumber│     │
│ booking      │─────┘
│ customer     │
│ vehicle      │◄────┐
│ mechanic     │     │
│ laborTasks[] │     │
│ spareParts[] │     │
│ totalCost    │     │
│ progress     │     │
└──────┬───────┘     │
       │ 1           │
       │ creates     │
       │ 1           │
┌──────▼───────┐     │
│   INVOICES   │     │
│──────────────│     │
│ _id          │     │
│ invoiceNumber│     │
│ jobCard      │─────┘
│ customer     │
│ vehicle      │
│ laborCost    │
│ partsCost    │
│ tax          │
│ totalAmount  │
│ paymentStatus│
└──────────────┘

┌──────────────┐
│  INVENTORY   │
│──────────────│
│ _id          │
│ partName     │
│ sku          │
│ currentStock │
│ reorderLevel │
│ unitPrice    │
│ supplier     │
└──────────────┘

┌──────────────┐
│   REVIEWS    │
│──────────────│
│ _id          │
│ booking      │
│ customer     │
│ rating       │
│ comment      │
│ createdAt    │
└──────────────┘
```

---

## 📱 7. SYSTEM INTERFACES

**Purpose:** Shows how different parts communicate

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  • Customer Dashboard                                        │
│  • Service Center Dashboard                                  │
│  • Admin Dashboard                                           │
│  • Vehicle Registration                                      │
│  • Service Booking                                           │
│  • Invoice & Payment                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS REST API
                     │ JSON Format
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                  │
│                                                              │
│  API Endpoints:                                              │
│  • POST   /api/auth/register                                 │
│  • POST   /api/auth/login                                    │
│  • GET    /api/vehicles                                      │
│  • POST   /api/vehicles                                      │
│  • POST   /api/bookings                                      │
│  • GET    /api/servicecenter/bookings                        │
│  • POST   /api/jobcards                                      │
│  • POST   /api/invoices                                      │
│  • POST   /api/invoices/:id/process-payment                  │
│  • GET    /api/inventory                                     │
│  • POST   /api/stock-requests                                │
│  • POST   /api/reviews                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MongoDB Protocol
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   DATABASE (MongoDB)                         │
│                                                              │
│  Collections:                                                │
│  • users                                                     │
│  • vehicles                                                  │
│  • bookings                                                  │
│  • jobcards                                                  │
│  • invoices                                                  │
│  • inventory                                                 │
│  • stockrequests                                             │
│  • reviews                                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 8. SYSTEM STATES & TRANSITIONS

**Purpose:** Shows booking lifecycle states

```
┌─────────────────────────────────────────────────────────────┐
│              BOOKING STATUS LIFECYCLE                        │
└─────────────────────────────────────────────────────────────┘

    [START]
       │
       ▼
  ┌─────────┐
  │ PENDING │ ◄─── Customer creates booking
  └────┬────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
  ┌──────────┐      ┌──────────┐
  │CONFIRMED │      │ REJECTED │ ──► [END]
  └────┬─────┘      └──────────┘
       │
       │ Service Center approves
       ▼
  ┌──────────────────┐
  │ JOB_CARD_CREATED │ ◄─── Job card generated
  └────┬─────────────┘
       │
       │ Mechanic starts work
       ▼
  ┌────────────┐
  │ IN_SERVICE │ ◄─── Service in progress
  └────┬───────┘
       │
       │ Service completed
       ▼
  ┌───────────────────┐
  │ READY_FOR_BILLING │ ◄─── Invoice can be generated
  └────┬──────────────┘
       │
       │ Customer pays
       ▼
  ┌──────┐
  │ PAID │ ──► [END]
  └──────┘
```

---

## 📊 9. PERFORMANCE METRICS

**Purpose:** Shows system performance expectations

| Metric | Target | Description |
|--------|--------|-------------|
| **Response Time** | < 2 seconds | API response for all requests |
| **Page Load** | < 3 seconds | Complete page render time |
| **Concurrent Users** | 100+ | Simultaneous active users |
| **Database Queries** | < 500ms | Average query execution time |
| **Uptime** | 99.5% | System availability |
| **Payment Success** | 90% | Mock gateway success rate |

---

## 🔄 10. BACKUP & RECOVERY

**Purpose:** Shows data protection strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA BACKUP STRATEGY                      │
└─────────────────────────────────────────────────────────────┘

Daily Backup (Automated)
    │
    ├─► Full Database Backup
    │   └─► Stored for 30 days
    │
    ├─► Incremental Backup
    │   └─► Every 6 hours
    │
    └─► Transaction Logs
        └─► Real-time replication

Recovery Time Objective (RTO): 4 hours
Recovery Point Objective (RPO): 6 hours
```

---

## 📝 NOTES FOR CLIENT

### Key Features:
1. **User-Friendly Interface** - Easy navigation for all user types
2. **Real-Time Updates** - Instant status notifications
3. **Automated Calculations** - No manual invoice calculations
4. **Inventory Management** - Auto-decrement when parts used
5. **Secure Payments** - Mock gateway for demonstration
6. **Role-Based Access** - Each user sees only relevant features

### System Benefits:
- ✅ Reduces manual paperwork
- ✅ Improves customer communication
- ✅ Tracks inventory automatically
- ✅ Generates professional invoices
- ✅ Provides payment tracking
- ✅ Enables customer feedback

### Future Enhancements:
- Real payment gateway integration (Stripe/PayPal)
- SMS/Email notifications
- Mobile app version
- Advanced analytics dashboard
- Multi-language support
- PDF invoice generation

---

## 📞 SUPPORT & MAINTENANCE

**Contact Information:**
- Technical Support: [Your Email]
- System Updates: Monthly
- Bug Fixes: Within 48 hours
- Feature Requests: Quarterly review

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Prepared By:** [Your Name]  
**Approved By:** [Client Name]
