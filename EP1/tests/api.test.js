// External libraries
const request = require("supertest");

// API module
const API = require("../src/api");

describe("The project", () => {
  let api, mockColl, mockDb, mongoClient, stanConn;
  const corsOptions = { origin: "*" };

  const secret = "SUPERSECRET";

  beforeEach(() => {
    mockColl = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    mockDb = { collection: () => mockColl };

    mongoClient = { db: () => mockDb };

    stanConn = { publish: jest.fn() };

    api = API(corsOptions, { mongoClient, stanConn, secret });
  });

  it("can use Jest", () => {
    expect(true).toBe(true);
  });

  it("can use Supertest", async () => {
    const response = await request(api).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toBe("Hello, World!");
  });

  it("can use CORS", async () => {
    const response = await request(api).get("/");
    const cors_header = response.header["access-control-allow-origin"];
    expect(cors_header).toBe("*");
  });

  it("creates an user", async () => {
    const pw = "123456foo";
    const newUser = {
      name: "Foo",
      email: "foo@example.com",
      password: pw,
      passwordConfirmation: pw,
    };

    const response = await request(api).post("/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(stanConn.publish).toHaveBeenCalled();
    expect(mockColl.findOne).toHaveBeenCalled();
    expect(mockColl.insertOne).not.toHaveBeenCalled();
  });

  it("allows a registered user to delete its account", async () => {
    const uid = "608ef5cc069020a1d61d5380";
    const correctToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGVmNWNjMDY5MDIwYTFkNjFkNTM4MCJ9.DU55f1y8dGSJPWYXrHUUwU0zGc-N8FixQqontudI4RE";

    const response = await request(api)
      .delete(`/users/${uid}`)
      .set("Authentication", `Bearer ${correctToken}`);

    expect(response.status).toBe(200);
    expect(mockColl.deleteOne).toHaveBeenCalled();
  });

  it("blocks a registered user to delete anothers account", async () => {
    const uid = "608ef5cc069020a1d61d5380";
    const wrongToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGZmNWNjMDY5MDIwYTFkNjFkNTM4MCJ9.J7xckIJZlqkmZBomOG8CIBJPYYen7I8Mx3hUn1rVnWc";

    const response = await request(api)
      .delete(`/users/${uid}`)
      .set("Authentication", `Bearer ${wrongToken}`);

    expect(response.status).toBe(401);
    expect(mockColl.deleteOne).not.toHaveBeenCalled();
  });
});
