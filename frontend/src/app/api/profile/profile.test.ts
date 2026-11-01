import { describe, expect, it } from "vitest";
import { GET, POST, PATCH } from "./route";

describe("/api/profile route", () => {
  it("rejects profile setup missing class / grade", async () => {
    const req = new Request("http://localhost:3000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Kavitha" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Name and grade");
  });

  it("rejects Class 11 and Class 12 when seniorGroup stream is missing", async () => {
    const req11 = new Request("http://localhost:3000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Arun",
        grade: 11,
        board: "tn_state",
      }),
    });
    const res11 = await POST(req11);
    expect(res11.status).toBe(400);
    const body11 = await res11.json();
    expect(body11.error).toContain("Stream / Group selection is mandatory");

    const req12 = new Request("http://localhost:3000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Arun",
        grade: 12,
        board: "cbse",
      }),
    });
    const res12 = await POST(req12);
    expect(res12.status).toBe(400);
    const body12 = await res12.json();
    expect(body12.error).toContain("Stream / Group selection is mandatory");
  });

  it("successfully creates profile for Class 6 with board and no seniorGroup", async () => {
    const req = new Request("http://localhost:3000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Meera",
        grade: 6,
        board: "cbse",
        preferredLanguage: "en",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.profile.name).toBe("Meera");
    expect(body.profile.grade).toBe(6);
    expect(body.profile.board).toBe("cbse");
    expect(body.profile.seniorGroup).toBeUndefined();
  });

  it("successfully creates profile for Class 12 with Computer Science stream", async () => {
    const req = new Request("http://localhost:3000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dhanush",
        grade: 12,
        board: "tn_state",
        seniorGroup: "cs",
        preferredLanguage: "en",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.profile.name).toBe("Dhanush");
    expect(body.profile.grade).toBe(12);
    expect(body.profile.seniorGroup).toBe("cs");
  });

  it("successfully retrieves saved profile via GET", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.profile).toBeDefined();
    expect(body.profile.name).toBe("Dhanush");
  });

  it("updates stream in profile via PATCH", async () => {
    const req = new Request("http://localhost:3000/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seniorGroup: "biology",
      }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.profile.seniorGroup).toBe("biology");
  });
});
