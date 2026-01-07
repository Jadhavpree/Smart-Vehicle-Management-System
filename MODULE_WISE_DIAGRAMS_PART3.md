# AutoServe - Module-Wise Diagrams (Part 3)

## MODULE 5: INVENTORY MANAGEMENT

### 5.1 ER Diagram
```
┌─────────────────────────────────────────┐
│         INVENTORY ENTITY                │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ partName (String)                       │
│ sku (String) UNIQUE                     │
│ category (String)                       │
│ currentStock (Number)                   │
│ reorderLevel (Number)                   │
│ unitPrice (Number)                      │
│ supplier (String)                       │
│ description (String)                    │
│ createdAt (Date)                        │
└─────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────┐
│      STOCK REQUEST ENTITY               │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ FK: inventoryItem (ObjectId)            │
│ FK: requestedBy (ObjectId) → User._id   │
│ FK: approvedBy (ObjectId) → User._id    │
│ requestedQuantity (Number)              │
│ currentStock (Number)                   │
│ reason (String)                         │
│ priority (Enum: low/medium/high/critical)│
│ status (Enum: pending/approved/rejected/fulfilled)│
│ adminNotes (String)                     │
│ createdAt (Date)                        │
│ approvedAt (Date)                       │
│ fulfilledAt (Date)                      │
└─────────────────────────────────────────┘
```

### 5.2 Use Case Diagram
```
        ┌──────────────┐
        │Service Center│
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────┐ ┌──────┐ ┌────────┐ ┌────────┐
│Add Item│ │View│ │Request│ │Check   │ │View    │
│        │ │List│ │Stock  │ │Low Stock│ │Requests│
└────────┘ └────┘ └──────┘ └────────┘ └────────┘
                      │
                      └──► [Select Item]
                           [Enter Quantity]
                           [Specify Reason]
                           [Set Priority]

        ┌───────┐
        │ Admin │
        └───┬───┘
            │
    ┌───────┼───────┬───────┐
    │       │       │       │
    ▼       ▼       ▼       ▼
┌────┐ ┌──────┐ ┌──────┐ ┌──────┐
│View│ │Approve│ │Reject│ │Fulfill│
│All │ │Request│ │Request│ │Request│
└────┘ └──────┘ └──────┘ └──────┘

        ┌────────┐
        │ System │
        └───┬────┘
            │
            ▼
      ┌──────────────┐
      │Auto-Alert    │
      │Low Stock     │
      └──────────────┘
```

### 5.3 DFD Level 0
```
┌──────────────┐
│Service Center│
└──────┬───────┘
       │
       │ Stock Request
       ▼
┌─────────────────┐
│  Inventory      │
│  Management     │──────► Inventory Data
│  System         │
└─────────────────┘
       │
       │ Approval/Fulfillment
       ▼
┌───────┐
│ Admin │
└───────┘
```

### 5.4 DFD Level 1
```
┌──────────────┐
│Service Center│
└──────┬───────┘
       │ Add Item
       ▼
┌─────────────┐      ┌────────────┐
│  1.0        │─────►│ Inventory  │
│  Manage     │      │ DB         │
│  Items      │      └────────────┘
└─────────────┘
       │ Check Stock
       ▼
┌─────────────┐      ┌────────────┐
│  2.0        │◄─────│ Inventory  │
│  Monitor    │      │ DB         │
│  Stock      │      └────────────┘
└─────────────┘
       │ Request Stock
       ▼
┌─────────────┐      ┌────────────┐
│  3.0        │─────►│ Stock      │
│  Create     │      │ Requests DB│
│  Request    │      └────────────┘
└─────────────┘
       │ Notify Admin
       ▼
┌───────┐
│ Admin │
└───┬───┘
    │ Approve/Reject
    ▼
┌─────────────┐      ┌────────────┐
│  4.0        │◄────►│ Stock      │
│  Process    │      │ Requests DB│
│  Request    │      └────────────┘
└─────────────┘
    │ Fulfill
    ▼
┌─────────────┐      ┌────────────┐
│  5.0        │◄────►│ Inventory  │
│  Update     │      │ DB         │
│  Stock      │      └────────────┘
└─────────────┘
```

