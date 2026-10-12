import { DevImpersonateDTOSchema } from "./dev.dto";

describe("DevImpersonateDTOSchema", () => {
  it("accepts a UUID user id", () => {
    const userId = "2f1c4b8e-7d9a-4c3e-9f0b-1a2b3c4d5e6f";
    expect(DevImpersonateDTOSchema.parse({ userId })).toEqual({ userId });
  });

  it("rejects a non-UUID or missing user id", () => {
    expect(DevImpersonateDTOSchema.safeParse({ userId: "1" }).success).toBe(
      false,
    );
    expect(DevImpersonateDTOSchema.safeParse({}).success).toBe(false);
  });
});
