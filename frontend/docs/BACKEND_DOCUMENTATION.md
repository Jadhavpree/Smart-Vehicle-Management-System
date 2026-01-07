# SVMMS Backend Documentation
## Smart Vehicle Maintenance and Service Management System

### Technology Stack
- **Framework**: Spring Boot 3.2.x
- **Database**: MySQL 8.0+
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **Java Version**: JDK 17+

---

## 1. Project Structure

```
svmms-backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── svmms/
│       │           ├── SvmmsApplication.java
│       │           ├── config/
│       │           │   ├── CorsConfig.java
│       │           │   ├── SecurityConfig.java
│       │           │   └── JwtConfig.java
│       │           ├── controller/
│       │           │   ├── AuthController.java
│       │           │   ├── UserController.java
│       │           │   ├── VehicleController.java
│       │           │   ├── BookingController.java
│       │           │   ├── JobCardController.java
│       │           │   ├── InventoryController.java
│       │           │   ├── InvoiceController.java
│       │           │   └── AnalyticsController.java
│       │           ├── dto/
│       │           │   ├── request/
│       │           │   └── response/
│       │           ├── entity/
│       │           │   ├── User.java
│       │           │   ├── Vehicle.java
│       │           │   ├── ServiceBooking.java
│       │           │   ├── JobCard.java
│       │           │   ├── JobCardTask.java
│       │           │   ├── SparePart.java
│       │           │   ├── Invoice.java
│       │           │   ├── InvoiceItem.java
│       │           │   ├── Supplier.java
│       │           │   └── Review.java
│       │           ├── enums/
│       │           │   ├── UserRole.java
│       │           │   ├── BookingStatus.java
│       │           │   ├── JobCardStatus.java
│       │           │   └── PaymentStatus.java
│       │           ├── exception/
│       │           │   ├── GlobalExceptionHandler.java
│       │           │   └── ResourceNotFoundException.java
│       │           ├── repository/
│       │           │   ├── UserRepository.java
│       │           │   ├── VehicleRepository.java
│       │           │   ├── BookingRepository.java
│       │           │   ├── JobCardRepository.java
│       │           │   ├── SparePartRepository.java
│       │           │   ├── InvoiceRepository.java
│       │           │   ├── SupplierRepository.java
│       │           │   └── ReviewRepository.java
│       │           ├── security/
│       │           │   ├── JwtTokenProvider.java
│       │           │   ├── JwtAuthenticationFilter.java
│       │           │   └── CustomUserDetailsService.java
│       │           └── service/
│       │               ├── AuthService.java
│       │               ├── UserService.java
│       │               ├── VehicleService.java
│       │               ├── BookingService.java
│       │               ├── JobCardService.java
│       │               ├── InventoryService.java
│       │               ├── InvoiceService.java
│       │               ├── NotificationService.java
│       │               └── AnalyticsService.java
│       └── resources/
│           ├── application.properties
│           └── application-dev.properties
├── pom.xml
└── README.md
```

---

## 2. Database Configuration

### application.properties

```properties
# Server Configuration
server.port=8080

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/svmms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-should-be-at-least-256-bits-long-for-security
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.svmms=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## 3. Entity Classes

### User.java

```java
package com.svmms.entity;

import com.svmms.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String phone;
    
    private String address;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    private String companyName; // For service center users
    
    private boolean isActive = true;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Vehicle.java

```java
package com.svmms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String make;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private String year;
    
    @Column(nullable = false, unique = true, length = 17)
    private String vin;
    
    @Column(nullable = false, unique = true)
    private String licensePlate;
    
    private String color;
    
    private Integer mileage;
    
    private String engineType;
    
    private String transmissionType;
    
    private String fuelType;
    
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<ServiceBooking> bookings;
    
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<JobCard> jobCards;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### ServiceBooking.java

```java
package com.svmms.entity;

import com.svmms.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "service_bookings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ServiceBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @Column(nullable = false)
    private String serviceType;
    
    private String description;
    
    @Column(nullable = false)
    private LocalDate preferredDate;
    
    @Column(nullable = false)
    private LocalTime preferredTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    private String rejectionReason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @OneToOne(mappedBy = "booking")
    private JobCard jobCard;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### JobCard.java

