import { describe, expect, it } from "vitest";

import { ActionValidationError, getEnumField, getNumberField, getRequiredString } from "../../server/actions/admin/form-validation";

describe("admin form validation", () => {
  it("reads required string fields", () => {
    const formData = new FormData();
    formData.set("name", "  Tournament  ");

    expect(getRequiredString(formData, "name", "Name")).toBe("Tournament");
  });

  it("rejects invalid enums", () => {
    const formData = new FormData();
    formData.set("visibility", "secret");

    expect(() => getEnumField(formData, "visibility", ["public", "admin"] as const, "Visibility")).toThrow(ActionValidationError);
  });

  it("rejects invalid numbers", () => {
    const formData = new FormData();
    formData.set("seed", "0");

    expect(() => getNumberField(formData, "seed", "Seed", { min: 1 })).toThrow(ActionValidationError);
  });
});
