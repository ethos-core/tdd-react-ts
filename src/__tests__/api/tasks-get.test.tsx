import { render, screen } from "../../test/test-utils";
import { TaskList } from "../../components/features/TaskList";
import { server } from "../../mocks/server";
import { handlers, resetTasks } from "../../mocks/handlers";

describe("タスク一覧取得", () => {
  beforeEach(() => {
    resetTasks();
    server.use(...handlers);
  });

  it("タスク一覧が正しく表示される", async () => {
    render(<TaskList />);

    expect(await screen.findByText("React コンポーネント設計")).toBeInTheDocument();
    expect(screen.getByText("API エンドポイント実装")).toBeInTheDocument();
    expect(screen.getByText("テスト追加")).toBeInTheDocument();
  });

  it("読み込み中はスピナーが表示される", () => {
    render(<TaskList />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("読み込み完了後にスピナーが消える", async () => {
    render(<TaskList />);

    await screen.findByText("React コンポーネント設計");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});