```java
package com.svmms.entity;

import com.svmms.enums.JobCardStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_cards")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class JobCard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String jobCardNumber;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private ServiceBooking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_mechanic_id")
    private User assignedMechanic;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobCardStatus status = JobCardStatus.CREATED;
    
    private Integer progressPercentage = 0;
    
    private String priority;
    
    @OneToMany(mappedBy = "jobCard", cascade = CascadeType.ALL)
    private List<JobCardTask> tasks;
    
    @ManyToMany
    @JoinTable(
        name = "job_card_spare_parts",
        joinColumns = @JoinColumn(name = "job_card_id"),
        inverseJoinColumns = @JoinColumn(name = "spare_part_id")
    )
    private List<SparePart> usedParts;
    
    private BigDecimal laborCost;
    
    private BigDecimal partsCost;
    
    private BigDecimal totalCost;
    
    private String notes;
    
    private LocalDateTime estimatedCompletion;
    
    private LocalDateTime actualCompletion;
    
    @OneToOne(mappedBy = "jobCard")
    private Invoice invoice;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### SparePart.java

```java
package com.svmms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "spare_parts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SparePart {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String sku;
    
    private String category;
    
    private String description;
    
    @Column(nullable = false)
    private Integer stockQuantity;
    
    @Column(nullable = false)
    private Integer reorderLevel;
    
    @Column(nullable = false)
    private BigDecimal unitPrice;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Invoice.java

```java
package com.svmms.entity;

import com.svmms.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String invoiceNumber;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_card_id", nullable = false)
    private JobCard jobCard;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<InvoiceItem> items;
    
    private BigDecimal subtotal;
    
    private BigDecimal taxAmount;
    
    private BigDecimal discountAmount;
    
    @Column(nullable = false)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    private String paymentMethod;
    
    private LocalDateTime paidAt;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### Review.java

```java
package com.svmms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_card_id", nullable = false)
    private JobCard jobCard;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mechanic_id")
    private User mechanic;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @Column(length = 1000)
    private String comment;
    
    private Integer helpfulCount = 0;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

---

## 4. Enums

### UserRole.java

```java
package com.svmms.enums;

public enum UserRole {
    CUSTOMER,
    MECHANIC,
    ADMIN
}
```

### BookingStatus.java

```java
package com.svmms.enums;

public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED,
    COMPLETED
}
```

### JobCardStatus.java

```java
package com.svmms.enums;

public enum JobCardStatus {
    CREATED,
    IN_PROGRESS,
    ON_HOLD,
    COMPLETED,
    CANCELLED
}
```

### PaymentStatus.java

```java
package com.svmms.enums;

public enum PaymentStatus {
    PENDING,
    PAID,
    PARTIALLY_PAID,
    REFUNDED,
    FAILED
}
```

---

## 5. Repository Interfaces

### UserRepository.java

```java
package com.svmms.repository;

import com.svmms.entity.User;
import com.svmms.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByRole(UserRole role);
    List<User> findByRoleAndIsActiveTrue(UserRole role);
}
```

### VehicleRepository.java

```java
package com.svmms.repository;

import com.svmms.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);
    Optional<Vehicle> findByVin(String vin);
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    boolean existsByVin(String vin);
    boolean existsByLicensePlate(String licensePlate);
}
```

### BookingRepository.java

```java
package com.svmms.repository;

import com.svmms.entity.ServiceBooking;
import com.svmms.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<ServiceBooking, Long> {
    List<ServiceBooking> findByCustomerId(Long customerId);
    List<ServiceBooking> findByStatus(BookingStatus status);
    List<ServiceBooking> findByPreferredDate(LocalDate date);
    
    @Query("SELECT b FROM ServiceBooking b WHERE b.status = 'PENDING' ORDER BY b.createdAt DESC")
    List<ServiceBooking> findPendingBookings();
    
    @Query("SELECT COUNT(b) FROM ServiceBooking b WHERE b.preferredDate = :date")
    Long countBookingsForDate(LocalDate date);
}
```

### JobCardRepository.java

```java
package com.svmms.repository;

import com.svmms.entity.JobCard;
import com.svmms.enums.JobCardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobCardRepository extends JpaRepository<JobCard, Long> {
    Optional<JobCard> findByJobCardNumber(String jobCardNumber);
    List<JobCard> findByAssignedMechanicId(Long mechanicId);
    List<JobCard> findByStatus(JobCardStatus status);
    List<JobCard> findByCustomerId(Long customerId);
    
    @Query("SELECT j FROM JobCard j WHERE j.status IN ('CREATED', 'IN_PROGRESS') ORDER BY j.createdAt DESC")
    List<JobCard> findActiveJobCards();
    
    @Query("SELECT COUNT(j) FROM JobCard j WHERE j.assignedMechanic.id = :mechanicId AND j.status = 'COMPLETED'")
    Long countCompletedJobsByMechanic(Long mechanicId);
    
    @Query("SELECT j FROM JobCard j WHERE j.createdAt BETWEEN :startDate AND :endDate")
    List<JobCard> findJobCardsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
```

