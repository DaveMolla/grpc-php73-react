import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";

vi.mock("../src/lib/grpcClient", () => ({
    grpcClient: {
        ping: (_req: any, _meta: any, cb: any) => cb(null, { getMessage: () => "hello" })
    }
}));

it("shows echoed message", async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Type a message/i), { target: { value: "x" } });
    fireEvent.click(screen.getByText(/Send to backend/i));
    expect(await screen.findByText(/hello/)).toBeInTheDocument();
});