### 5.5 Activity Diagram - Stock Request Process
```
START
  │
  ▼
[Service Center Checks Inventory]
  │
  ▼
<Stock Below Reorder Level?>
  │
  ├─NO──► END
  │
  ▼ YES
[System Shows Low Stock Alert]
  │
  ▼
[Service Center Clicks "Request Stock"]
  │
  ▼
[Select Inventory Item]
  │
  ▼
[Enter Requested Quantity]
  │
  ▼
[Select Priority]
├─► Low
├─► Medium
├─► High
└─► Critical
  │
  ▼
[Enter Reason for Request]
  │
  ▼
[Submit Request]
  │
  ▼
[Save to Database]
├─► Status: PENDING
  │
  ▼
[Notify Admin]
  │
  ▼
<Admin Reviews Request>
  │
  ├─► APPROVE
  │   ├─► Status: APPROVED
  │   ├─► Add Admin Notes
  │   └─► Notify Service Center
  │       │
  │       ▼
  │   <Admin Fulfills?>
  │       │
  │       ├─YES──► [Update Stock]
  │       │        ├─► Status: FULFILLED
  │       │        ├─► Increment Inventory
  │       │        └─► Notify Service Center
  │       │        └─► END
  │       │
  │       └─NO──► [Wait for Fulfillment]
  │
  └─► REJECT
      ├─► Status: REJECTED
      ├─► Add Admin Notes
      └─► Notify Service Center
      └─► END
```

### 5.6 Sequence Diagram - Stock Request & Fulfillment
```
Service Center  Frontend  Backend  Stock DB  Inventory DB  Admin
 │                │         │         │           │          │
 │Request Stock   │         │         │           │          │
 ├───────────────►│         │         │           │          │
 │                │POST     │         │           │          │
 │                │/stock   │         │           │          │
 │                │-requests│         │           │          │
 │                ├────────►│         │           │          │
 │                │         │Save     │           │          │
 │                │         ├────────►│           │          │
 │                │         │Saved    │           │          │
 │                │         │◄────────┤           │          │
 │                │         │Notify   │           │          │
 │                │         ├────────────────────────────────►│
 │                │Success  │         │           │          │
 │                │◄────────┤         │           │          │
 │Confirmation    │         │         │           │          │
 │◄───────────────┤         │         │           │          │
 │                │         │         │           │   Review │
 │                │         │         │           │◄─────────┤
 │                │         │Approve  │           │          │
 │                │         │◄────────────────────────────────┤
 │                │         │Update   │           │          │
 │                │         ├────────►│           │          │
 │                │         │Updated  │           │          │
 │                │         │◄────────┤           │          │
 │                │         │         │           │   Fulfill│
 │                │         │         │           │◄─────────┤
 │                │         │Increment│           │          │
 │                │         │Stock    │           │          │
 │                │         ├─────────────────────►│          │
 │                │         │Updated  │           │          │
 │                │         │◄─────────────────────┤          │
 │Notification    │         │         │           │          │
 │◄───────────────┴─────────┤         │           │          │
```

---

## MODULE 6: INVOICE & PAYMENT

### 6.1 ER Diagram
```
┌─────────────────────────────────────────┐
│          INVOICE ENTITY                 │
├─────────────────────────────────────────┤
│ PK: _id (ObjectId)                      │
│ invoiceNumber (String) UNIQUE           │
│ FK: jobCard (ObjectId) → JobCard._id    │
│ FK: customer (ObjectId) → User._id      │
│ FK: vehicle (ObjectId) → Vehicle._id    │
│ FK: serviceCenter (ObjectId) → User._id │
│ serviceType (String)                    │
│ laborCost (Number)                      │
│ partsCost (Number)                      │
│ subtotal (Number)                       │
│ tax (Number)                            │
│ totalAmount (Number)                    │
│ status (Enum: pending/paid/failed)      │
│ paymentStatus (Enum)                    │
│ paymentMethod (String)                  │
│ paidDate (Date)                         │
│ createdAt (Date)                        │
└─────────────────────────────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────────────────────────────┐
│          JOB CARD ENTITY                │
└─────────────────────────────────────────┘
```