### SparePartRepository.java

```java
package com.svmms.repository;

import com.svmms.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findBySku(String sku);
    List<SparePart> findByCategory(String category);
    
    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity <= s.reorderLevel")
    List<SparePart> findLowStockParts();
    
    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity = 0")
    List<SparePart> findOutOfStockParts();
    
    List<SparePart> findBySupplierId(Long supplierId);
}
```

---

## 6. Service Layer

### AuthService.java

```java
package com.svmms.service;

import com.svmms.dto.request.LoginRequest;
import com.svmms.dto.request.SignupRequest;
import com.svmms.dto.response.AuthResponse;
import com.svmms.entity.User;
import com.svmms.exception.BadRequestException;
import com.svmms.repository.UserRepository;
import com.svmms.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .companyName(request.getCompanyName())
                .isActive(true)
                .build();
        
        userRepository.save(user);
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
```

### VehicleService.java

```java
package com.svmms.service;

import com.svmms.dto.request.VehicleRequest;
import com.svmms.dto.response.VehicleResponse;
import com.svmms.entity.User;
import com.svmms.entity.Vehicle;
import com.svmms.exception.BadRequestException;
import com.svmms.exception.ResourceNotFoundException;
import com.svmms.repository.UserRepository;
import com.svmms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {
    
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public VehicleResponse addVehicle(Long userId, VehicleRequest request) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (vehicleRepository.existsByVin(request.getVin())) {
            throw new BadRequestException("Vehicle with this VIN already exists");
        }
        
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new BadRequestException("Vehicle with this license plate already exists");
        }
        
        Vehicle vehicle = Vehicle.builder()
                .make(request.getMake())
                .model(request.getModel())
                .year(request.getYear())
                .vin(request.getVin())
                .licensePlate(request.getLicensePlate())
                .color(request.getColor())
                .mileage(request.getMileage())
                .engineType(request.getEngineType())
                .transmissionType(request.getTransmissionType())
                .fuelType(request.getFuelType())
                .notes(request.getNotes())
                .owner(owner)
                .build();
        
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return mapToResponse(savedVehicle);
    }
    
    public List<VehicleResponse> getVehiclesByOwner(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        return mapToResponse(vehicle);
    }
    
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setColor(request.getColor());
        vehicle.setMileage(request.getMileage());
        vehicle.setEngineType(request.getEngineType());
        vehicle.setTransmissionType(request.getTransmissionType());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setNotes(request.getNotes());
        
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return mapToResponse(updatedVehicle);
    }
    
    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle not found");
        }
        vehicleRepository.deleteById(id);
    }
    
    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .make(vehicle.getMake())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .vin(vehicle.getVin())
                .licensePlate(vehicle.getLicensePlate())
                .color(vehicle.getColor())
                .mileage(vehicle.getMileage())
                .engineType(vehicle.getEngineType())
                .transmissionType(vehicle.getTransmissionType())
                .fuelType(vehicle.getFuelType())
                .notes(vehicle.getNotes())
                .ownerName(vehicle.getOwner().getName())
                .createdAt(vehicle.getCreatedAt())
                .build();
    }
}
```

### InventoryService.java

