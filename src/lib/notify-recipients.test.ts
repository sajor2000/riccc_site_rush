import { afterEach, describe, expect, it } from "vitest";
import { getNotifyRecipients } from "./notify-recipients";

describe("getNotifyRecipients", () => {
  afterEach(() => {
    delete process.env.NOTIFY_EMAILS;
  });

  it("defaults to owner Gmail first", () => {
    delete process.env.NOTIFY_EMAILS;
    const list = getNotifyRecipients();
    expect(list[0]).toBe("juancroj@gmail.com");
    expect(list).toContain("juan_rojas@rush.edu");
    expect(list).toContain("Kevin_Buell@rush.edu");
  });

  it("honors NOTIFY_EMAILS override", () => {
    process.env.NOTIFY_EMAILS = " a@x.com , b@y.com ";
    expect(getNotifyRecipients()).toEqual(["a@x.com", "b@y.com"]);
  });
});
