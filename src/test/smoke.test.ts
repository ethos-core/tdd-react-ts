describe("Setup verification", () => {
    it("can run tests", () => {
      expect(1 + 1).toBe(2);
    });
  
    it("can use DOM matchers", () => {
      const element = document.createElement("div");
      element.textContent = "Hello";
      document.body.appendChild(element);
      expect(element).toBeInTheDocument();
      document.body.removeChild(element);
    });
});