```java
package com.svmms.service;

import com.svmms.dto.request.SparePartRequest;
import com.svmms.dto.response.SparePartResponse;
import com.svmms.entity.SparePart;
import com.svmms.entity.Supplier;
import com.svmms.exception.BadRequestException;
import com.svmms.exception.ResourceNotFoundException;
import com.svmms.repository.SparePartRepository;
import com.svmms.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {
    
    private final SparePartRepository sparePartRepository;
    private final SupplierRepository supplierRepository;
    
    public List<SparePartResponse> getAllParts() {
        return sparePartRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<SparePartResponse> getLowStockParts() {
        return sparePartRepository.findLowStockParts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public SparePartResponse addPart(SparePartRequest request) {
        if (sparePartRepository.findBySku(request.getSku()).isPresent()) {
            throw new BadRequestException("Part with this SKU already exists");
        }
        
        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        }
        
        SparePart part = SparePart.builder()
                .name(request.getName())
                .sku(request.getSku())
                .category(request.getCategory())
                .description(request.getDescription())
                .stockQuantity(request.getStockQuantity())
                .reorderLevel(request.getReorderLevel())
                .unitPrice(request.getUnitPrice())
                .supplier(supplier)
                .build();
        
        SparePart savedPart = sparePartRepository.save(part);
        return mapToResponse(savedPart);
    }
    
    @Transactional
    public void decrementStock(Long partId, Integer quantity) {
        SparePart part = sparePartRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found"));
        
        if (part.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }
        
        part.setStockQuantity(part.getStockQuantity() - quantity);
        sparePartRepository.save(part);
    }
    
    @Transactional
    public void incrementStock(Long partId, Integer quantity) {
        SparePart part = sparePartRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found"));
        
        part.setStockQuantity(part.getStockQuantity() + quantity);
        sparePartRepository.save(part);
    }
    
    private SparePartResponse mapToResponse(SparePart part) {
        String stockStatus = "In Stock";
        if (part.getStockQuantity() == 0) {
            stockStatus = "Out of Stock";
        } else if (part.getStockQuantity() <= part.getReorderLevel()) {
            stockStatus = "Low Stock";
        }
        
        return SparePartResponse.builder()
                .id(part.getId())
                .name(part.getName())
                .sku(part.getSku())
                .category(part.getCategory())
                .description(part.getDescription())
                .stockQuantity(part.getStockQuantity())
                .reorderLevel(part.getReorderLevel())
                .unitPrice(part.getUnitPrice())
                .stockStatus(stockStatus)
                .supplierName(part.getSupplier() != null ? part.getSupplier().getName() : null)
                .build();
    }
}
```

---

## 7. REST Controllers

### AuthController.java

```java
package com.svmms.controller;

import com.svmms.dto.request.LoginRequest;
import com.svmms.dto.request.SignupRequest;
import com.svmms.dto.response.AuthResponse;
import com.svmms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
```

### VehicleController.java

```java
package com.svmms.controller;

import com.svmms.dto.request.VehicleRequest;
import com.svmms.dto.response.VehicleResponse;
import com.svmms.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleController {
    
    private final VehicleService vehicleService;
    
    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> addVehicle(
            @PathVariable Long userId,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.addVehicle(userId, request));
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByOwner(@PathVariable Long userId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByOwner(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
```

### BookingController.java

```java
package com.svmms.controller;

import com.svmms.dto.request.BookingRequest;
import com.svmms.dto.response.BookingResponse;
import com.svmms.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }
    
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getPendingBookings() {
        return ResponseEntity.ok(bookingService.getPendingBookings());
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long id,
            @RequestParam Long approvedById) {
        return ResponseEntity.ok(bookingService.approveBooking(id, approvedById));
    }
    
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, reason));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
```

### JobCardController.java

```java
package com.svmms.controller;

import com.svmms.dto.request.JobCardRequest;
import com.svmms.dto.request.JobCardUpdateRequest;
import com.svmms.dto.response.JobCardResponse;
import com.svmms.service.JobCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-cards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobCardController {
    
    private final JobCardService jobCardService;
    
    @PostMapping
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<JobCardResponse> createJobCard(@Valid @RequestBody JobCardRequest request) {
        return ResponseEntity.ok(jobCardService.createJobCard(request));
    }
    
    @GetMapping("/active")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<List<JobCardResponse>> getActiveJobCards() {
        return ResponseEntity.ok(jobCardService.getActiveJobCards());
    }
    
    @GetMapping("/mechanic/{mechanicId}")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<List<JobCardResponse>> getMechanicJobCards(@PathVariable Long mechanicId) {
        return ResponseEntity.ok(jobCardService.getJobCardsByMechanic(mechanicId));
    }
    
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobCardResponse>> getCustomerJobCards(@PathVariable Long customerId) {
        return ResponseEntity.ok(jobCardService.getJobCardsByCustomer(customerId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JobCardResponse> getJobCardById(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.getJobCardById(id));
    }
    
    @PutMapping("/{id}/progress")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<JobCardResponse> updateProgress(
            @PathVariable Long id,
            @RequestParam Integer progress) {
        return ResponseEntity.ok(jobCardService.updateProgress(id, progress));
    }
    
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<JobCardResponse> completeJobCard(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.completeJobCard(id));
    }
}
```

