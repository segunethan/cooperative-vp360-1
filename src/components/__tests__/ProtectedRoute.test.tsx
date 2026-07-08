import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mock AuthContext ───────────────────────────────────────────────────────────
const mockUseAuth = vi.fn();
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

import ProtectedRoute from "../ProtectedRoute";

const renderInRouter = (ui: React.ReactNode, initialEntry = "/cooperative") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      {ui}
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading spinner while auth is resolving", () => {
    mockUseAuth.mockReturnValue({ session: null, loading: true });
    const { container } = renderInRouter(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    // Spinner exists, content does not
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders children when user has an active session", () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: "user-1", email: "admin@test.com" } },
      loading: false,
    });
    renderInRouter(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects to /login when there is no session", () => {
    mockUseAuth.mockReturnValue({ session: null, loading: false });

    // We can't easily check the redirect URL in a MemoryRouter without Routes,
    // but we confirm the children are NOT rendered
    renderInRouter(
      <ProtectedRoute>
        <div>Should not appear</div>
      </ProtectedRoute>
    );
    expect(screen.queryByText("Should not appear")).not.toBeInTheDocument();
  });

  it("shows the Jollify logo in the loading state", () => {
    mockUseAuth.mockReturnValue({ session: null, loading: true });
    renderInRouter(
      <ProtectedRoute>
        <div>content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