### 6.2 Use Case Diagram
```
        ┌──────────────┐
        │Service Center│
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────┐ ┌──────┐ ┌────────┐
│Generate│ │View│ │Download│ │View    │
│Invoice │ │Invoice│ │PDF   │ │Payment │
│        │ │      │ │      │ │Status  │
└────────┘ └────┘ └──────┘ └────────┘
    │
    └──► [Auto-Calculate]
         ├─► Labor Cost
         ├─► Parts Cost
         ├─► Tax (10%)
         └─► Total Amount

        ┌──────────┐
        │ Customer │
        └────┬─────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
    ▼        ▼        ▼        ▼
┌────┐ ┌──────┐ ┌────────┐ ┌────┐
│View│ │Process│ │View    │ │View│
│Invoice│ │Payment│ │Invoices│ │PDF │
└────┘ └──────┘ └────────┘ └────┘
          │
          └──► [Enter Card Details]
               [Submit Payment]
               [Mock Gateway]

        ┌────────────┐
        │Payment     │
        │Gateway     │
        └────┬───────┘
             │
             ▼
       ┌──────────┐
       │Process   │
       │Payment   │
       │(90% Success)│
       └──────────┘
```

### 6.3 DFD Level 0
```
┌──────────────┐
│Service Center│
└──────┬───────┘
       │
       │ Generate Invoice
       ▼
┌─────────────────┐
│  Invoice &      │
│  Payment        │──────► Invoice Data
│  System         │
└─────────────────┘
       │
       │ Payment Request
       ▼
┌──────────┐
│ Customer │
└──────────┘
```

### 6.4 DFD Level 1
```
┌──────────────┐
│Service Center│
└──────┬───────┘
       │ Generate Request
       ▼
┌─────────────┐      ┌────────────┐      ┌────────────┐
│  1.0        │◄─────│ JobCards   │      │ Invoices   │
│  Generate   │      │ DB         │─────►│ DB         │
│  Invoice    │      └────────────┘      └────────────┘
└─────────────┘
       │ Invoice Details
       ▼
┌──────────┐
│ Customer │
└────┬─────┘
     │ Payment Details
     ▼
┌─────────────┐      ┌────────────┐
│  2.0        │─────►│ Payment    │
│  Process    │      │ Gateway    │
│  Payment    │      └────────────┘
└─────────────┘
     │ Payment Result
     ▼
┌─────────────┐      ┌────────────┐
│  3.0        │◄────►│ Invoices   │
│  Update     │      │ DB         │
│  Status     │      └────────────┘
└─────────────┘
```

### 6.5 Activity Diagram - Invoice Generation & Payment
```
START
  │
  ▼
[Service Completed]
├─► Job Card Status: COMPLETED
  │
  ▼
[Service Center Clicks "Generate Invoice"]
  │
  ▼
[System Fetches Job Card Data]
  │
  ▼
[Calculate Labor Cost]
├─► Sum of (hours × hourly rate) for all tasks
  │
  ▼
[Calculate Parts Cost]
├─► Sum of (quantity × unit price) for all parts
  │
  ▼
[Calculate Subtotal]
├─► Subtotal = Labor Cost + Parts Cost
  │
  ▼
[Calculate Tax]
├─► Tax = Subtotal × 10%
  │
  ▼
[Calculate Total Amount]
├─► Total = Subtotal + Tax
  │
  ▼
[Generate Invoice Number]
├─► Format: INV-YYYY-XXXX
  │
  ▼
[Save Invoice to Database]
├─► Status: PENDING
  │
  ▼
[Update Booking Status]
├─► Status: PAID
  │
  ▼
[Send Invoice to Customer]
├─► Email notification
├─► Available in dashboard
  │
  ▼
[Customer Views Invoice]
  │
  ▼
<Customer Decides to Pay?>
  │
  ├─NO──► [Wait] ──► END
  │
  ▼ YES
[Customer Clicks "Pay Now"]
  │
  ▼
[Enter Payment Details]
├─► Card Number
├─► Cardholder Name
├─► Expiry Date
└─► CVV
  │
  ▼
[Submit Payment]
  │
  ▼
[Mock Payment Gateway Processing]
├─► 90% Success Rate
  │
  ▼
<Payment Successful?>
  │
  ├─NO──► [Update Status: FAILED]
  │        ├─► Show Error Message
  │        └─► Allow Retry
  │        └─► END
  │
  ▼ YES
[Update Invoice Status: PAID]
  │
  ▼
[Generate Transaction ID]
├─► Format: TXN-{timestamp}
  │
  ▼
[Record Payment Date]
  │
  ▼
[Notify Customer & Service Center]
  │
  ▼
[Show Success Message]
  │
  ▼
END
```

