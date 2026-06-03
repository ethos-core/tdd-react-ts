describe("セットアップ確認", () => {
    it("テストが実行できる", () => {
      expect(1 + 1).toBe(2);
    });
  
    it("DOM マッチャーが使える", () => {
      const element = document.createElement("div");
      element.textContent = "Hello";
      document.body.appendChild(element);
      expect(element).toBeInTheDocument();
      document.body.removeChild(element);
    });
});