### InventoryController.java

```java
package com.svmms.controller;

import com.svmms.dto.request.SparePartRequest;
import com.svmms.dto.response.SparePartResponse;
import com.svmms.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    @GetMapping
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<List<SparePartResponse>> getAllParts() {
        return ResponseEntity.ok(inventoryService.getAllParts());
    }
    
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<List<SparePartResponse>> getLowStockParts() {
        return ResponseEntity.ok(inventoryService.getLowStockParts());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SparePartResponse> addPart(@Valid @RequestBody SparePartRequest request) {
        return ResponseEntity.ok(inventoryService.addPart(request));
    }
    
    @PutMapping("/{id}/decrement")
    @PreAuthorize("hasRole('MECHANIC') or hasRole('ADMIN')")
    public ResponseEntity<Void> decrementStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        inventoryService.decrementStock(id, quantity);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/increment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> incrementStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        inventoryService.incrementStock(id, quantity);
        return ResponseEntity.ok().build();
    }
}
```

### AnalyticsController.java

```java
package com.svmms.controller;

import com.svmms.dto.response.AnalyticsResponse;
import com.svmms.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsResponse> getDashboardAnalytics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics(startDate, endDate));
    }
    
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenueAnalytics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics(startDate, endDate));
    }
    
    @GetMapping("/mechanic-performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMechanicPerformance() {
        return ResponseEntity.ok(analyticsService.getMechanicPerformance());
    }
    
    @GetMapping("/service-trends")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getServiceTrends() {
        return ResponseEntity.ok(analyticsService.getServiceTrends());
    }
}
```

---

## 8. Security Configuration

### SecurityConfig.java

```java
package com.svmms.config;

import com.svmms.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

### CorsConfig.java

```java
package com.svmms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

### JwtTokenProvider.java

```java
package com.svmms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }
}
```

---

## 9. API Endpoints Summary

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | User login | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/users | Get all users | Admin |
| GET | /api/users/{id} | Get user by ID | Admin |
| PUT | /api/users/{id} | Update user | Admin |
| DELETE | /api/users/{id} | Delete user | Admin |

### Vehicles
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/vehicles/user/{userId} | Add vehicle | Customer |
| GET | /api/vehicles/user/{userId} | Get user's vehicles | Customer |
| GET | /api/vehicles/{id} | Get vehicle by ID | All |
| PUT | /api/vehicles/{id} | Update vehicle | Customer |
| DELETE | /api/vehicles/{id} | Delete vehicle | Customer |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/bookings | Create booking | Customer |
| GET | /api/bookings/customer/{id} | Get customer bookings | Customer |
| GET | /api/bookings/pending | Get pending bookings | Mechanic, Admin |
| PUT | /api/bookings/{id}/approve | Approve booking | Mechanic, Admin |
| PUT | /api/bookings/{id}/reject | Reject booking | Mechanic, Admin |
| DELETE | /api/bookings/{id} | Cancel booking | Customer |

### Job Cards
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/job-cards | Create job card | Mechanic |
| GET | /api/job-cards/active | Get active job cards | Mechanic, Admin |
| GET | /api/job-cards/{id} | Get job card by ID | All |
| PUT | /api/job-cards/{id}/progress | Update progress | Mechanic |
| PUT | /api/job-cards/{id}/complete | Complete job card | Mechanic |

### Inventory
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/inventory | Get all parts | Mechanic, Admin |
| GET | /api/inventory/low-stock | Get low stock parts | Mechanic, Admin |
| POST | /api/inventory | Add spare part | Admin |
| PUT | /api/inventory/{id}/decrement | Decrease stock | Mechanic |
| PUT | /api/inventory/{id}/increment | Increase stock | Admin |

### Invoices
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/invoices/{id} | Get invoice by ID | All |
| GET | /api/invoices/customer/{id} | Get customer invoices | Customer |
| PUT | /api/invoices/{id}/pay | Process payment | Customer |

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/analytics/dashboard | Dashboard stats | Admin |
| GET | /api/analytics/revenue | Revenue analytics | Admin |
| GET | /api/analytics/mechanic-performance | Mechanic stats | Admin |
| GET | /api/analytics/service-trends | Service trends | Admin |

---

