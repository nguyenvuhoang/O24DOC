<h1 align="center">O24 Document</h1>

<p align="center">
  📘 Official Documentation for O24 Platform – OpenAPI · Core Banking · Wallet · Transaction Systems
</p>

<div align="center">
  <b>Enterprise-ready · Clean Architecture · DDD · Microservices · Event-driven</b>
</div>

---

## 🌐 Giới thiệu

**O24 Platform** là một hệ sinh thái **OpenAPI & Transaction Platform** được thiết kế cho:

- Core Banking / Fintech / Wallet / Payment
- Hệ thống giao dịch thời gian thực
- Kiến trúc microservices, dễ mở rộng
- Tích hợp đa hệ thống (Oracle Core, SQL Server, PostgreSQL, External APIs)

📌 **O24 Document** là cổng tài liệu chính thức, giúp:

- Developer hiểu rõ kiến trúc & cách lập trình
- BA / SA nắm được nghiệp vụ & domain
- DevOps triển khai & vận hành hệ thống
- Đội tích hợp (Integration) dùng API đúng chuẩn

---

## 🧱 Tổng quan kiến trúc O24

### 1️⃣ Kiến trúc tổng thể

┌──────────────────────┐
│ Client Applications │
│ (Web / Mobile / App)│
└──────────┬───────────┘
│
▼
┌──────────────────────┐
│ API Gateway / BFF │
│ (Auth, RateLimit) │
└──────────┬───────────┘
│
▼
┌──────────────────────────────────────────────┐
│ O24 Microservices │
│ │
│ • Wallet Service │
│ • Deposit / Loan Service │
│ • Transaction Service (DTS) │
│ • Core Banking Gateway (CBG) │
│ • CMS / Config / Media │
│ • Notification (SMS / Push / Email) │
│ • Reporting / CDC / Audit │
└──────────┬───────────────────────────────────┘
│
▼
┌──────────────────────────────────────────────┐
│ Core & External Systems │
│ • Oracle Core Banking (O9) │
│ • SQL Server / PostgreSQL │
│ • RabbitMQ / Kafka │
│ • Firebase / SMS Provider │
└──────────────────────────────────────────────┘

---

## 🧠 Triết lý thiết kế

O24 được xây dựng dựa trên các nguyên tắc:

- **Clean Architecture**
- **DDD (Domain-Driven Design)**
- **Transaction-driven System**
- **Event-driven Integration**
- **Enterprise Security & Audit**

> 👉 Business logic luôn độc lập với framework, database, UI.

---

## 📦 Cấu trúc dự án (Backend – .NET)

src/
├── O24OpenAPI.Domain # Domain Models, Aggregates, ValueObjects
├── O24OpenAPI.Application # UseCases, Services, DTOs
├── O24OpenAPI.Infrastructure # DB, External APIs, Messaging
├── O24OpenAPI.WebAPI # Controllers, Middleware
├── O24OpenAPI.Shared # Common, Extensions, Constants
└── O24OpenAPI.Migrations # FluentMigrator Builders

### Mapping Clean Architecture

| Layer          | Mục đích                |
| -------------- | -------------------------- |
| Domain         | Business rules thuần      |
| Application    | Use case, orchestration    |
| Infrastructure | DB, Core Banking, External |
| WebAPI         | REST / gRPC endpoints      |

---

## 🧩 Domain-Driven Design (DDD)

### Ví dụ Domain: Wallet

Wallet
├── WalletAggregate
│ ├── WalletId
│ ├── Balance
│ ├── Currency
│ ├── Status
│ └── WalletTransactions

### Nguyên tắc

- Aggregate kiểm soát consistency
- Không expose Entity trực tiếp ra ngoài
- Logic nằm trong Domain, không nằm ở Controller

---

## 🔁 Transaction-driven Flow

Ví dụ: **Wallet → Core Banking Transaction**

Client
→ API
→ Validate
→ Create Transaction
→ Push Queue
→ Core Gateway
→ Oracle Core
→ Callback
→ Update Status

✔ Retry
✔ Fallback
✔ Idempotency
✔ Audit log

---

## 📡 Event & Messaging

O24 sử dụng:

- **RabbitMQ** cho async processing
- **CDC (Change Data Capture)** cho reporting
- **Outbox Pattern** cho consistency

Ví dụ Event:

```json
{
  "event": "WALLET_TRANSFER_COMPLETED",
  "transactionId": "UUID",
  "amount": 100000,
  "currency": "VND"
}
```

## 🔐 Security & Authentication

* JWT / OAuth2 / API Key
* Device binding

* OTP / Smart OTP
* Role-based Access Control

* Full Audit Trail

## 🗄 Database Strategy

| Database   | Mục đích              |
| ---------- | ------------------------ |
| Oracle     | Core Banking             |
| SQL Server | Transaction, Wallet, CMS |
| PostgreSQL | Reporting, Analytics     |
| Redis      | Cache, Session           |

Migration dùng FluentMigrator với Builder pattern:

Create.Table("D_WALLET")
  .WithColumn("WalletId").AsGuid().PrimaryKey()
  .WithColumn("Balance").AsDecimal()
  .WithColumn("Currency").AsString(3);

## 🧪 Logging & Observability

Serilog

* Grafana + Loki
* Distributed Trace

* Transaction Trace ID

Log format chuẩn:

*[Service] [TraceId] [Level] Message*

## 📘 O24 Document Structure

docs/
├── introduction
├── architecture
├── domains
│   ├── wallet
│   ├── transaction
│   ├── deposit
├── api-reference
├── database
├── dev-guide
├── deployment
└── faq

## 🚀 Local Development (Docs)

pnpm install
pnpm dev
Truy cập: [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

* Frontend Docs: Nextra 4, Next.js
* Backend: .NET 8/9/10

* Database: Oracle, SQL Server, PostgreSQL
* Messaging: RabbitMQ

* Infra: Docker, Nginx, Linux
* CI/CD: GitLab / GitHub Action

## 📌 Định hướng mở rộng

* AI / RAG / Knowledge Base
* Rule Engine

* Multi-tenant
* OpenAPI Marketplace

* Sandbox & Developer Portal

## 📄 License

O24 Platform – Internal / Enterprise License
© O24 / VKNIGHT / JITS

## 🤝 Đóng góp

Follow coding standards
Respect domain boundaries
Documentation-first mindset

O24 – Always Ready.