### 6.6 Sequence Diagram - Complete Invoice & Payment Flow
```
Service Center  Frontend  Backend  JobCard DB  Invoice DB  Payment GW  Customer
 │                │         │         │           │            │          │
 │Generate        │         │         │           │            │          │
 │Invoice         │         │         │           │            │          │
 ├───────────────►│         │         │           │            │          │
 │                │POST     │         │           │            │          │
 │                │/invoices│         │           │            │          │
 │                ├────────►│         │           │            │          │
 │                │         │Fetch    │           │            │          │
 │                │         │JobCard  │           │            │          │
 │                │         ├────────►│           │            │          │
 │                │         │Data     │           │            │          │
 │                │         │◄────────┤           │            │          │
 │                │         │Calculate│           │            │          │
 │                │         │Costs    │           │            │          │
 │                │         │         │           │            │          │
 │                │         │Save     │           │            │          │
 │                │         │Invoice  │           │            │          │
 │                │         ├─────────────────────►│            │          │
 │                │         │Saved    │           │            │          │
 │                │         │◄─────────────────────┤            │          │
 │                │Success  │         │           │            │          │
 │                │◄────────┤         │           │            │          │
 │Invoice Created │         │         │           │            │          │
 │◄───────────────┤         │         │           │            │          │
 │                │         │         │           │            │   Notify │
 │                │         │         │           │            │◄─────────┤
 │                │         │         │           │            │          │
 │                │         │         │           │            │   View   │
 │                │         │         │           │            │◄─────────┤
 │                │         │         │           │            │          │
 │                │         │         │           │            │   Pay    │
 │                │         │         │           │            │◄─────────┤
 │                │         │POST     │           │            │          │
 │                │         │/process │           │            │          │
 │                │         │-payment │           │            │          │
 │                │         │◄────────────────────────────────────────────┤
 │                │         │         │           │   Process  │          │
 │                │         ├────────────────────────────────►│          │
 │                │         │         │           │   Result   │          │
 │                │         │◄────────────────────────────────┤          │
 │                │         │Update   │           │            │          │
 │                │         │Status   │           │            │          │
 │                │         ├─────────────────────►│            │          │
 │                │         │Updated  │           │            │          │
 │                │         │◄─────────────────────┤            │          │
 │                │         │         │           │            │   Success│
 │                │         ├────────────────────────────────────────────►│
 │Notification    │         │         │           │            │          │
 │◄───────────────┴─────────┤         │           │            │          │
```

### 6.7 Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│        INVOICE & PAYMENT MODULE ARCHITECTURE        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Invoice      │  │ Payment      │                │
│  │ Detail View  │  │ Page         │                │
│  └──────────────┘  └──────────────┘                │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────┐
│  API LAYER                                          │
│  ┌──────────────────────────────────────────────┐  │
│  │ Invoice Routes (/api/invoices)               │  │
│  │ • POST   /                                   │  │
│  │ • GET    /                                   │  │
│  │ • GET    /:id                                │  │
│  │ • POST   /:id/process-payment                │  │
│  │ • PATCH  /:id/payment                        │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Business Logic
                     ▼
┌─────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                               │
│  ┌──────────────────────────────────────────────┐  │
│  │ • Auto-generate Invoice Number               │  │
│  │ • Calculate Labor Cost from Job Card         │  │
│  │ • Calculate Parts Cost from Job Card         │  │
│  │ • Calculate Tax (10%)                        │  │
│  │ • Calculate Total Amount                     │  │
│  │ • Mock Payment Gateway (90% success)         │  │
│  │ • Generate Transaction ID                    │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────┐
│  DATA LAYER                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ Invoice Model                                │  │
│  │ • Schema Definition                          │  │
│  │ • Pre-save hooks for invoice number          │  │
│  │ • Payment status tracking                    │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  DATABASE (MongoDB)                                 │
│  • invoices collection                              │
│  • jobcards collection (for cost calculation)       │
│  • bookings collection (for status update)          │
└─────────────────────────────────────────────────────┘
```