## 10. pom.xml Dependencies

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.svmms</groupId>
    <artifactId>svmms-backend</artifactId>
    <version>1.0.0</version>
    <name>SVMMS Backend</name>
    
    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.11.5</jjwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 11. Database Schema (MySQL)

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS svmms_db;
USE svmms_db;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    address TEXT,
    role ENUM('CUSTOMER', 'MECHANIC', 'ADMIN') NOT NULL,
    company_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year VARCHAR(4) NOT NULL,
    vin VARCHAR(17) NOT NULL UNIQUE,
    license_plate VARCHAR(15) NOT NULL UNIQUE,
    color VARCHAR(30),
    mileage INT,
    engine_type VARCHAR(50),
    transmission_type VARCHAR(50),
    fuel_type VARCHAR(30),
    notes TEXT,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service Bookings Table
CREATE TABLE service_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    approved_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Job Cards Table
CREATE TABLE job_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_card_number VARCHAR(20) NOT NULL UNIQUE,
    booking_id BIGINT,
    vehicle_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    assigned_mechanic_id BIGINT,
    status ENUM('CREATED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED') DEFAULT 'CREATED',
    progress_percentage INT DEFAULT 0,
    priority VARCHAR(20),
    labor_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    notes TEXT,
    estimated_completion DATETIME,
    actual_completion DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES service_bookings(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (assigned_mechanic_id) REFERENCES users(id)
);

-- Suppliers Table
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    category VARCHAR(100),
    rating DECIMAL(2,1),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spare Parts Table
CREATE TABLE spare_parts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50),
    description TEXT,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 10,
    unit_price DECIMAL(10,2) NOT NULL,
    supplier_id BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Invoices Table
CREATE TABLE invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    job_card_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'FAILED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    paid_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES job_cards(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Reviews Table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    job_card_id BIGINT NOT NULL,
    mechanic_id BIGINT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (job_card_id) REFERENCES job_cards(id),
    FOREIGN KEY (mechanic_id) REFERENCES users(id)
);

-- Create Indexes for better performance
CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_bookings_customer ON service_bookings(customer_id);
CREATE INDEX idx_bookings_status ON service_bookings(status);
CREATE INDEX idx_jobcards_mechanic ON job_cards(assigned_mechanic_id);
CREATE INDEX idx_jobcards_status ON job_cards(status);
CREATE INDEX idx_spareparts_category ON spare_parts(category);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
```

---

## 12. Running the Application

### Prerequisites
1. JDK 17+
2. MySQL 8.0+
3. Maven 3.8+

### Steps

1. **Create MySQL Database**
```bash
mysql -u root -p
CREATE DATABASE svmms_db;
```

2. **Configure application.properties**
Update the database credentials in `src/main/resources/application.properties`

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
mvn spring-boot:run
```

5. **Access the API**
- Base URL: `http://localhost:8080/api`
- Swagger UI (if configured): `http://localhost:8080/swagger-ui.html`

---

## 13. Frontend Integration (Axios)

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

// Vehicle API
export const vehicleAPI = {
  getByOwner: (ownerId: number) => api.get(`/vehicles/user/${ownerId}`),
  create: (ownerId: number, data: any) => api.post(`/vehicles/user/${ownerId}`, data),
  update: (id: number, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
};

// Booking API
export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  getByCustomer: (customerId: number) => api.get(`/bookings/customer/${customerId}`),
  getPending: () => api.get('/bookings/pending'),
  approve: (id: number, approvedById: number) =>
    api.put(`/bookings/${id}/approve?approvedById=${approvedById}`),
  reject: (id: number, reason: string) =>
    api.put(`/bookings/${id}/reject?reason=${reason}`),
};

// Job Card API
export const jobCardAPI = {
  getActive: () => api.get('/job-cards/active'),
  getById: (id: number) => api.get(`/job-cards/${id}`),
  updateProgress: (id: number, progress: number) =>
    api.put(`/job-cards/${id}/progress?progress=${progress}`),
  complete: (id: number) => api.put(`/job-cards/${id}/complete`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  addPart: (data: any) => api.post('/inventory', data),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (startDate?: string, endDate?: string) =>
    api.get('/analytics/dashboard', { params: { startDate, endDate } }),
  getRevenue: (startDate?: string, endDate?: string) =>
    api.get('/analytics/revenue', { params: { startDate, endDate } }),
};

export default api;
```

---

This documentation provides a complete blueprint for implementing the SVMMS backend using Spring Boot and MySQL. You can extend and customize it based on your specific requirements.
