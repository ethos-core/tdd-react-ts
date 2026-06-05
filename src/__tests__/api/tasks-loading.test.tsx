import { render, screen, waitFor } from "../../test/test-utils";
import { http, HttpResponse, delay } from "msw";
import { server } from "../../mocks/server";
import { TaskApp } from "../../components/features/TaskApp";

describe("ローディング状態", () => {
  it("データ取得中にスケルトンが表示される", async () => {
    server.use(
      http.get("/api/tasks", async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })
    );

    render(<TaskApp />);

    expect(screen.getByTestId("task-skeleton")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByTestId("task-skeleton")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("長時間応答がない場合にタイムアウトメッセージが表示される", { timeout: 20000 }, async () => {
    server.use(
      http.get("/api/tasks", async () => {
        await delay("infinite");
        return HttpResponse.json([]);
      })
    );

    render(<TaskApp />);

    expect(
      await screen.findByText(/応答がありません/i, {}, { timeout: 15000 })
    ).toBeInTheDocument();
  });

  it("リトライボタンで再取得できる", async () => {
    let callCount = 0;
    server.use(
      http.get("/api/tasks", async () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.error();
        }
        return HttpResponse.json([
          {
            id: "1",
            title: "再取得成功",
            description: "",
            priority: "medium",
            status: "todo",
            createdAt: new Date().toISOString(),
          },
        ]);
      })
    );

    render(<TaskApp />);

    const retryButton = await screen.findByRole("button", { name: /再試行/i });
    await retryButton.click();

    expect(await screen.findByText("再取得成功")).toBeInTheDocument();
  });
});

