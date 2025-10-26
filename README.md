# E-efimerevon-inv-managment

**What it is:** a small, production-style pharmacy platform I built end-to-end:
- **Citizen Android app (Kotlin/Compose):** map with **on-duty pharmacies** and **live availability** (counts).
- **Desktop inventory app (JavaFX):** quick **arrivals/sales** via barcode scanners, search, and drawer management (**A–F × 1–6**).
- **Server (Ktor) + Firestore:** server-authoritative updates and a **public, counts-only mirror** for the mobile app.
- **Smart Security Camera (JavaFX + OpenCV):** local face recognition demo, launched and embedded from the desktop app.

> This repo is a **visual overview** only (no code, no secrets). It exists to show the product flow and design decisions.

---

## How it works (90 seconds)

1. **Staff updates stock** on the **desktop app** (Arrival/Sale) using a barcode scanner or a phone scanner.
2. The **Ktor service** validates the request, runs a Firestore **transaction**, appends an **immutable log**, and **overwrites** the public mirror document.
3. The **citizen Android app** reads the **public mirror** for the live pharmacy and shows **live counts**.
4. **Smart Security Camera** can be launched from the desktop app for a check-in/attendance demo and shows live stream + recognition locally.

**Privacy by design:** the mobile app sees **only counts**—**no drawers, no private locations**.

---

## Architecture

```mermaid
flowchart LR
  subgraph Staff Desktop (JavaFX)
    D1[Inventory UI<br/>Arrival/Sale/Adjust]
    D2[Drawer Grid A–F × 1–6]
    D3[Scanner Helper QR]
    D4[Launch Smart Camera]
  end

  subgraph Smart Camera (Local)
    C1[JavaFX + OpenCV]
    C2[Embedded Ktor:<br/>/camera/live.mjpeg,<br/>/events/live,<br/>/train,/recognize]
  end

  subgraph Server (Ktor)
    S1[/POST /inventory/arrival|sale/]
    S2[Transaction:<br/>validate → update stock → log → overwrite public mirror]
  end

  subgraph Firestore (Cloud)
    F1[(pharmacies/{id}/stock)]
    F2[(public_stock/{id}<br/>counts-only)]
  end

  subgraph Citizen Android App (Compose)
    A1[Map: on-duty pharmacies]
    A2[Bottom sheet: live counts]
  end

  D1 -->|HTTP| S1
  D3 -.->|Barcode/Phone URL| S1
  S1 --> S2 --> F1
  S2 --> F2
  A1 -->|read| F2
  A2 -->|read| F2
  D4 --> C1
  C1 --> C2
